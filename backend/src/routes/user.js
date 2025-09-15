const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

router.get('/me', asyncHandler(async (req, res) => {
  try {
    logger.info('[UserRoutes] Getting current user', { userId: req.user?.id });
    
    const mockUser = {
      id: 'user_123',
      email: 'passenger@example.com',
      name: 'John Doe',
      role: 'passenger',
      dietaryRestrictions: ['gluten-free'],
      allergies: ['nuts'],
      preferences: ['vegetarian']
    };

    res.json({
      success: true,
      data: mockUser
    });

  } catch (error) {
    logger.error('[UserRoutes] Error getting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user info'
    });
  }
}));

module.exports = router; 