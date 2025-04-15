import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById } from '../api/quizApi';
import './TakeQuizPage.css'; // Create CSS for styling

function TakeQuizPage() {
  const { quizId } = useParams(); // Get quiz ID from URL
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Store answers like { questionIndex: selectedOption }
  const [score, setScore] = useState(null); // Score is null until quiz is submitted
  const [showResults, setShowResults] = useState(false);


  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getQuizById(quizId);
        setQuiz(data);
        setUserAnswers({}); // Reset answers when loading a new quiz
        setCurrentQuestionIndex(0);
        setScore(null);
        setShowResults(false);
      } catch (err) {
        setError(err.message || `Failed to fetch quiz ${quizId}. It might not exist.`);
         setQuiz(null); // Ensure quiz is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]); // Re-fetch if quizId changes

  const handleAnswerSelect = (option) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: option,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

   const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };


  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    quiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setShowResults(true); // Display results view
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
    setShowResults(false);
  }

  const goBackToList = () => {
    navigate('/quizzes'); // Navigate back to the quiz list
  }


  // --- Render Logic ---
  if (loading) {
    return <p className="loading-message">Loading quiz...</p>;
  }

  if (error) {
    return (
         <div className="error-container">
            <p className="error-message">{error}</p>
             <button onClick={goBackToList} className="action-button">Back to Quiz List</button>
         </div>
    );
  }

  if (!quiz) {
    // This case might be covered by error, but good to have explicitly
     return (
         <div className="error-container">
            <p className="error-message">Quiz data could not be loaded.</p>
             <button onClick={goBackToList} className="action-button">Back to Quiz List</button>
        </div>
    );
  }

  // Display Results
  if (showResults) {
    return (
      <div className="quiz-results">
        <h2>Quiz Completed!</h2>
        <h3>{quiz.title}</h3>
        <p className="final-score">Your Score: {score} out of {quiz.questions.length}</p>
        <div className="results-summary">
            <h4>Review Your Answers:</h4>
            <ul>
                {quiz.questions.map((q, index) => (
                    <li key={index} className={userAnswers[index] === q.correctAnswer ? 'correct' : 'incorrect'}>
                       <p><strong>Q{index + 1}:</strong> {q.questionText}</p>
                       <p>Your Answer: {userAnswers[index] || <i>Not Answered</i>}</p>
                       {userAnswers[index] !== q.correctAnswer && <p>Correct Answer: {q.correctAnswer}</p>}
                    </li>
                ))}
            </ul>
        </div>
        <div className="results-actions">
            <button onClick={restartQuiz} className="action-button">Retake Quiz</button>
            <button onClick={goBackToList} className="action-button">Back to Quiz List</button>
        </div>
      </div>
    );
  }

  // Display Current Question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="take-quiz-page">
      <h2>{quiz.title}</h2>
      <div className="quiz-progress">
        Question {currentQuestionIndex + 1} of {quiz.questions.length}
      </div>

      <div className="question-container">
        <h3>{currentQuestion.questionText}</h3>
        <div className="options-list">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`option-button ${
                userAnswers[currentQuestionIndex] === option ? 'selected' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </button>
         {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button onClick={goToNextQuestion} >
                Next
            </button>
        ) : (
            <button onClick={handleSubmitQuiz} className="submit-button">
                Submit Quiz
            </button>
        )}

      </div>
    </div>
  );
}

export default TakeQuizPage;