const { logger } = require('../utils/logger');

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      
      if (error) {
        logger.warn('[ValidationMiddleware] Validation failed', {
          error: error.details[0].message
        });
        
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }
      
      next();
    } catch (error) {
      logger.error('[ValidationMiddleware] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Validation error'
      });
    }
  };
};

module.exports = {
  validateRequest
}; 