import React, { useState } from 'react';
import './WelcomeScreen.css'; // Nayi CSS file banayenge

function WelcomeScreen({ onStartGame }) {
  const [fullName, setFullName] = useState('');

  const handleInputChange = (e) => {
    setFullName(e.target.value);
  };

  const handleSubmit = () => {
    if (fullName.trim() === '') {
      alert('Please enter your full name to start.');
      return;
    }
    onStartGame(fullName);
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to the Number Guessing Game!</h1>
      <div className="input-group">
        <label htmlFor="fullName">Enter your Full Name:</label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={handleInputChange}
          placeholder="e.g., Sami Khan"
        />
      </div>
      <button className="start-game-btn" onClick={handleSubmit}>
        Start Game
      </button>
    </div>
  );
}

export default WelcomeScreen; 