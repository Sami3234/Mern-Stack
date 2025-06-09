import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TOTAL_BOXES = 5;
const MAX_ATTEMPTS = 3;

const Game = ({ user, onLogout }) => {
  const [boxes, setBoxes] = useState([]); // shuffled numbers 1-5
  const [revealed, setRevealed] = useState(Array(TOTAL_BOXES).fill(false));
  const [currentNumber, setCurrentNumber] = useState(1);
  const [attempt, setAttempt] = useState(1);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setBoxes(shuffle([1, 2, 3, 4, 5]));
    setRevealed(Array(TOTAL_BOXES).fill(false));
    setCurrentNumber(1);
    setAttempt(1);
    setMessage('Game Start! Find number 1');
    setGameOver(false);
    setWin(false);
  };

  const handleBoxClick = (idx) => {
    if (gameOver || revealed[idx]) return;
    if (boxes[idx] === currentNumber) {
      // Correct
      const newRevealed = [...revealed];
      newRevealed[idx] = true;
      setRevealed(newRevealed);
      if (currentNumber === TOTAL_BOXES) {
        setMessage('🎉 Congratulations! You found all numbers!');
        setGameOver(true);
        setWin(true);
      } else {
        setMessage(`✅ Correct! Now find number ${currentNumber + 1}`);
        setCurrentNumber(currentNumber + 1);
        setAttempt(1);
      }
    } else {
      // Incorrect
      if (attempt < MAX_ATTEMPTS) {
        setAttempt(attempt + 1);
        setMessage(`❌ Incorrect! Attempts left: ${MAX_ATTEMPTS - attempt}`);
      } else {
        setMessage('💀 Game Over! You failed all attempts.');
        setGameOver(true);
        setWin(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
        <motion.div
            key={i}
            className="absolute w-8 h-8 bg-white/10 rounded-full animate-float"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      <div className="card max-w-2xl w-full relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent drop-shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Welcome, {user.firstName}!
          </motion.h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="btn-secondary"
          >
            Logout
              </motion.button>
          </div>
        <div className="text-center mb-6">
          <motion.p 
            className={`text-2xl font-bold mb-2 ${win ? 'text-green-600' : gameOver ? 'text-red-600' : 'text-gray-700'}`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {message}
          </motion.p>
          {!gameOver && (
            <p className="text-lg text-gray-800">Number to find: <span className="font-bold text-primary-600">{currentNumber}</span> | Attempt: <span className="font-bold text-accent-600">{attempt}/{MAX_ATTEMPTS}</span></p>
          )}
        </div>
        <div className="grid grid-cols-5 gap-6 mb-8">
          {boxes.map((num, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: !gameOver && !revealed[idx] ? 1.08 : 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBoxClick(idx)}
              disabled={gameOver || revealed[idx]}
              className={`h-32 flex flex-col items-center justify-center rounded-2xl text-2xl font-bold shadow-lg border-4 transition-all duration-300
                ${revealed[idx]
                  ? 'bg-green-400 border-green-600 text-white scale-105'
                  : gameOver && !revealed[idx]
                  ? 'bg-red-200 border-red-400 text-red-700 opacity-60'
                  : 'bg-white/90 border-primary-300 text-primary-700 hover:bg-primary-100 hover:border-primary-500'}
                ${gameOver || revealed[idx] ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="block text-lg text-gray-500 mb-2">Box {idx + 1}</span>
              <span className="text-3xl font-extrabold tracking-widest">{revealed[idx] ? num : '?'}</span>
            </motion.button>
          ))}
        </div>
        <div className="text-center flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startNewGame}
            className="btn-primary"
          >
            {gameOver ? (win ? 'Play Again' : 'Retry') : 'Restart'}
            </motion.button>
          </div>
      </div>
    </div>
  );
};

export default Game; 