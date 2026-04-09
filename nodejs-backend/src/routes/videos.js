const express = require('express');
const router = express.Router();
const videoController = require('../modules/videos/videoController');

/**
 * @route   GET /api/videos/debug
 * @desc    Debug Cloudinary resources (video + raw)
 * @query   prefix - optional public_id prefix filter
 * @query   limit - optional max items per resource type (default: 20, max: 100)
 * @access  Public
 */
router.get('/debug', (req, res, next) => videoController.getDebugResources(req, res, next));

/**
 * @route   GET /api/videos/numbers
 * @desc    Get sign language number videos from Cloudinary
 * @access  Public
 */
router.get('/numbers', (req, res, next) => videoController.getNumbers(req, res, next));

/**
 * @route   GET /api/videos/numbers/:number
 * @desc    Get sign language videos for one number (1-20)
 * @access  Public
 */
router.get('/numbers/:number', (req, res, next) => videoController.getNumber(req, res, next));

/**
 * @route   GET /api/videos/alphabet/:letter
 * @desc    Get sign language alphabet videos from Cloudinary
 * @access  Public
 */
router.get('/alphabet/:letter', (req, res, next) => videoController.getAlphabet(req, res, next));

module.exports = router;