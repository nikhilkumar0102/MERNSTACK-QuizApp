// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const quizRoutes = require('./config/routes/quizRoutes'); // Adjust the path as necessary
// Import error handling middleware later if needed
// const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Allow parsing of JSON request bodies

// Basic route
app.get('/', (req, res) => {
  res.send('Quiz App API is running...');
});

// API Routes
app.use('/api/quizzes', quizRoutes);


// --- Error Handling Middleware (Add Later) ---
// app.use(notFound); // Handle 404 errors
// app.use(errorHandler); // Handle general errors

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});