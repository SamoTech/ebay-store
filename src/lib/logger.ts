export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

function write(entry: LogEntry): void {
  const payload = JSON.stringify(entry);
  if (entry.level === 'error') {
    process.stderr.write(`${payload}\n`);
    return;
  }
  process.stdout.write(`${payload}\n`);
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  write({ level, message, timestamp: new Date().toISOString(), context });
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
};
