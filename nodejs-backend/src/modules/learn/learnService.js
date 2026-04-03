const Lesson = require('./Lesson');
const LearningHistory = require('./LearningHistory');
const User = require('../auth/User');
const { calculateStreak } = require('../../utils/streak');
const logger = require('../../logger');

class LearnService {
  mapLessonForResponse(lessonDoc) {
    const lesson = lessonDoc.toObject();
    const resources = Array.isArray(lesson.resources) ? lesson.resources : [];

    return {
      ...lesson,
      resources,
      // Keep old frontend UI working without any UI changes.
      content:
        lesson.content ||
        resources
          .map((item, index) => `${index + 1}. ${item.title}: ${item.url}`)
          .join('\n'),
    };
  }

  async getAllLessons(type = null) {
    try {
      const query = type ? { type } : {};
      const lessons = await Lesson.find(query).sort({ order: 1, createdAt: 1 });
      return lessons.map((lesson) => this.mapLessonForResponse(lesson));
    } catch (error) {
      logger.error('Get lessons error:', error.message);
      throw error;
    }
  }

  async getLessonById(lessonId) {
    try {
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }
      return this.mapLessonForResponse(lesson);
    } catch (error) {
      logger.error('Get lesson error:', error.message);
      throw error;
    }
  }

  async completeLesson(userId, lessonId) {
    try {
      // Get lesson
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create learning history
      const learningHistory = new LearningHistory({
        userId,
        lessonId,
      });
      await learningHistory.save();

      // Update user score
      user.score += lesson.scoreReward;
      user.lastLearnedDate = new Date();

      // Update streak
      const histories = await LearningHistory.find({ userId }).sort({
        date: -1,
      });
      const dates = histories.map((h) => h.date);
      const { streak } = calculateStreak(dates);
      user.streak = streak;

      await user.save();

      return {
        message: 'Lesson completed successfully',
        scoreEarned: lesson.scoreReward,
        totalScore: user.score,
        streak: user.streak,
      };
    } catch (error) {
      logger.error('Complete lesson error:', error.message);
      throw error;
    }
  }

  async getUserLearningHistory(userId) {
    try {
      const histories = await LearningHistory.find({ userId })
        .populate('lessonId')
        .sort({ date: -1 });
      return histories;
    } catch (error) {
      logger.error('Get learning history error:', error.message);
      throw error;
    }
  }
}

module.exports = new LearnService();
