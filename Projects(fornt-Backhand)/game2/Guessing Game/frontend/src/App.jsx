import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [gameState, setGameState] = useState(null);
  const [attempts, setAttempts] = useState(3);
  const [message, setMessage] = useState('');
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);

  const startNewGame = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/new-game', {
        method: 'POST',
      });
      const data = await response.json();
      setGameState(data);
      setAttempts(3);
      setMessage('');
      setSelectedBox(null);
      setSelectedNumber(null);
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const handleBoxClick = (boxIndex) => {
    setSelectedBox(boxIndex);
  };

  const handleNumberClick = async (number) => {
    if (selectedBox === null || attempts === 0) return;

    setSelectedNumber(number);
    try {
      const response = await fetch('http://localhost:5000/api/check-guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boxIndex: selectedBox,
          guessNumber: number,
          gameState,
        }),
      });
      const data = await response.json();
      
      if (data.isCorrect) {
        setMessage('Correct guess!');
      } else {
        setMessage('Wrong guess!');
        setAttempts(attempts - 1);
      }
      
      setSelectedBox(null);
      setSelectedNumber(null);
    } catch (error) {
      console.error('Error checking guess:', error);
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <div className="game-container">
      <h1>Number Guessing Game</h1>
      <p>Attempts remaining: {attempts}</p>
      {message && <p className="message">{message}</p>}
      
      <div className="boxes-container">
        {gameState?.boxes.map((_, index) => (
          <div
            key={index}
            className={`box ${selectedBox === index ? 'selected' : ''}`}
            onClick={() => handleBoxClick(index)}
          >
            Box {index + 1}
          </div>
        ))}
      </div>

      <div className="numbers-container">
        {[1, 2, 3, 4, 5].map((number) => (
          <button
            key={number}
            className={`number-btn ${selectedNumber === number ? 'selected' : ''}`}
            onClick={() => handleNumberClick(number)}
            disabled={selectedBox === null || attempts === 0}
          >
            {number}
          </button>
        ))}
      </div>

      <button className="new-game-btn" onClick={startNewGame}>
        New Game
      </button>
    </div>
  )
}

export default App
