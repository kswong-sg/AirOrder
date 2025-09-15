const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

router.get('/', asyncHandler(async (req, res) => {
  try {
    logger.info('[HealthRoutes] Health check');
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      }
    });

  } catch (error) {
    logger.error('[HealthRoutes] Health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
}));

module.exports = router; 