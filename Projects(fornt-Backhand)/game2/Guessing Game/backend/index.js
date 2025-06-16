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
    const numbers = [1, 2, 3, 4, 5];
    const shuffledNumbers = shuffleArray([...numbers]);
    res.json({ boxes: shuffledNumbers });
});

// Check guess
app.post('/api/check-guess', (req, res) => {
    const { boxIndex, guessNumber } = req.body;
    const { boxes } = req.body.gameState;
    
    const isCorrect = boxes[boxIndex] === guessNumber;
    res.json({ isCorrect });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 