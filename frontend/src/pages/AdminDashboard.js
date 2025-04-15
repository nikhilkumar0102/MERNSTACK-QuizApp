import React, { useState } from 'react';
import QuestionForm from '../components/QuestionForm';
import { createQuiz } from '../api/quizApi';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Create CSS for styling


function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', ''], correctAnswer: '' }, // Start with one blank question
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleQuestionChange = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', ''], correctAnswer: '' },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) {
        alert("A quiz must have at least one question.");
        return; // Prevent removing the last question
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const validateQuiz = () => {
    if (!title.trim()) return "Quiz title is required.";
    if (!domain.trim()) return "Quiz domain is required.";
    if (questions.length === 0) return "Quiz must have at least one question.";

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
         if (!q.questionText?.trim()) return `Question ${i + 1}: Text is required.`;
         if (!q.options || q.options.length < 2) return `Question ${i + 1}: Must have at least two options.`;
         if (q.options.some(opt => !opt?.trim())) return `Question ${i + 1}: All options must have text.`;
         if (!q.correctAnswer?.trim()) return `Question ${i + 1}: Correct answer must be selected.`;
         if (!q.options.includes(q.correctAnswer)) return `Question ${i + 1}: The selected correct answer is not among the options.`;
    }
    return null; // No errors
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateQuiz();
     if (validationError) {
         setError(validationError);
         return;
     }


    setLoading(true);

    const quizData = {
      title,
      domain,
      questions,
    };

    try {
      await createQuiz(quizData);
      setSuccess('Quiz created successfully!');
      // Optionally clear form or redirect
      setTitle('');
      setDomain('');
      setQuestions([{ questionText: '', options: ['', ''], correctAnswer: '' }]);
      // navigate('/quizzes'); // Or redirect to quiz list page
    } catch (err) {
      setError(err.message || 'Failed to create quiz. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Create New Quiz</h2>
      {error && <p className="message error-message">{error}</p>}
      {success && <p className="message success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Quiz Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="domain">Domain/Category:</label>
          <input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g., JavaScript, History, Science"
            required
          />
        </div>

        <h3>Questions</h3>
        {questions.map((q, index) => (
          <QuestionForm
            key={index} // It's okay for dev, but consider stable IDs if list reordering happens
            index={index}
            questionData={q}
            onQuestionChange={handleQuestionChange}
            onRemoveQuestion={removeQuestion}
          />
        ))}

        <button type="button" onClick={addQuestion} className="add-question-btn">
          Add Another Question
        </button>

        <button type="submit" disabled={loading} className="submit-quiz-btn">
          {loading ? 'Creating...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
}

export default AdminDashboard;