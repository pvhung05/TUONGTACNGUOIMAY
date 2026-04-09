const mongoose = require('mongoose');

const translatorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    videos: {
      type: [
        {
          title: {
            type: String,
            trim: true,
            default: '',
          },
          url: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'videos must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

translatorSchema.virtual('text').get(function () {
  return this.title;
});

translatorSchema.virtual('videoUrl').get(function () {
  const firstVideo = Array.isArray(this.videos) ? this.videos[0] : null;
  return firstVideo?.url || '';
});

// Create text index để tìm kiếm theo title
translatorSchema.index({ title: 'text' });

translatorSchema.pre('save', function (next) {
  this.title = String(this.title || '').trim().toLowerCase();
  next();
});

module.exports = mongoose.model('Translator', translatorSchema);
