const leaderboardService = require('./leaderboardService');
const logger = require('../../logger');

class LeaderboardController {
  async getTop10(req, res, next) {
    try {
      const topUsers = await leaderboardService.getTop10Users();

      res.status(200).json({
        success: true,
        message: 'Top 10 users retrieved',
        data: topUsers,
      });
    } catch (error) {
      logger.error('Get top 10 controller error:', error.message);
      next(error);
    }
  }

  async getUserRank(req, res, next) {
    try {
      const userRank = await leaderboardService.getUserRank(req.userId);

      res.status(200).json({
        success: true,
        message: 'User rank retrieved',
        data: userRank,
      });
    } catch (error) {
      logger.error('Get user rank controller error:', error.message);
      next(error);
    }
  }
}

module.exports = new LeaderboardController();
