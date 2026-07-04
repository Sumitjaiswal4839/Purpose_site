// ── Structured Logger ────────────────────────────────────────────────────────
// Production: JSON output for warn/error only
// Development: colorized console output

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMeta {
  [key: string]: unknown;
}

const isProd = process.env.NODE_ENV === 'production';

// ANSI color codes for development
const colors: Record<LogLevel, string> = {
  info: '\x1b[36m',   // cyan
  warn: '\x1b[33m',   // yellow
  error: '\x1b[31m',  // red
  debug: '\x1b[35m',  // magenta
};
const reset = '\x1b[0m';

function formatTimestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, message: string, meta?: LogMeta): void {
  // In production, skip info and debug
  if (isProd && (level === 'info' || level === 'debug')) return;

  const timestamp = formatTimestamp();

  if (isProd) {
    // JSON structured output
    const entry = JSON.stringify({ level, message, timestamp, ...meta });
    if (level === 'error') {
      console.error(entry);
    } else {
      console.warn(entry);
    }
  } else {
    // Colorized dev output
    const color = colors[level];
    const prefix = `${color}[${level.toUpperCase()}]${reset} ${timestamp}`;
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    const output = `${prefix} ${message}${metaStr}`;

    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else if (level === 'debug') {
      console.debug(output);
    } else {
      console.log(output);
    }
  }
}

export const logger = {
  info: (message: string, meta?: LogMeta) => log('info', message, meta),
  warn: (message: string, meta?: LogMeta) => log('warn', message, meta),
  error: (message: string, meta?: LogMeta) => log('error', message, meta),
  debug: (message: string, meta?: LogMeta) => log('debug', message, meta),
};

// ── Request logger helper for API routes ────────────────────────────────────
export function requestLogger(
  req: { method?: string; url?: string },
  status: number,
  durationMs: number
): void {
  const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
  log(level, `${req.method ?? 'UNKNOWN'} ${req.url ?? '/'}`, {
    status,
    duration: `${durationMs}ms`,
  });
}
