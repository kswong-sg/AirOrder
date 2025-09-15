const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { asyncHandler } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    
    logger.info('[AuthRoutes] Login attempt', { email });

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Mock user authentication
    const mockUser = {
      id: 'user_123',
      email: 'passenger@example.com',
      name: 'John Doe',
      role: 'passenger',
      dietaryRestrictions: ['gluten-free'],
      allergies: ['nuts'],
      preferences: ['vegetarian']
    };

    // Mock password validation (in real app, check against database)
    if (email !== 'passenger@example.com' || password !== 'password123') {
      logger.warn('[AuthRoutes] Invalid login attempt', { email });
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: mockUser.id, 
        email: mockUser.email,
        role: mockUser.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    logger.info('[AuthRoutes] Login successful', { email, userId: mockUser.id });

    res.json({
      success: true,
      data: {
        user: mockUser,
        token
      }
    });

  } catch (error) {
    logger.error('[AuthRoutes] Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
}));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', asyncHandler(async (req, res) => {
  try {
    logger.info('[AuthRoutes] Logout', { userId: req.user?.id });
    
    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('[AuthRoutes] Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
}));

module.exports = router; 