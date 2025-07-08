import { useState, useEffect } from 'react'
import './App.css'
import LevelSelect from './components/LevelSelect'
import LoginScreen from './components/LoginScreen'
import Navigation from './components/Navigation'
import soundManager from './components/SoundManager'

// Backend URL configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
  const [username, setUsername] = useState('');
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [showJazzCashForm, setShowJazzCashForm] = useState(false);
  const [jazzCashNumber, setJazzCashNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [prizeClaimed, setPrizeClaimed] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Left swipe - could be used for next level or navigation
      console.log('Left swipe detected');
    }
    if (isRightSwipe) {
      // Right swipe - could be used for previous level or back
      console.log('Right swipe detected');
    }
  };

  // Load username from localStorage on initial render
  useEffect(() => {
    const savedUsername = localStorage.getItem('gameUsername');
    console.log('App.jsx: Username loaded from localStorage:', savedUsername);
    if (savedUsername) {
      setUsername(savedUsername);
      setShowWelcomeScreen(false);
    } else {
      setShowWelcomeScreen(true);
    }
  }, []);

  // Fetch unlocked levels when username changes or on component mount if username exists
  useEffect(() => {
    console.log('App.jsx: Current username for fetching levels (useEffect):', username);
    const fetchUnlockedLevels = async () => {
      if (username) {
        try {
          // First try to get user's unlocked levels
          const response = await fetch(`${BACKEND_URL}/api/get-user-levels`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setUnlockedLevels(data.unlockedLevels || [1]);
            console.log('App.jsx: Unlocked levels fetched:', data.unlockedLevels);
          } else {
            // Fallback: create new game to get levels
            const gameResponse = await fetch(`${BACKEND_URL}/api/new-game`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ level: 1, username }),
            });
            const gameData = await gameResponse.json();
            if (gameResponse.ok) {
              setUnlockedLevels(gameData.unlockedLevels || [1]);
              console.log('App.jsx: Unlocked levels fetched via new-game:', gameData.unlockedLevels);
            } else {
              console.error('Error fetching unlocked levels:', gameData.message);
              setUnlockedLevels([1]);
            }
          }
        } catch (error) {
          console.error('Error fetching unlocked levels:', error);
          setUnlockedLevels([1]);
        }
      }
    };
    if (!showWelcomeScreen && username) {
      fetchUnlockedLevels();
    }
  }, [username, showWelcomeScreen]);

  // Function to refresh unlocked levels
  const refreshUnlockedLevels = async () => {
    if (username) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/get-user-levels`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setUnlockedLevels(data.unlockedLevels || [1]);
          console.log('App.jsx: Refreshed unlocked levels:', data.unlockedLevels);
        }
      } catch (error) {
        console.error('Error refreshing unlocked levels:', error);
      }
    }
  };

  const startNewGame = async (level, uname) => {
    if (uname && uname !== username) {
      setUsername(uname);
      localStorage.setItem('gameUsername', uname);
    }
    console.log('App.jsx: startNewGame called with level:', level, 'and username:', uname || username);
    try {
      const response = await fetch(`${BACKEND_URL}/api/new-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, username: uname || username }),
      });
      const data = await response.json();
      console.log('App.jsx: Game state received from backend:', data);
      
      if (response.ok) {
        setGameState(data);
        setAttempts(data.attempts || 3);
        setMessage('');
        setSelectedBox(null);
        setFoundBoxes([]);
        setShowWinPopup(false);
        setShowGameOverPopup(false);
        setCurrentHint(1);
        setCurrentLevel(level);
        setMaxNumber(data.maxNumber);
        setUnlockedLevels(data.unlockedLevels || [1]);
        console.log('App.jsx: Game state updated, currentLevel:', level, 'maxNumber:', data.maxNumber, 'attempts:', data.attempts);
      } else {
        alert(data.message);
        setCurrentLevel(null);
      }
    } catch (error) {
      console.error('Error starting new game (fetch):', error);
    }
  };

  const handleWelcomeGameStart = (user) => {
    setUsername(user.username);
    localStorage.setItem('gameUsername', user.username);
    localStorage.setItem('gameUser', JSON.stringify(user));
    setShowWelcomeScreen(false); 
  };

  const handleLogout = () => {
    setUsername('');
    setShowWelcomeScreen(true);
    setCurrentLevel(null);
    setGameState(null);
    setUnlockedLevels([1]);
  };

  const handleLevelSelect = (level) => {
    console.log('App.jsx: handleLevelSelect called. Level:', level, 'Username:', username);
    soundManager.playButtonClick(); // Play button click sound
    if (username) {
      startNewGame(level, username);
    } else {
      console.error('App.jsx: Username not set when trying to select level.');
      alert('Please enter your username first.');
      setShowWelcomeScreen(true);
    }
  };

  const handleBoxClick = async (boxIndex) => {
    if (foundBoxes.includes(boxIndex) || attempts === 0) return;

    setSelectedBox(boxIndex);
    soundManager.playBoxClick();
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/check-guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boxIndex: boxIndex,
          guessNumber: currentHint,
          username,
          gameState: { level: currentLevel, maxNumber, boxes: gameState.boxes, foundBoxes }
        }),
      });
      const data = await response.json();
      console.log('App.jsx: Check guess response:', data);

      if (data.isCorrect) {
        setMessage('Correct guess!');
        soundManager.playCorrectGuess();
        const newFoundBoxes = [...foundBoxes, boxIndex];
        setFoundBoxes(newFoundBoxes);
        setCurrentHint(currentHint + 1);

        if (newFoundBoxes.length === maxNumber) {
          soundManager.playLevelComplete();
          setShowWinPopup(true);
          // Update unlocked levels if provided
          if (data.unlockedLevels && Array.isArray(data.unlockedLevels)) {
            console.log('App.jsx: Updating unlocked levels to:', data.unlockedLevels);
            setUnlockedLevels(data.unlockedLevels);
          }
        }
      } else {
        setMessage('Wrong guess!');
        soundManager.playWrongGuess();
        const newAttempts = attempts - 1;
        setAttempts(newAttempts);

        if (newAttempts === 0) {
          soundManager.playGameOver();
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
      case 7: return "Ya tlash kro!";
      case 8: return "Ya tlash kro!";
      default: return "";
    }
  };

  const handleClaimPrize = async () => {
    if (!jazzCashNumber || !accountName) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/claim-prize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jazzCashNumber,
          accountName,
          username,
          transactionId: Date.now()
        }),
      });
      const data = await response.json();
      console.log('App.jsx: Prize claim response:', data);

      if (response.ok) {
        setPrizeClaimed(true);
        setTransactionId(data.transactionId);
        alert('Prize claimed successfully! Rs. 200 will be sent to your JazzCash account within 3 days.');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error claiming prize:', error);
    }
  };

  const closeWinPopup = () => {
    setShowWinPopup(false);
    soundManager.playButtonClick();
  };

  const closeGameOverPopup = () => {
    setShowGameOverPopup(false);
    soundManager.playButtonClick();
  };

  const handleTryAgain = () => {
    soundManager.playButtonClick();
    setShowGameOverPopup(false);
    startNewGame(currentLevel, username);
  };

  const handleBackToLevels = () => {
    soundManager.playButtonClick();
    setCurrentLevel(null);
  };

  if (showWelcomeScreen) {
    return <LoginScreen onLogin={handleWelcomeGameStart} />;
  }

  if (!currentLevel) {
    return (
      <>
        <Navigation username={username} onLogout={handleLogout} />
        <LevelSelect onLevelSelect={handleLevelSelect} username={username} unlockedLevels={unlockedLevels} />
      </>
    );
  }

  // Special rendering for congratulations level
  if (currentLevel === 11) {
    return (
      <div className="game-container">
        <h1>🎉 Congratulations! 🎉</h1>
        <div className="congratulations-content">
          <h2>You've completed all 10 levels!</h2>
          <p>You've won a prize of <strong>Rs. 200</strong>!</p>
          
          {!prizeClaimed ? (
            <div className="prize-claim-section">
              <h3>Claim Your Prize</h3>
              <p>Enter your JazzCash details to receive your reward:</p>
              
              <div className="jazzcash-form">
                <input
                  type="text"
                  placeholder="JazzCash Number (e.g., 03001234567)"
                  value={jazzCashNumber}
                  onChange={(e) => setJazzCashNumber(e.target.value)}
                  className="jazzcash-input"
                />
                <input
                  type="text"
                  placeholder="Account Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="jazzcash-input"
                />
                <button 
                  className="claim-prize-btn"
                  onClick={() => {
                    soundManager.playButtonClick();
                    handleClaimPrize();
                  }}
                  disabled={!jazzCashNumber || !accountName}
                >
                  Claim Rs. 200 Prize
                </button>
              </div>
            </div>
          ) : (
            <div className="prize-claimed-section">
              <h3>✅ Prize Claimed Successfully!</h3>
              <p>Your Rs. 200 will be sent to your JazzCash account <strong>within 3 days</strong>.</p>
              <p>Transaction ID: <strong>{transactionId}</strong></p>
              <div className="payment-status">
                <p style={{color: '#FFD700', fontWeight: 'bold', margin: '0'}}>
                  💰 Payment Status: Processing
                </p>
                <p style={{color: '#fff', fontSize: '0.9em', margin: '5px 0 0 0'}}>
                  You will receive payment within 3 business days
                </p>
              </div>
            </div>
          )}
          
          <button className="new-game-btn" onClick={() => setCurrentLevel(null)}>
            Back to Levels
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering boxes. Current gameState.boxes:', gameState?.boxes);
  console.log('Number of boxes to render:', gameState?.boxes?.length);

  return (
    <>
      <Navigation username={username} onLogout={handleLogout} />
      <div 
        className="game-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="game-header">
          <h1>Level {currentLevel}</h1>
          <div className="game-stats">
            <span>Attempts: <span className="attempts-display">{attempts}</span></span>
            <span>Found: {foundBoxes.length}/{maxNumber}</span>
          </div>
          {message && <div className="message">{message}</div>}
        </div>
        
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

        <div className="game-actions">
          <button className="new-game-btn" onClick={handleBackToLevels}>
            Back to Levels
          </button>
        </div>

        {showWinPopup && (
          <div className="win-popup">
            <div className="win-content">
              <h2>🎉 Congratulations! 🎉</h2>
              <p>You found all the numbers!</p>
              <button className="new-game-btn" onClick={() => {
                soundManager.playButtonClick();
                setCurrentLevel(null);
                refreshUnlockedLevels();
              }}>
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
              <div className="game-over-buttons">
                <button className="try-again-btn" onClick={handleTryAgain}>
                  Try Again
                </button>
                <button className="new-game-btn" onClick={handleBackToLevels}>
                  Back to Levels
        </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
