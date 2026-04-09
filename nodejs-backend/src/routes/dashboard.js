const express = require('express');
const router = express.Router();
const dashboardController = require('../modules/dashboard/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/dashboard
 * @desc    Get user dashboard data
 * @access  Private
 */
router.get('/', authMiddleware, (req, res, next) =>
  dashboardController.getDashboard(req, res, next)
);

module.exports = router;
