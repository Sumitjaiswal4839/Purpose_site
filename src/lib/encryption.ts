import crypto from 'crypto';

// ── Issue #5 fix: fail loudly instead of silently using a known public fallback ──
function getEncryptionSecret(): string {
  const secret = process.env.ENCRYPTION_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[encryption] ENCRYPTION_SECRET_KEY environment variable is not set. Cannot start in production without it.');
    }
    // Dev-only warning — never a silent public default
    console.warn('[encryption] WARNING: ENCRYPTION_SECRET_KEY not set. Using dev-only key. Set this in .env.local immediately.');
    return 'dev-only-key-DO-NOT-USE-IN-PRODUCTION-32ch';
  }
  if (secret.length < 32) {
    throw new Error('[encryption] ENCRYPTION_SECRET_KEY must be at least 32 characters long.');
  }
  return secret;
}

const ENCRYPTION_SECRET = getEncryptionSecret();

// ── Issue #18 fix: use a random per-call salt for scrypt, not hardcoded 'salt' ──
// NOTE: AES key derivation now uses a random 16-byte salt stored with the ciphertext.
// Format: salt_hex:iv_hex:authTag_hex:ciphertext_hex

/**
 * Hash a value using HMAC-SHA256 (keyed, not plain SHA256)
 */
export function hashSHA256(value: string): string {
  return crypto
    .createHmac('sha256', ENCRYPTION_SECRET)
    .update(value)
    .digest('hex');
}

/**
 * Verify an HMAC-SHA256 hash in constant time
 */
export function verifySHA256(value: string, hash: string): boolean {
  const newHash = hashSHA256(value);
  if (newHash.length !== hash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(newHash), Buffer.from(hash));
}

/**
 * Encrypt sensitive data using AES-256-GCM with a random per-call salt.
 * Output format: salt_hex:iv_hex:authTag_hex:ciphertext_hex
 */
export function encryptAES(text: string): string {
  const algorithm = 'aes-256-gcm';
  const salt = crypto.randomBytes(16);                          // random salt each time
  const key = crypto.scryptSync(ENCRYPTION_SECRET, salt, 32);  // derive key from random salt
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return [
    salt.toString('hex'),
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted,
  ].join(':');
}

/**
 * Decrypt AES-256-GCM encrypted data (supports both old and new format)
 */
export function decryptAES(encryptedText: string): string {
  try {
    const algorithm = 'aes-256-gcm';
    const parts = encryptedText.split(':');

    let salt: Buffer;
    let iv: Buffer;
    let authTag: Buffer;
    let encrypted: string;

    if (parts.length === 4) {
      // New format: salt:iv:authTag:ciphertext
      salt = Buffer.from(parts[0], 'hex');
      iv = Buffer.from(parts[1], 'hex');
      authTag = Buffer.from(parts[2], 'hex');
      encrypted = parts[3];
    } else if (parts.length === 3) {
      // Legacy format (hardcoded salt 'salt'): iv:authTag:ciphertext
      salt = Buffer.from('salt');
      iv = Buffer.from(parts[0], 'hex');
      authTag = Buffer.from(parts[1], 'hex');
      encrypted = parts[2];
    } else {
      throw new Error('Invalid encrypted text format');
    }

    const key = crypto.scryptSync(ENCRYPTION_SECRET, salt, 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Generate a secure random token (64 hex chars)
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate verification token with 24-hour expiry
 */
export function generateVerificationToken(): {
  token: string;
  hash: string;
  expiresAt: Date;
} {
  const token = generateSecureToken();
  const hash = hashSHA256(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, hash, expiresAt };
}
