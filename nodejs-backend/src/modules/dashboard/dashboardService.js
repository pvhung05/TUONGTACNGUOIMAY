const User = require('../auth/User');
const LearningHistory = require('../learn/LearningHistory');
const { calculateStreak } = require('../../utils/streak');
const logger = require('../../logger');

class DashboardService {
  async getDashboardData(userId) {
    try {
      // Get user
      const user = await User.findById(userId).select('username email role score streak lastLearnedDate');
      if (!user) {
        throw new Error('User not found');
      }

      // Get learning history
      const histories = await LearningHistory.find({ userId }).sort({
        date: -1,
      });

      // Count lessons by days
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const dayBeforeYesterday = new Date(today);
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

      const countLessonsToday = histories.filter((h) => {
        const date = new Date(h.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
      }).length;

      const countLessonsYesterday = histories.filter((h) => {
        const date = new Date(h.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === yesterday.getTime();
      }).length;

      const countLessonsDayBeforeYesterday = histories.filter((h) => {
        const date = new Date(h.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === dayBeforeYesterday.getTime();
      }).length;

      // Calculate streak
      const dates = histories.map((h) => h.date);
      const { streak } = calculateStreak(dates);
      const totalLessonsCompleted = histories.length;
      const recentActivities = countLessonsToday + countLessonsYesterday + countLessonsDayBeforeYesterday;
      const recentLearning = histories.slice(0, 5);
      const totalScore = user.score ?? 0;
      const currentStreak = user.streak ?? streak;

      return {
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
          score: totalScore,
          streak: currentStreak,
        },
        stats: {
          totalScore,
          streak: currentStreak,
          totalLessonsCompleted,
          recentActivities,
        },
        recentLearning,
        lessonsToday: countLessonsToday,
        lessonsYesterday: countLessonsYesterday,
        lessonsDayBeforeYesterday: countLessonsDayBeforeYesterday,
        totalScore,
        streak: currentStreak,
        lastLearnedDate: user.lastLearnedDate,
      };
    } catch (error) {
      logger.error('Get dashboard data error:', error.message);
      throw error;
    }
  }
}

module.exports = new DashboardService();
