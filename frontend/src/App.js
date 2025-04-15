import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import QuizListPage from './pages/QuizListPage';
import TakeQuizPage from './pages/TakeQuizPage';
import './App.css'; // Optional global styles

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container"> {/* Added container for padding */}
        <Routes>
          {/* Admin Route (Needs protection later) */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* User Routes */}
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quiz/:quizId" element={<TakeQuizPage />} />

          {/* Default/Home Route - Redirect or show quiz list */}
          <Route path="/" element={<QuizListPage />} />

          {/* Optional: Add a 404 Not Found Route */}
          <Route path="*" element={<div><h2>404 Not Found</h2><p>The page you are looking for does not exist.</p></div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;