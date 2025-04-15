// backend/models/Quiz.js
const mongoose = require('mongoose');

// Sub-schema for individual questions
const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
  },
  options: [
    {
      type: String,
      required: [true, 'At least two options are required'],
    },
  ],
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    // Optional: Add validation to ensure correctAnswer is one of the options
    validate: {
        validator: function(value) {
            // 'this' refers to the QuestionSchema document being validated
            return this.options.includes(value);
        },
        message: props => `${props.value} is not a valid option!`
    }
  },
});

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Quiz domain/category is required'],
      trim: true,
    },
    questions: [QuestionSchema], // Array of embedded question documents
    // Add createdBy if implementing Authentication later
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User', // Reference to a User model
    //   required: true
    // }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Ensure at least one question is added
QuizSchema.path('questions').validate(function (value) {
    return value.length > 0;
}, 'A quiz must have at least one question.');

// Ensure at least two options per question
QuestionSchema.path('options').validate(function (value) {
    return value.length >= 2;
}, 'Each question must have at least two options.');


module.exports = mongoose.model('Quiz', QuizSchema);