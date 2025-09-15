const { logger } = require('../utils/logger');

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  try {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
  } catch (error) {
    logger.error('[NotFound] Error:', error);
    next(error);
  }
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  try {
    let error = err;

    // Log the error
    logger.error('[ErrorHandler] Error details:', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    });

    // Handle different types of errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      error = new ApiError(400, message);
    }

    if (error.name === 'CastError') {
      const message = `Invalid ${error.path}: ${error.value}`;
      error = new ApiError(400, message);
    }

    if (error.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new ApiError(400, message);
    }

    if (error.name === 'JsonWebTokenError') {
      const message = 'Invalid token. Please log in again!';
      error = new ApiError(401, message);
    }

    if (error.name === 'TokenExpiredError') {
      const message = 'Token expired. Please log in again!';
      error = new ApiError(401, message);
    }

    if (error.name === 'MongoError') {
      const message = 'Database operation failed';
      error = new ApiError(500, message);
    }

    // Handle Joi validation errors
    if (error.isJoi) {
      const message = error.details.map(detail => detail.message).join(', ');
      error = new ApiError(400, message);
    }

    // Handle axios errors
    if (error.isAxiosError) {
      const message = error.response?.data?.message || 'External API request failed';
      error = new ApiError(error.response?.status || 500, message);
    }

    // Set default values if not an ApiError
    if (!(error instanceof ApiError)) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';
      error = new ApiError(statusCode, message, false);
    }

    // Determine if we should send detailed error information
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';

    // Prepare error response
    const errorResponse = {
      success: false,
      error: error.message,
      ...(isDevelopment && {
        stack: error.stack,
        timestamp: error.timestamp,
        path: req.originalUrl,
        method: req.method,
      }),
    };

    // Add additional error details for specific error types
    if (error.name === 'ValidationError' && error.errors) {
      errorResponse.details = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
    }

    // Send error response
    res.status(error.statusCode).json(errorResponse);

    // Log additional information for non-operational errors
    if (!error.isOperational) {
      logger.error('[ErrorHandler] Non-operational error:', {
        error: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
      });
    }

  } catch (handlerError) {
    logger.error('[ErrorHandler] Error in error handler:', handlerError);
    
    // Fallback error response
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    try {
      Promise.resolve(fn(req, res, next)).catch(next);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Error boundary for unhandled errors
 */
const errorBoundary = (err, req, res, next) => {
  try {
    logger.error('[ErrorBoundary] Unhandled error:', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred. Please try again later.',
    });
  } catch (boundaryError) {
    logger.error('[ErrorBoundary] Error in boundary:', boundaryError);
    
    res.status(500).json({
      success: false,
      error: 'Critical System Error',
      message: 'System is temporarily unavailable. Please try again later.',
    });
  }
};

/**
 * Request timeout handler
 */
const timeoutHandler = (timeout = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      try {
        logger.warn('[TimeoutHandler] Request timeout:', {
          url: req.originalUrl,
          method: req.method,
          timeout,
        });

        if (!res.headersSent) {
          res.status(408).json({
            success: false,
            error: 'Request Timeout',
            message: 'The request took too long to process. Please try again.',
          });
        }
      } catch (error) {
        logger.error('[TimeoutHandler] Error handling timeout:', error);
      }
    }, timeout);

    res.on('finish', () => {
      clearTimeout(timer);
    });

    next();
  };
};

/**
 * Rate limit error handler
 */
const rateLimitErrorHandler = (req, res, next) => {
  try {
    if (req.rateLimit) {
      logger.warn('[RateLimit] Rate limit exceeded:', {
        ip: req.ip,
        url: req.originalUrl,
        limit: req.rateLimit.limit,
        remaining: req.rateLimit.remaining,
      });
    }
    next();
  } catch (error) {
    logger.error('[RateLimit] Error in rate limit handler:', error);
    next();
  }
};

/**
 * Database connection error handler
 */
const databaseErrorHandler = (error) => {
  try {
    logger.error('[DatabaseError] Database connection error:', {
      error: error.message,
      code: error.code,
      stack: error.stack,
    });

    // Attempt to reconnect or notify administrators
    if (process.env.NODE_ENV === 'production') {
      // Send alert to monitoring service
      logger.error('[DatabaseError] Production database error - alerting administrators');
    }
  } catch (handlerError) {
    logger.error('[DatabaseError] Error in database error handler:', handlerError);
  }
};

/**
 * Memory leak detection
 */
const memoryLeakHandler = () => {
  try {
    const used = process.memoryUsage();
    const memoryUsage = {
      rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`,
    };

    logger.info('[MemoryLeak] Memory usage:', memoryUsage);

    // Alert if memory usage is high
    const heapUsedMB = used.heapUsed / 1024 / 1024;
    if (heapUsedMB > 500) { // 500MB threshold
      logger.warn('[MemoryLeak] High memory usage detected:', memoryUsage);
    }
  } catch (error) {
    logger.error('[MemoryLeak] Error checking memory usage:', error);
  }
};

// Set up memory monitoring
setInterval(memoryLeakHandler, 300000); // Check every 5 minutes

module.exports = {
  ApiError,
  notFound,
  errorHandler,
  asyncHandler,
  errorBoundary,
  timeoutHandler,
  rateLimitErrorHandler,
  databaseErrorHandler,
  memoryLeakHandler,
}; 