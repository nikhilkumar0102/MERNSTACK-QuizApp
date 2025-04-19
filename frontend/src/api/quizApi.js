// frontend/src/api/quizApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'; // Fallback

const quizApi = axios.create({
  baseURL: API_URL,
});

// Function to create a new quiz
export const createQuiz = async (quizData) => {
  try {
    const response = await quizApi.post('/quizzes', quizData);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error.response?.data || error.message);
    throw error.response?.data || new Error('API error creating quiz');
  }
};

// Function to get all quizzes (optionally filter by domain)
export const getAllQuizzes = async (domain = '') => {
  try {
    const params = domain ? { domain } : {};
    const response = await quizApi.get('/quizzes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error.response?.data || error.message);
    throw error.response?.data || new Error('API error fetching quizzes');
  }
};
// Function to delete a quiz by its ID
export const deleteQuiz = async (quizId) => {
  try {
    const response = await quizApi.delete(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting quiz ${quizId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error(`API error deleting quiz ${quizId}`);
  }
};

// Function to get a single quiz by its ID
export const getQuizById = async (quizId) => {
  try {
    const response = await quizApi.get(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching quiz ${quizId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error(`API error fetching quiz ${quizId}`);
  }
};

// Add functions for update/delete later if needed