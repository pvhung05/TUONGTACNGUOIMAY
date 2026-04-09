const mongoose = require('mongoose');

const learningHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index để truy vấn nhanh
learningHistorySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('LearningHistory', learningHistorySchema);
