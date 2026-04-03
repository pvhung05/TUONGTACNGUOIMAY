const express = require('express');
const router = express.Router();
const translatorController = require('../modules/translator/translatorController');

/**
 * @route   POST /api/translator/words
 * @desc    Add new word
 * @access  Public
 */
router.post('/words', (req, res, next) =>
  translatorController.addWord(req, res, next)
);

/**
 * @route   GET /api/translator/words
 * @desc    Get all words (paginated)
 * @query   page - page number (default: 1)
 * @query   limit - items per page (default: 20)
 * @access  Public
 */
router.get('/words', (req, res, next) =>
  translatorController.getAllWords(req, res, next)
);

/**
 * @route   GET /api/translator/words/search
 * @desc    Search words
 * @query   search - search text
 * @access  Public
 */
router.get('/search', (req, res, next) =>
  translatorController.searchWords(req, res, next)
);

/**
 * @route   GET /api/translator/words/:wordId
 * @desc    Get specific word
 * @access  Public
 */
router.get('/words/:wordId', (req, res, next) =>
  translatorController.getWordById(req, res, next)
);

module.exports = router;
