const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItemId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     specialInstructions:
 *                       type: string
 *               dietaryRestrictions:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialRequests:
 *                 type: string
 *               seat:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', asyncHandler(async (req, res) => {
  try {
    const { items, dietaryRestrictions, specialRequests, seat } = req.body;
    
    logger.info('[OrderRoutes] Creating order', {
      itemsCount: items?.length,
      dietaryRestrictions,
      seat
    });

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item'
      });
    }

    // Mock order creation
    const order = {
      id: `order_${Date.now()}`,
      bookingRef: `BK${Date.now()}`,
      passengerId: req.user?.id || 'anonymous',
      seat: seat || '12A',
      items: items.map(item => ({
        ...item,
        price: 15.99 // Mock price
      })),
      totalAmount: items.reduce((total, item) => total + (item.price || 15.99) * item.quantity, 0),
      status: 'pending',
      timestamp: new Date().toISOString(),
      dietaryRestrictions: dietaryRestrictions || [],
      specialRequests: specialRequests || '',
      mealSlot: 'lunch',
      flightNumber: 'AA123',
      flightDate: '2024-01-15'
    };

    res.status(201).json({
      success: true,
      data: order
    });

  } catch (error) {
    logger.error('[OrderRoutes] Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
}));

/**
 * @swagger
 * /api/order/{bookingRef}:
 *   get:
 *     summary: Get orders by booking reference
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: bookingRef
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking reference
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       404:
 *         description: Orders not found
 *       500:
 *         description: Internal server error
 */
router.get('/:bookingRef', asyncHandler(async (req, res) => {
  try {
    const { bookingRef } = req.params;
    
    logger.info('[OrderRoutes] Getting orders', { bookingRef });

    // Mock orders data
    const mockOrders = [
      {
        id: `order_${Date.now()}`,
        bookingRef,
        passengerId: req.user?.id || 'anonymous',
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
        flightNumber: 'AA123',
        flightDate: '2024-01-15'
      }
    ];

    res.json({
      success: true,
      data: mockOrders
    });

  } catch (error) {
    logger.error('[OrderRoutes] Error getting orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders'
    });
  }
}));

module.exports = router; 