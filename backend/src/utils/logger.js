const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define file format (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: logFormat,
    level: process.env.LOG_LEVEL || 'info',
  }),
];

// Add file transports for production
if (process.env.NODE_ENV === 'production') {
  // Error log file
  transports.push(
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: fileFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    })
  );

  // Combined log file
  transports.push(
    new DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: fileFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    })
  );

  // HTTP requests log file
  transports.push(
    new DailyRotateFile({
      filename: path.join(logsDir, 'http-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      format: fileFormat,
      maxSize: '20m',
      maxFiles: '7d',
      zippedArchive: true,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: fileFormat,
  transports,
  // Handle uncaught exceptions
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: fileFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: fileFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  ],
});

// Custom logging methods with context
const customLogger = {
  info: (message, meta = {}) => {
    try {
      logger.info(message, { ...meta, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('[Logger] Error logging info:', error);
    }
  },

  error: (message, error = null, meta = {}) => {
    try {
      const logData = {
        ...meta,
        timestamp: new Date().toISOString(),
        ...(error && {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code,
          },
        }),
      };
      logger.error(message, logData);
    } catch (logError) {
      console.error('[Logger] Error logging error:', logError);
    }
  },

  warn: (message, meta = {}) => {
    try {
      logger.warn(message, { ...meta, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('[Logger] Error logging warning:', error);
    }
  },

  debug: (message, meta = {}) => {
    try {
      logger.debug(message, { ...meta, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('[Logger] Error logging debug:', error);
    }
  },

  http: (message, meta = {}) => {
    try {
      logger.http(message, { ...meta, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('[Logger] Error logging http:', error);
    }
  },

  // API request logging
  logApiRequest: (req, res, responseTime) => {
    try {
      const logData = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id || 'anonymous',
        timestamp: new Date().toISOString(),
      };

      if (res.statusCode >= 400) {
        logger.warn(`API Request: ${req.method} ${req.originalUrl}`, logData);
      } else {
        logger.http(`API Request: ${req.method} ${req.originalUrl}`, logData);
      }
    } catch (error) {
      console.error('[Logger] Error logging API request:', error);
    }
  },

  // Database operation logging
  logDatabaseOperation: (operation, collection, duration, success, error = null) => {
    try {
      const logData = {
        operation,
        collection,
        duration: `${duration}ms`,
        success,
        timestamp: new Date().toISOString(),
        ...(error && {
          error: {
            message: error.message,
            code: error.code,
          },
        }),
      };

      if (success) {
        logger.debug(`Database ${operation} on ${collection}`, logData);
      } else {
        logger.error(`Database ${operation} failed on ${collection}`, error, logData);
      }
    } catch (logError) {
      console.error('[Logger] Error logging database operation:', logError);
    }
  },

  // Authentication logging
  logAuth: (action, userId, success, details = {}) => {
    try {
      const logData = {
        action,
        userId,
        success,
        ip: details.ip,
        userAgent: details.userAgent,
        timestamp: new Date().toISOString(),
      };

      if (success) {
        logger.info(`Auth ${action} successful for user ${userId}`, logData);
      } else {
        logger.warn(`Auth ${action} failed for user ${userId}`, logData);
      }
    } catch (error) {
      console.error('[Logger] Error logging auth:', error);
    }
  },

  // Order logging
  logOrder: (action, orderId, userId, details = {}) => {
    try {
      const logData = {
        action,
        orderId,
        userId,
        details,
        timestamp: new Date().toISOString(),
      };

      logger.info(`Order ${action}: ${orderId}`, logData);
    } catch (error) {
      console.error('[Logger] Error logging order:', error);
    }
  },

  // Performance logging
  logPerformance: (operation, duration, details = {}) => {
    try {
      const logData = {
        operation,
        duration: `${duration}ms`,
        details,
        timestamp: new Date().toISOString(),
      };

      if (duration > 1000) {
        logger.warn(`Slow operation: ${operation} took ${duration}ms`, logData);
      } else {
        logger.debug(`Performance: ${operation} took ${duration}ms`, logData);
      }
    } catch (error) {
      console.error('[Logger] Error logging performance:', error);
    }
  },

  // Security logging
  logSecurity: (event, details = {}) => {
    try {
      const logData = {
        event,
        details,
        timestamp: new Date().toISOString(),
      };

      logger.warn(`Security event: ${event}`, logData);
    } catch (error) {
      console.error('[Logger] Error logging security:', error);
    }
  },

  // Business logic logging
  logBusiness: (event, details = {}) => {
    try {
      const logData = {
        event,
        details,
        timestamp: new Date().toISOString(),
      };

      logger.info(`Business event: ${event}`, logData);
    } catch (error) {
      console.error('[Logger] Error logging business event:', error);
    }
  },
};

// Middleware for request logging
const requestLogger = (req, res, next) => {
  try {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      customLogger.logApiRequest(req, res, duration);
    });

    next();
  } catch (error) {
    console.error('[RequestLogger] Error:', error);
    next();
  }
};

// Error logging middleware
const errorLogger = (error, req, res, next) => {
  try {
    customLogger.error('Unhandled error', error, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous',
    });
    next(error);
  } catch (logError) {
    console.error('[ErrorLogger] Error logging error:', logError);
    next(error);
  }
};

// Export both the winston logger and custom logger
module.exports = {
  logger: customLogger,
  winstonLogger: logger,
  requestLogger,
  errorLogger,
}; 