import React, { useState } from 'react';
import './QuestionForm.css'; // Create CSS for styling

function QuestionForm({ index, questionData, onQuestionChange, onRemoveQuestion }) {
  const [options, setOptions] = useState(questionData.options || ['', '']); // Start with 2 options

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onQuestionChange(index, { ...questionData, [name]: value });
     // Ensure correct answer is updated if it matches an old option text that changed
     if (name.startsWith('option-')) {
        const optionIndex = parseInt(name.split('-')[1], 10);
        const newOptions = [...options];
        newOptions[optionIndex] = value;
        setOptions(newOptions); // Update local state for immediate feedback
        onQuestionChange(index, { ...questionData, options: newOptions }); // Update parent state

        // If the changed option was the correct answer, update the correct answer value
        if(questionData.correctAnswer === questionData.options[optionIndex]) {
            onQuestionChange(index, { ...questionData, options: newOptions, correctAnswer: value });
        } else {
             onQuestionChange(index, { ...questionData, options: newOptions });
        }
    } else if (name === 'correctAnswer') {
        // Update correct answer directly
        onQuestionChange(index, { ...questionData, correctAnswer: value });
    } else {
        // Handle questionText change
         onQuestionChange(index, { ...questionData, [name]: value });
    }
  };

   const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...options];
    newOptions[optionIndex] = value;
    setOptions(newOptions);

    // If the changed option was the correct answer, update the correct answer value
     let newCorrectAnswer = questionData.correctAnswer;
     if(questionData.correctAnswer === questionData.options[optionIndex]) {
         newCorrectAnswer = value; // Update correct answer to the new text
     }
    onQuestionChange(index, { ...questionData, options: newOptions, correctAnswer: newCorrectAnswer });
  };

  const addOption = () => {
    const newOptions = [...options, ''];
    setOptions(newOptions);
    onQuestionChange(index, { ...questionData, options: newOptions });
  };

  const removeOption = (optionIndexToRemove) => {
     if (options.length <= 2) {
        alert("Each question must have at least two options.");
        return; // Prevent removing if only two options left
    }
    const removedOptionValue = options[optionIndexToRemove];
    const newOptions = options.filter((_, i) => i !== optionIndexToRemove);
    setOptions(newOptions);

    // If the removed option was the correct answer, clear the correct answer
    let newCorrectAnswer = questionData.correctAnswer;
    if (questionData.correctAnswer === removedOptionValue) {
        newCorrectAnswer = ''; // Or set to the first remaining option, requires choice
        alert("The correct answer was removed. Please select a new correct answer.")
    }

    onQuestionChange(index, { ...questionData, options: newOptions, correctAnswer: newCorrectAnswer });
  };


  return (
    <div className="question-form">
      <h4>Question {index + 1}</h4>
      <button type="button" onClick={() => onRemoveQuestion(index)} className="remove-question-btn">
        Remove Question
      </button>
      <div className="form-group">
        <label>Question Text:</label>
        <input
          type="text"
          name="questionText"
          value={questionData.questionText || ''}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Options:</label>
        {options.map((option, optionIndex) => (
          <div key={optionIndex} className="option-input">
            <input
              type="text"
              // Use a unique name for each option input if needed, but managing via index is common
              name={`option-${optionIndex}`}
              value={option}
              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
              required
              placeholder={`Option ${optionIndex + 1}`}
            />
             {options.length > 2 && ( // Show remove button only if more than 2 options
                 <button type="button" onClick={() => removeOption(optionIndex)} className="remove-option-btn">
                    X
                </button>
             )}
          </div>
        ))}
        <button type="button" onClick={addOption} className="add-option-btn">
          Add Option
        </button>
      </div>

      <div className="form-group">
        <label>Correct Answer:</label>
        <select
          name="correctAnswer"
          value={questionData.correctAnswer || ''}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>-- Select Correct Answer --</option>
          {options.map((option, optionIndex) => (
            option.trim() && <option key={optionIndex} value={option}>
              {option}
            </option>
          ))}
        </select>
        {!questionData.correctAnswer && <p className='error-text'>Please select the correct answer.</p>}
        {questionData.correctAnswer && !options.includes(questionData.correctAnswer) && <p className='error-text'>The selected correct answer is no longer a valid option!</p>}

      </div>
    </div>
  );
}

export default QuestionForm;