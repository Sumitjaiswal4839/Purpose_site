// ── Input Sanitization Utility ───────────────────────────────────────────────
// Pure JS/TS — no external dependencies

/**
 * Trims whitespace, strips HTML tags, and limits to maxLength characters.
 */
export function sanitizeString(str: unknown, maxLength = 500): string {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/&[a-z]+;/gi, '') // strip HTML entities
    .slice(0, maxLength);
}

/**
 * Validates email format. Returns the lowercased email or null if invalid.
 */
export function sanitizeEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  // RFC 5322-ish simplified regex
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) return null;
  if (trimmed.length > 254) return null;
  return trimmed;
}

/**
 * Validates and sanitizes a phone number.
 * Accepts Indian 10-digit numbers with optional +91 prefix.
 * Returns cleaned digits-only string or null if invalid.
 *
 * Issue #22 fix: backend-side phone validation
 */
export function sanitizePhone(phone: unknown): string | null {
  if (typeof phone !== 'string') return null;
  const digits = phone.replace(/\D/g, '');
  // Strip leading 91 prefix if present (keep last 10 digits)
  const normalized = digits.length === 12 && digits.startsWith('91')
    ? digits.slice(2)
    : digits.length === 13 && digits.startsWith('091')
    ? digits.slice(3)
    : digits;
  // Must be exactly 10 digits starting with 6-9 (Indian mobile)
  if (!/^[6-9]\d{9}$/.test(normalized)) return null;
  return normalized;
}
export function sanitizeNumber(val: unknown, min: number, max: number): number {
  const parsed = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(parsed)) return min;
  return Math.min(Math.max(parsed, min), max);
}

// ── Schema-based object sanitizer ───────────────────────────────────────────

type StringSchema = {
  type: 'string';
  maxLength?: number;
};

type EmailSchema = {
  type: 'email';
};

type NumberSchema = {
  type: 'number';
  min: number;
  max: number;
};

type EnumSchema = {
  type: 'enum';
  values: string[];
  default?: string;
};

type FieldSchema = StringSchema | EmailSchema | NumberSchema | EnumSchema;

export type SanitizeSchema = Record<string, FieldSchema>;

/**
 * Applies sanitizers to object fields based on a schema definition.
 * Returns a new object with sanitized values.
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: Record<string, unknown>,
  schema: SanitizeSchema
): Partial<T> {
  const result: Record<string, unknown> = {};

  for (const [field, rule] of Object.entries(schema)) {
    const raw = obj[field];

    switch (rule.type) {
      case 'string':
        result[field] = sanitizeString(raw, rule.maxLength ?? 500);
        break;

      case 'email':
        result[field] = sanitizeEmail(raw);
        break;

      case 'number':
        result[field] = sanitizeNumber(raw, rule.min, rule.max);
        break;

      case 'enum': {
        const strVal = typeof raw === 'string' ? raw.trim() : '';
        result[field] = rule.values.includes(strVal)
          ? strVal
          : (rule.default ?? rule.values[0] ?? '');
        break;
      }
    }
  }

  return result as Partial<T>;
}
