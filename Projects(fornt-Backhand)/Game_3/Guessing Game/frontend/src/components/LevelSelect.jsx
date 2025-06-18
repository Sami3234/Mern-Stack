import React from 'react';
import './LevelSelect.css';

function LevelSelect({ onLevelSelect, username, unlockedLevels }) {
  const levels = [
    { id: 1, boxes: 5, numbers: "1-5", attempts: 3 },
    { id: 2, boxes: 6, numbers: "1-6", attempts: 3 },
    { id: 3, boxes: 7, numbers: "1-7", attempts: 4 },
    { id: 4, boxes: 8, numbers: "1-8", attempts: 4 },
    { id: 5, boxes: 9, numbers: "1-9", attempts: 5 },
    { id: 6, boxes: 10, numbers: "1-10", attempts: 5 },
    { id: 7, boxes: 11, numbers: "1-11", attempts: 6 },
    { id: 8, boxes: 12, numbers: "1-12", attempts: 6 },
    { id: 9, boxes: 13, numbers: "1-13", attempts: 7 },
    { id: 10, boxes: 14, numbers: "1-14", attempts: 7 },
    { id: 11, boxes: 5, numbers: "1-5", attempts: 3, isCongratulationsLevel: true }
  ];

  const handleLevelClick = (level) => {
    onLevelSelect(level);
  };

  return (
    <div className="level-select-container">
      <h1>Welcome, {username}! Select Level</h1>
      <div className="levels-container">
        {levels.map((level) => {
          const isLocked = !unlockedLevels.includes(level.id);
          const isCongratulationsLevel = level.isCongratulationsLevel;
          
          return (
            <div 
              key={level.id} 
              className={`level-card ${isLocked ? 'locked-level' : ''} ${isCongratulationsLevel ? 'congratulations-level' : ''}`} 
              onClick={() => !isLocked && handleLevelClick(level.id)}
            >
              <h2>{isCongratulationsLevel ? 'You Win! 🎉' : `Level ${level.id}`}</h2>
              <div className="level-details">
                {isCongratulationsLevel ? (
                  <>
                    <p>💰 Prize: Rs. 200</p>
                    <p>🎁 Claim your reward!</p>
                  </>
                ) : (
                  <>
                    <p>{level.boxes} Boxes</p>
                    <p>Numbers {level.numbers}</p>
                    <p>{level.attempts} Attempts</p>
                  </>
                )}
              </div>
              <button className="level-btn" disabled={isLocked}>
                {isLocked ? 'LOCKED' : (isCongratulationsLevel ? 'Claim Prize!' : `Play Level ${level.id}`)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LevelSelect; 