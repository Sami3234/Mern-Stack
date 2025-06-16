import React from 'react';
import './LevelSelect.css';

function LevelSelect({ onLevelSelect }) {
  return (
    <div className="level-select-container">
      <h1>Select Level</h1>
      <div className="levels-container">
        <div className="level-card" onClick={() => onLevelSelect(1)}>
          <h2>Level 1</h2>
          <div className="level-details">
            <p>5 Boxes</p>
            <p>Numbers 1-5</p>
            <p>3 Attempts</p>
          </div>
          <button className="level-btn">Play Level 1</button>
        </div>

        <div className="level-card" onClick={() => onLevelSelect(2)}>
          <h2>Level 2</h2>
          <div className="level-details">
            <p>6 Boxes</p>
            <p>Numbers 1-6</p>
            <p>3 Attempts</p>
          </div>
          <button className="level-btn">Play Level 2</button>
        </div>
      </div>
    </div>
  );
}

export default LevelSelect; 