const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['lesson', 'practice'],
      default: 'lesson',
    },
    scoreReward: {
      type: Number,
      default: 10,
    },
    order: {
      type: Number,
      default: 0,
    },
    resources: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    practiceQuestions: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },
        A: {
          type: String,
          required: true,
          trim: true,
        },
        B: {
          type: String,
          required: true,
          trim: true,
        },
        C: {
          type: String,
          required: true,
          trim: true,
        },
        D: {
          type: String,
          required: true,
          trim: true,
        },
        correct: {
          type: String,
          enum: ['A', 'B', 'C', 'D'],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lesson', lessonSchema);
