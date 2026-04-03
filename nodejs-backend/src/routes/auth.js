const express = require('express');
const router = express.Router();
const authController = require('../modules/auth/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', (req, res, next) => authController.register(req, res, next));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', (req, res, next) => authController.login(req, res, next));

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, (req, res, next) =>
  authController.getProfile(req, res, next)
);

module.exports = router;
