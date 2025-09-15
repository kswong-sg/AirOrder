const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

router.get('/passengers/:flightNumber', asyncHandler(async (req, res) => {
  try {
    const { flightNumber } = req.params;
    logger.info('[CrewRoutes] Getting passenger meals', { flightNumber });
    
    const mockOrders = [
      {
        id: 'order_1',
        bookingRef: 'BK123456',
        passengerId: 'passenger_1',
        seat: '12A',
        items: [
          {
            menuItemId: '1',
            quantity: 1,
            price: 15.99,
            specialInstructions: 'No salt'
          }
        ],
        totalAmount: 15.99,
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        dietaryRestrictions: ['gluten-free'],
        specialRequests: 'Extra sauce',
        mealSlot: 'lunch',
        flightNumber,
        flightDate: '2024-01-15'
      }
    ];

    res.json({
      success: true,
      data: mockOrders
    });

  } catch (error) {
    logger.error('[CrewRoutes] Error getting passenger meals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get passenger meals'
    });
  }
}));

module.exports = router; 