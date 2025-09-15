const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

router.get('/analytics', asyncHandler(async (req, res) => {
  try {
    logger.info('[AdminRoutes] Getting analytics');
    
    const mockAnalytics = {
      totalOrders: 150,
      revenue: 2500.50,
      popularItems: [
        { item: { name: 'Grilled Chicken' }, count: 45 },
        { item: { name: 'Vegetarian Pasta' }, count: 32 }
      ],
      dietaryStats: {
        'vegetarian': 25,
        'gluten-free': 15,
        'vegan': 8
      },
      timeSlotStats: {
        'breakfast': 30,
        'lunch': 80,
        'dinner': 40
      }
    };

    res.json({
      success: true,
      data: mockAnalytics
    });

  } catch (error) {
    logger.error('[AdminRoutes] Error getting analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics'
    });
  }
}));

module.exports = router; 