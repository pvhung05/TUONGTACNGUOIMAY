const User = require('../auth/User');
const logger = require('../../logger');

class LeaderboardService {
  async getTop10Users() {
    try {
      const users = await User.find({})
        .select('username score streak')
        .sort({ score: -1 })
        .limit(10);

      return users.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        score: user.score,
        streak: user.streak,
      }));
    } catch (error) {
      logger.error('Get top 10 users error:', error.message);
      throw error;
    }
  }

  async getUserRank(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const rank = await User.countDocuments({ score: { $gt: user.score } });

      return {
        rank: rank + 1,
        username: user.username,
        score: user.score,
        streak: user.streak,
        totalUsers: await User.countDocuments({}),
      };
    } catch (error) {
      logger.error('Get user rank error:', error.message);
      throw error;
    }
  }
}

module.exports = new LeaderboardService();
