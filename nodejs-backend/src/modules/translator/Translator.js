const mongoose = require('mongoose');

const translatorSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index để tìm kiếm
translatorSchema.index({ text: 'text' });

module.exports = mongoose.model('Translator', translatorSchema);
