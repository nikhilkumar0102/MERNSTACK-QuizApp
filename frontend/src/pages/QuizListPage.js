import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllQuizzes } from '../api/quizApi';
import './QuizListPage.css'; // Create CSS for styling

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for search/filter by domain

  useEffect(() => {
    fetchQuizzes(); // Initial fetch
  }, []);

  const fetchQuizzes = async (domain = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllQuizzes(domain);
      setQuizzes(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch quizzes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchQuizzes(searchTerm); // Fetch filtered quizzes
  };

   const handleClearSearch = () => {
        setSearchTerm('');
        fetchQuizzes(); // Fetch all quizzes
    }


  return (
    <div className="quiz-list-page">
      <h2>Available Quizzes</h2>

      <form onSubmit={handleSearchSubmit} className="search-form">
            <input
                type="text"
                placeholder="Filter by domain (e.g., JavaScript)"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <button type="submit">Search</button>
            {searchTerm && <button type="button" onClick={handleClearSearch}>Clear</button>}
       </form>


      {loading && <p className="loading-message">Loading quizzes...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="quiz-list">
          {quizzes.length === 0 ? (
            <p>No quizzes found{searchTerm ? ` for domain "${searchTerm}"` : ''}.</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <h3>{quiz.title}</h3>
                <p>Domain: {quiz.domain}</p>
                <Link to={`/quiz/${quiz._id}`} className="take-quiz-link">
                  Take Quiz
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default QuizListPage;