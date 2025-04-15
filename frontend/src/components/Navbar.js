import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Create this CSS file for basic styling

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">QuizApp</Link>
      <div className="navbar-links">
        {/* Link to Admin - In reality, show based on user role */}
        <Link to="/admin">Admin Dashboard</Link>
         {/* Link to User Quiz List */}
        <Link to="/quizzes">Take a Quiz</Link>
      </div>
    </nav>
  );
}

export default Navbar;