const Translator = require('./Translator');
const logger = require('../../logger');

class TranslatorService {
  async addWord(text, videoUrl) {
    try {
      // Check if word exists
      const existingWord = await Translator.findOne({ text: text.toLowerCase() });
      if (existingWord) {
        throw new Error('Word already exists');
      }

      const word = new Translator({
        text: text.toLowerCase(),
        videoUrl,
      });

      await word.save();
      return word;
    } catch (error) {
      logger.error('Add word error:', error.message);
      throw error;
    }
  }

  async getAllWords(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const words = await Translator.find({})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Translator.countDocuments({});

      return {
        words,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Get all words error:', error.message);
      throw error;
    }
  }

  async searchWords(searchText) {
    try {
      const words = await Translator.find({
        text: { $regex: searchText, $options: 'i' },
      });
      return words;
    } catch (error) {
      logger.error('Search words error:', error.message);
      throw error;
    }
  }

  async getWordById(wordId) {
    try {
      const word = await Translator.findById(wordId);
      if (!word) {
        throw new Error('Word not found');
      }
      return word;
    } catch (error) {
      logger.error('Get word error:', error.message);
      throw error;
    }
  }
}

module.exports = new TranslatorService();
