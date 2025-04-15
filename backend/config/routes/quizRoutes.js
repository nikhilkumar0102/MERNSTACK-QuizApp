// backend/routes/quizRoutes.js

const express = require('express');
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
} = require('./../contorllers/quizController'); // Adjust the path as necessary

// Middleware placeholders for future use
// const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/quiz
 * @desc    Create a new quiz (Admin-only)
 * @access  Private (To be protected later)
 */
router.post('/', createQuiz);

/**
 * @route   GET /api/quiz
 * @desc    Get all quizzes (public, supports filtering)
 * @access  Public
 */
router.get('/', getAllQuizzes);

/**
 * @route   GET /api/quiz/:id
 * @desc    Get a quiz by ID
 * @access  Public
 */
router.get('/:id', getQuizById);

/**
 * Future routes to manage quizzes:
 * Uncomment and implement auth middleware when ready
 */
// router.put('/:id', protect, admin, updateQuiz);
// router.delete('/:id', protect, admin, deleteQuiz);

module.exports = router;