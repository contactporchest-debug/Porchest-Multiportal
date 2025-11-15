/**
 * Structured Logging Utility
 *
 * Production-ready logging with:
 * - Request IDs and correlation tracking
 * - Structured JSON logs for production
 * - Pretty printing for development
 * - Automatic PII redaction
 * - Sentry integration ready
 * - Performance monitoring
 */

import "server-only";

// --- LOG LEVELS --- //
export enum LogLevel {
  TRACE = 10,
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50,
  FATAL = 60,
}

// --- LOGGER CONFIGURATION --- //
const config = {
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "INFO" : "DEBUG"),
  prettyPrint: process.env.NODE_ENV !== "production",
  redactPaths: [
    "password",
    "password_hash",
    "*.password",
    "*.password_hash",
    "authorization",
    "*.authorization",
    "cookie",
    "*.cookie",
    "secret",
    "*.secret",
    "token",
    "*.token",
    "apiKey",
    "*.apiKey",
  ],
};

// --- LOGGER INTERFACE --- //
export interface LogContext {
  requestId?: string;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  duration?: number;
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};

  /**
   * Set context that will be included in all subsequent logs
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Clear all context
   */
  clearContext(): void {
    this.context = {};
  }

  /**
   * Get current context
   */
  getContext(): LogContext {
    return { ...this.context };
  }

  /**
   * Redact sensitive data from object
   */
  private redact(obj: any): any {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    const redacted = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const path of config.redactPaths) {
      const keys = path.split(".");
      let current = redacted;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key === "*") {
          // Wildcard - redact all nested objects
          if (typeof current === "object") {
            for (const subKey in current) {
              if (typeof current[subKey] === "object") {
                current[subKey] = this.redact(current[subKey]);
              }
            }
          }
          break;
        } else {
          if (!current[key]) break;
          current = current[key];
        }
      }

      const lastKey = keys[keys.length - 1];
      if (lastKey !== "*" && current && typeof current === "object") {
        if (lastKey in current) {
          current[lastKey] = "[REDACTED]";
        }
      }
    }

    return redacted;
  }

  /**
   * Format log entry
   */
  private format(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const context = this.redact({ ...this.context, ...meta });

    if (config.prettyPrint) {
      // Pretty print for development
      const levelColors: Record<string, string> = {
        TRACE: "\x1b[37m", // white
        DEBUG: "\x1b[36m", // cyan
        INFO: "\x1b[32m",  // green
        WARN: "\x1b[33m",  // yellow
        ERROR: "\x1b[31m", // red
        FATAL: "\x1b[35m", // magenta
      };

      const reset = "\x1b[0m";
      const color = levelColors[level] || "";

      let output = `${color}[${timestamp}] ${level}${reset}: ${message}`;

      if (Object.keys(context).length > 0) {
        output += `\n  ${JSON.stringify(context, null, 2)}`;
      }

      return output;
    } else {
      // Structured JSON for production
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...context,
      });
    }
  }

  /**
   * Log trace message
   */
  trace(message: string, meta?: any): void {
    if (LogLevel.TRACE >= this.getLogLevel()) {
      console.log(this.format("TRACE", message, meta));
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: any): void {
    if (LogLevel.DEBUG >= this.getLogLevel()) {
      console.log(this.format("DEBUG", message, meta));
    }
  }

  /**
   * Log info message
   */
  info(message: string, meta?: any): void {
    if (LogLevel.INFO >= this.getLogLevel()) {
      console.log(this.format("INFO", message, meta));
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: any): void {
    if (LogLevel.WARN >= this.getLogLevel()) {
      console.warn(this.format("WARN", message, meta));
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | any, meta?: any): void {
    if (LogLevel.ERROR >= this.getLogLevel()) {
      const errorMeta = error instanceof Error
        ? {
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name,
            },
            ...meta,
          }
        : { error, ...meta };

      console.error(this.format("ERROR", message, errorMeta));

      // Send to Sentry in production
      if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
        // Sentry integration point
        // Sentry.captureException(error, { contexts: { custom: errorMeta } });
      }
    }
  }

  /**
   * Log fatal message
   */
  fatal(message: string, error?: Error | any, meta?: any): void {
    const errorMeta = error instanceof Error
      ? {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          ...meta,
        }
      : { error, ...meta };

    console.error(this.format("FATAL", message, errorMeta));

    // Send to Sentry in production
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      // Sentry integration point
      // Sentry.captureException(error, { contexts: { custom: errorMeta } });
    }
  }

  /**
   * Get current log level as number
   */
  private getLogLevel(): number {
    const levelMap: Record<string, number> = {
      TRACE: LogLevel.TRACE,
      DEBUG: LogLevel.DEBUG,
      INFO: LogLevel.INFO,
      WARN: LogLevel.WARN,
      ERROR: LogLevel.ERROR,
      FATAL: LogLevel.FATAL,
    };

    return levelMap[config.level] || LogLevel.INFO;
  }

  /**
   * Create child logger with additional context
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger();
    childLogger.setContext({ ...this.context, ...context });
    return childLogger;
  }
}

// --- SINGLETON LOGGER --- //
export const logger = new Logger();

// --- REQUEST LOGGER MIDDLEWARE --- //

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create logger with request context
 */
export function createRequestLogger(req: Request): Logger {
  const requestId = generateRequestId();
  const url = new URL(req.url);

  return logger.child({
    requestId,
    method: req.method,
    path: url.pathname,
    userAgent: req.headers.get("user-agent") || undefined,
  });
}

/**
 * Log API request/response
 */
export async function logApiRequest(
  req: Request,
  handler: (logger: Logger) => Promise<Response>
): Promise<Response> {
  const requestLogger = createRequestLogger(req);
  const startTime = Date.now();

  requestLogger.info("API request started");

  try {
    const response = await handler(requestLogger);
    const duration = Date.now() - startTime;

    requestLogger.info("API request completed", {
      status: response.status,
      duration,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;

    requestLogger.error("API request failed", error, {
      duration,
    });

    throw error;
  }
}

// --- PERFORMANCE MONITORING --- //

/**
 * Time a function execution
 */
export async function timeFunction<T>(
  name: string,
  fn: () => Promise<T>,
  loggerInstance: Logger = logger
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - startTime;

    loggerInstance.debug(`${name} completed`, { duration });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    loggerInstance.error(`${name} failed`, error, { duration });

    throw error;
  }
}

// --- EXPORT --- //
export default logger;
