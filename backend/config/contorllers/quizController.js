// backend/controllers/quizController.js
const Quiz = require('../models/Quiz');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Admin (authentication not implemented yet)
const createQuiz = async (req, res) => {
  try {
    const { title, domain, questions } = req.body;

    // Basic validation (more robust validation can be added)
    if (!title || !domain || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide title, domain, and at least one question' });
    }
     // Validate each question structure (can be more thorough)
     for (const q of questions) {
        if (!q.questionText || !q.options || q.options.length < 2 || !q.correctAnswer) {
             return res.status(400).json({ message: 'Each question must have text, at least two options, and a correct answer' });
        }
        if (!q.options.includes(q.correctAnswer)) {
            return res.status(400).json({ message: `Correct answer "${q.correctAnswer}" for question "${q.questionText.substring(0,20)}..." must be one of the provided options.` });
        }
     }

    const newQuiz = new Quiz({
      title,
      domain,
      questions,
      // createdBy: req.user._id // Add this when authentication is implemented
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
     // Mongoose validation error
     if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Server error creating quiz', error: error.message });
  }
};

// @desc    Get all quizzes (optionally filtered by domain)
// @route   GET /api/quizzes?domain=...
// @access  Public
const getAllQuizzes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.domain) {
      // Case-insensitive domain search
      filter.domain = new RegExp('^' + req.query.domain + '$', 'i');
    }

    // Select only title and domain for the list view, exclude questions array
    const quizzes = await Quiz.find(filter).select('title domain createdAt');
    res.status(200).json(quizzes);
  } catch (error) {
     console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: 'Server error fetching quizzes', error: error.message });
  }
};

// @desc    Get a single quiz by ID (including questions)
// @route   GET /api/quizzes/:id
// @access  Public
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Optionally: Don't send correct answers to regular users taking the quiz
    // You might create a separate endpoint or logic based on user role later
    // For now, we send everything.

    res.status(200).json(quiz);
  } catch (error) {
     console.error("Error fetching quiz by ID:", error);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Quiz not found (invalid ID format)' });
     }
    res.status(500).json({ message: 'Server error fetching quiz', error: error.message });
  }
};


// Add updateQuiz and deleteQuiz controllers later if needed (Admin only)

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
};