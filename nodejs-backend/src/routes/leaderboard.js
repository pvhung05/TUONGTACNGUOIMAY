const express = require('express');
const router = express.Router();
const leaderboardController = require('../modules/leaderboard/leaderboardController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/leaderboard/top10
 * @desc    Get top 10 users
 * @access  Public
 */
router.get('/top10', (req, res, next) =>
  leaderboardController.getTop10(req, res, next)
);

/**
 * @route   GET /api/leaderboard/rank
 * @desc    Get current user rank
 * @access  Private
 */
router.get('/rank', authMiddleware, (req, res, next) =>
  leaderboardController.getUserRank(req, res, next)
);

module.exports = router;
