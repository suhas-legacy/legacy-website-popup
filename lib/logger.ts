import winston from 'winston';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a logger that outputs structured JSON logs for GCP Cloud Logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'legacy-website-popup',
  },
  transports: [
    // Console transport with JSON format for GCP Cloud Logging
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});

// If we're in development and not in production, also add pretty print
if (process.env.NODE_ENV !== 'production' && !isBrowser) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// For client-side usage, we need a simpler logger since winston won't work in browser
export const clientLogger = {
  info: (message: string, meta?: any) => {
    if (isBrowser) {
      console.log(JSON.stringify({
        severity: 'INFO',
        message,
        ...meta,
        timestamp: new Date().toISOString(),
      }));
    } else {
      logger.info(message, meta);
    }
  },
  error: (message: string, meta?: any) => {
    if (isBrowser) {
      console.error(JSON.stringify({
        severity: 'ERROR',
        message,
        ...meta,
        timestamp: new Date().toISOString(),
      }));
    } else {
      logger.error(message, meta);
    }
  },
  warn: (message: string, meta?: any) => {
    if (isBrowser) {
      console.warn(JSON.stringify({
        severity: 'WARNING',
        message,
        ...meta,
        timestamp: new Date().toISOString(),
      }));
    } else {
      logger.warn(message, meta);
    }
  },
  debug: (message: string, meta?: any) => {
    if (isBrowser) {
      console.debug(JSON.stringify({
        severity: 'DEBUG',
        message,
        ...meta,
        timestamp: new Date().toISOString(),
      }));
    } else {
      logger.debug(message, meta);
    }
  },
};

export default logger;
