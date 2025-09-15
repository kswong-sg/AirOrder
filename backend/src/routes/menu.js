const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get menu items for a flight
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: flightNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: Flight number
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Flight date
 *       - in: query
 *         name: cabinClass
 *         schema:
 *           type: string
 *           enum: [economy, premium_economy, business, first]
 *         required: true
 *         description: Cabin class
 *       - in: query
 *         name: dietaryRestrictions
 *         schema:
 *           type: string
 *         description: Comma-separated dietary restrictions
 *     responses:
 *       200:
 *         description: Menu items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     menu:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MenuItem'
 *                     mealSlots:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MealSlot'
 *                     flight:
 *                       $ref: '#/components/schemas/Flight'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/', asyncHandler(async (req, res) => {
  try {
    const { flightNumber, date, cabinClass, dietaryRestrictions } = req.query;
    
    logger.info('[MenuRoutes] Getting menu', {
      flightNumber,
      date,
      cabinClass,
      dietaryRestrictions
    });

    // Validate required parameters
    if (!flightNumber || !date || !cabinClass) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: flightNumber, date, cabinClass'
      });
    }

    // Mock menu data for development
    const mockMenu = [
      {
        id: '1',
        name: 'Grilled Chicken Breast',
        description: 'Tender grilled chicken breast with herbs and lemon',
        price: 15.99,
        category: 'main',
        cabinClass: 'economy',
        allergens: ['none'],
        dietaryCategories: ['gluten-free'],
        nutritionalInfo: {
          calories: 350,
          protein: 45,
          carbs: 5,
          fat: 12
        },
        available: true,
        stockQuantity: 50
      },
      {
        id: '2',
        name: 'Vegetarian Pasta',
        description: 'Fresh pasta with seasonal vegetables and tomato sauce',
        price: 12.99,
        category: 'main',
        cabinClass: 'economy',
        allergens: ['gluten'],
        dietaryCategories: ['vegetarian'],
        nutritionalInfo: {
          calories: 420,
          protein: 12,
          carbs: 65,
          fat: 8
        },
        available: true,
        stockQuantity: 30
      },
      {
        id: '3',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing and croutons',
        price: 8.99,
        category: 'side',
        cabinClass: 'economy',
        allergens: ['gluten', 'dairy'],
        dietaryCategories: ['vegetarian'],
        nutritionalInfo: {
          calories: 180,
          protein: 6,
          carbs: 12,
          fat: 14
        },
        available: true,
        stockQuantity: 40
      }
    ];

    const mockMealSlots = [
      {
        id: 'breakfast',
        name: 'Breakfast',
        startTime: '07:00',
        endTime: '09:00',
        isLocked: false,
        isActive: true,
        crewAssigned: []
      },
      {
        id: 'lunch',
        name: 'Lunch',
        startTime: '12:00',
        endTime: '14:00',
        isLocked: false,
        isActive: false,
        crewAssigned: []
      },
      {
        id: 'dinner',
        name: 'Dinner',
        startTime: '18:00',
        endTime: '20:00',
        isLocked: false,
        isActive: false,
        crewAssigned: []
      }
    ];

    const mockFlight = {
      flightNumber,
      date,
      origin: 'SFO',
      destination: 'NRT',
      departureTime: '10:30',
      arrivalTime: '14:45',
      aircraftType: 'B787',
      mealSlots: mockMealSlots,
      routeId: `${flightNumber}-${date}`
    };

    // Filter menu by cabin class and dietary restrictions
    let filteredMenu = mockMenu.filter(item => item.cabinClass === cabinClass);
    
    if (dietaryRestrictions) {
      const restrictions = dietaryRestrictions.split(',');
      filteredMenu = filteredMenu.filter(item => 
        restrictions.some(restriction => 
          item.dietaryCategories.includes(restriction)
        )
      );
    }

    res.json({
      success: true,
      data: {
        menu: filteredMenu,
        mealSlots: mockMealSlots,
        flight: mockFlight
      }
    });

  } catch (error) {
    logger.error('[MenuRoutes] Error getting menu:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve menu'
    });
  }
}));

module.exports = router; 