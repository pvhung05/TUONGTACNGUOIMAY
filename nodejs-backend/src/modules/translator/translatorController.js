const translatorService = require('./translatorService');
const logger = require('../../logger');

class TranslatorController {
  async addWord(req, res, next) {
    try {
      const { text, videoUrl } = req.body;

      if (!text || !videoUrl) {
        return res.status(400).json({
          success: false,
          message: 'Please provide text and videoUrl',
        });
      }

      const word = await translatorService.addWord(text, videoUrl);

      res.status(201).json({
        success: true,
        message: 'Word added successfully',
        data: word,
      });
    } catch (error) {
      logger.error('Add word controller error:', error.message);
      next(error);
    }
  }

  async getAllWords(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await translatorService.getAllWords(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        message: 'Words retrieved successfully',
        data: result,
      });
    } catch (error) {
      logger.error('Get all words controller error:', error.message);
      next(error);
    }
  }

  async searchWords(req, res, next) {
    try {
      const { search } = req.query;

      if (!search) {
        return res.status(400).json({
          success: false,
          message: 'Please provide search text',
        });
      }

      const words = await translatorService.searchWords(search);

      res.status(200).json({
        success: true,
        message: 'Search results',
        data: words,
      });
    } catch (error) {
      logger.error('Search words controller error:', error.message);
      next(error);
    }
  }

  async getWordById(req, res, next) {
    try {
      const { wordId } = req.params;
      const word = await translatorService.getWordById(wordId);

      res.status(200).json({
        success: true,
        message: 'Word retrieved successfully',
        data: word,
      });
    } catch (error) {
      logger.error('Get word controller error:', error.message);
      next(error);
    }
  }
}

module.exports = new TranslatorController();
