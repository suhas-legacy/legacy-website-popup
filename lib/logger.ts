// Structured JSON logger for GCP Cloud Logging
// Works in both client and server environments
// Cloud Run automatically captures console output and sends to Cloud Logging
// The JSON format ensures proper parsing and searchability

const createLogEntry = (severity: string, message: string, meta?: any) => ({
  severity,
  message,
  ...meta,
  timestamp: new Date().toISOString(),
  service: 'legacy-website-popup',
});

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify(createLogEntry('INFO', message, meta)));
  },
  error: (message: string, meta?: any) => {
    console.error(JSON.stringify(createLogEntry('ERROR', message, meta)));
  },
  warn: (message: string, meta?: any) => {
    console.warn(JSON.stringify(createLogEntry('WARNING', message, meta)));
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(JSON.stringify(createLogEntry('DEBUG', message, meta)));
    }
  },
};

export const clientLogger = logger;

export default logger;
