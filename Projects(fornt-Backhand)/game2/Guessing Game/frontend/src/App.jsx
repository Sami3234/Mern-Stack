import { useState, useEffect } from 'react'
import './App.css'
import LevelSelect from './components/LevelSelect'

function App() {
  const [gameState, setGameState] = useState(null);
  const [attempts, setAttempts] = useState(3);
  const [message, setMessage] = useState('');
  const [selectedBox, setSelectedBox] = useState(null);
  const [foundBoxes, setFoundBoxes] = useState([]);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [currentHint, setCurrentHint] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [maxNumber, setMaxNumber] = useState(null);

  const startNewGame = async (level) => {
    try {
      console.log('Starting new game for level:', level);
      const response = await fetch('http://localhost:5000/api/new-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level }),
      });
      const data = await response.json();
      console.log('Game state received:', data);
      console.log('Number of boxes from backend data:', data.boxes.length);
      
      setGameState(data);
      setAttempts(3);
      setMessage('');
      setSelectedBox(null);
      setFoundBoxes([]);
      setShowWinPopup(false);
      setShowGameOverPopup(false);
      setCurrentHint(1);
      setCurrentLevel(level);
      setMaxNumber(level === 1 ? 5 : 6);
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const handleLevelSelect = (level) => {
    console.log('Level selected:', level);
    startNewGame(level);
  };

  const handleBoxClick = async (boxIndex) => {
    if (foundBoxes.includes(boxIndex) || attempts === 0) return;
    
    setSelectedBox(boxIndex);
    try {
      const response = await fetch('http://localhost:5000/api/check-guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boxIndex: boxIndex,
          guessNumber: currentHint,
          gameState,
        }),
      });
      const data = await response.json();
      
      if (data.isCorrect) {
        setMessage('Correct guess!');
        const newFoundBoxes = [...foundBoxes, boxIndex];
        setFoundBoxes(newFoundBoxes);
        setCurrentHint(prev => prev + 1);
        
        // Check if all boxes are found
        if (newFoundBoxes.length === maxNumber) {
          setShowWinPopup(true);
        }
      } else {
        setMessage('Wrong guess!');
        const newAttempts = attempts - 1;
        setAttempts(newAttempts);
        
        // Check if game over
        if (newAttempts === 0) {
          setShowGameOverPopup(true);
        }
      }
      
      setSelectedBox(null);
    } catch (error) {
      console.error('Error checking guess:', error);
    }
  };

  const getHintText = (number) => {
    switch(number) {
      case 1: return "Ya dondo!";
      case 2: return "Ya tlash kro!";
      case 3: return "Ya tlash kro!";
      case 4: return "Ya tlash kro!";
      case 5: return "Ya tlash kro!";
      case 6: return "Ya tlash kro!";
      default: return "";
    }
  };

  if (!currentLevel) {
    return <LevelSelect onLevelSelect={handleLevelSelect} />;
  }

  console.log('Rendering boxes. Current gameState.boxes:', gameState?.boxes);
  console.log('Number of boxes to render:', gameState?.boxes?.length);

  return (
    <div className="game-container">
      <h1>Number Guessing Game - Level {currentLevel}</h1>
      <p>Attempts remaining: {attempts}</p>
      {message && <p className="message">{message}</p>}
      
      <div className="hint-container">
        <h2>Find Number {currentHint}</h2>
        <p className="hint-text">{getHintText(currentHint)}</p>
      </div>
      
      <div className="boxes-container">
        {gameState?.boxes.map((_, index) => (
          <div
            key={index}
            className={`box ${selectedBox === index ? 'selected' : ''} ${foundBoxes.includes(index) ? 'found' : ''}`}
            onClick={() => handleBoxClick(index)}
          >
            {foundBoxes.includes(index) ? 'OPENED' : `Box ${index + 1}`}
          </div>
        ))}
      </div>

      <button className="new-game-btn" onClick={() => setCurrentLevel(null)}>
        Back to Levels
      </button>

      {showWinPopup && (
        <div className="win-popup">
          <div className="win-content">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You found all the numbers!</p>
            <button className="new-game-btn" onClick={() => setCurrentLevel(null)}>
              Back to Levels
            </button>
          </div>
        </div>
      )}

      {showGameOverPopup && (
        <div className="win-popup">
          <div className="win-content game-over">
            <h2>😢 Game Over! 😢</h2>
            <p>You've used all your attempts!</p>
            <button className="new-game-btn" onClick={() => setCurrentLevel(null)}>
              Back to Levels
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
