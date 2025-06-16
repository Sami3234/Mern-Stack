const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate new game state
app.post('/api/new-game', (req, res) => {
    const { level } = req.body;
    console.log('Starting new game for level:', level);
    
    let numbers;
    if (level === 1) {
        numbers = [1, 2, 3, 4, 5];
    } else if (level === 2) {
        numbers = [1, 2, 3, 4, 5, 6];
    }
    
    const shuffledNumbers = shuffleArray([...numbers]);
    console.log('Generated boxes for level', level, ':', shuffledNumbers);
    console.log('Number of boxes:', shuffledNumbers.length);
    
    res.json({
        boxes: shuffledNumbers,
        level: level,
        maxNumber: level === 1 ? 5 : 6
    });
});

// Check guess
app.post('/api/check-guess', (req, res) => {
    const { boxIndex, guessNumber, gameState } = req.body;
    const isCorrect = gameState.boxes[boxIndex] === guessNumber;
    res.json({ isCorrect });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 