import crypto from 'crypto';

/**
 * Encryption utilities using SHA256 and AES encryption
 */

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET_KEY || 'default-secret-key-change-in-production';

/**
 * Hash a value using SHA256
 */
export function hashSHA256(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value + ENCRYPTION_SECRET)
    .digest('hex');
}

/**
 * Verify a SHA256 hash
 */
export function verifySHA256(value: string, hash: string): boolean {
  const newHash = hashSHA256(value);
  return newHash === hash;
}

/**
 * Encrypt sensitive data using AES-256-GCM
 */
export function encryptAES(text: string): string {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(ENCRYPTION_SECRET, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt AES-256-GCM encrypted data
 */
export function decryptAES(encryptedText: string): string {
  try {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(ENCRYPTION_SECRET, 'salt', 32);
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

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
 * Generate a secure random token
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate verification token with expiry
 */
export function generateVerificationToken(): {
  token: string;
  hash: string;
  expiresAt: Date;
} {
  const token = generateSecureToken();
  const hash = hashSHA256(token);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

  return { token, hash, expiresAt };
}
