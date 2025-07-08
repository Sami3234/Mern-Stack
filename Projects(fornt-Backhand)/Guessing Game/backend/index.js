const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' }); // Load .env file

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Test if .env loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
});

// User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    unlockedLevels: { type: [Number], default: [1] },
    prizeClaimed: { type: Boolean, default: false },
    jazzCashNumber: { type: String },
    accountName: { type: String },
    transactionId: { type: String },
    prizeClaimedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Utility: Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start new game
app.post('/api/new-game', async (req, res) => {
    const { level, username } = req.body;
    console.log(`🎮 New game requested by ${username} at level ${level}`);

    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username });
            await user.save();
            console.log('🆕 New user created:', username);
        }

        // Check if level is unlocked
        if (!user.unlockedLevels.includes(level)) {
            return res.status(403).json({ message: `Level ${level} is locked. Complete previous levels first.` });
        }

        // Define level configurations
        const levelConfigs = {
            1: { numbers: [1,2,3,4,5], attempts: 3 },
            2: { numbers: [1,2,3,4,5,6], attempts: 3 },
            3: { numbers: [1,2,3,4,5,6,7], attempts: 4 },
            4: { numbers: [1,2,3,4,5,6,7,8], attempts: 4 },
            5: { numbers: [1,2,3,4,5,6,7,8,9], attempts: 5 },
            6: { numbers: [1,2,3,4,5,6,7,8,9,10], attempts: 5 },
            7: { numbers: [1,2,3,4,5,6,7,8,9,10,11], attempts: 6 },
            8: { numbers: [1,2,3,4,5,6,7,8,9,10,11,12], attempts: 6 },
            9: { numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13], attempts: 7 },
            10: { numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14], attempts: 7 },
            11: { numbers: [1,2,3,4,5], attempts: 3, isCongratulationsLevel: true }
        };

        const config = levelConfigs[level];
        if (!config) {
            return res.status(400).json({ message: 'Invalid level.' });
        }

        const shuffledNumbers = shuffleArray([...config.numbers]);

        console.log(`Level ${level} - Boxes order:`, shuffledNumbers);

        res.json({
            boxes: shuffledNumbers,
            level,
            maxNumber: config.numbers.length,
            attempts: config.attempts,
            unlockedLevels: user.unlockedLevels
        });
    } catch (err) {
        console.error('Error in /new-game:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Unlock level manually
app.post('/api/unlock-level', async (req, res) => {
    const { username, levelToUnlock } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (!user.unlockedLevels.includes(levelToUnlock)) {
            user.unlockedLevels.push(levelToUnlock);
            await user.save();
            console.log(`🔓 Level ${levelToUnlock} unlocked for user ${username}`);
        }

        res.json({ success: true, unlockedLevels: user.unlockedLevels });
    } catch (err) {
        console.error('Error unlocking level:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Check guess
app.post('/api/check-guess', async (req, res) => {
    const { boxIndex, guessNumber, gameState, username } = req.body;
    console.log(`🎯 Check guess request:`, { boxIndex, guessNumber, gameState, username });
    
    const isCorrect = gameState.boxes[boxIndex] === guessNumber;
    console.log(`✅ Is correct:`, isCorrect);

    let winConditionMet = false;
    let nextLevelToUnlock = null;
    let updatedUnlockedLevels = null;

    if (isCorrect) {
        const foundCount = gameState.foundBoxes.length + 1;
        console.log(`📊 Found count: ${foundCount}, Max number: ${gameState.maxNumber}`);
        
        if (foundCount === gameState.maxNumber) {
            winConditionMet = true;
            console.log(`🏆 Win condition met! Current level: ${gameState.level}`);
            
            // Determine next level to unlock
            if (gameState.level === 1) nextLevelToUnlock = 2;
            else if (gameState.level === 2) nextLevelToUnlock = 3;
            else if (gameState.level === 3) nextLevelToUnlock = 4;
            else if (gameState.level === 4) nextLevelToUnlock = 5;
            else if (gameState.level === 5) nextLevelToUnlock = 6;
            else if (gameState.level === 6) nextLevelToUnlock = 7;
            else if (gameState.level === 7) nextLevelToUnlock = 8;
            else if (gameState.level === 8) nextLevelToUnlock = 9;
            else if (gameState.level === 9) nextLevelToUnlock = 10;
            
            console.log(`🔓 Next level to unlock: ${nextLevelToUnlock}`);
        }
    }

    if (winConditionMet && nextLevelToUnlock) {
        try {
            const user = await User.findOne({ username });
            console.log(`👤 User found:`, user ? 'Yes' : 'No');
            console.log(`🔓 Current unlocked levels:`, user?.unlockedLevels);
            
            if (user && !user.unlockedLevels.includes(nextLevelToUnlock)) {
                user.unlockedLevels.push(nextLevelToUnlock);
                await user.save();
                updatedUnlockedLevels = user.unlockedLevels;
                console.log(`🏆 Level ${nextLevelToUnlock} unlocked for user:`, username);
                console.log(`🔓 Updated unlocked levels:`, updatedUnlockedLevels);
            } else {
                console.log(`⚠️ Level ${nextLevelToUnlock} already unlocked or user not found`);
            }
        } catch (err) {
            console.error('Error unlocking level on win:', err.message);
        }
    }

    // Special logic for congratulations level
    if (winConditionMet && gameState.level === 10) {
        try {
            const user = await User.findOne({ username });
            if (user && !user.unlockedLevels.includes(11)) {
                user.unlockedLevels.push(11);
                await user.save();
                updatedUnlockedLevels = user.unlockedLevels;
                console.log(`🎉 Congratulations level unlocked for user:`, username);
            }
        } catch (err) {
            console.error('Error unlocking congratulations level:', err.message);
        }
    }

    const response = {
        isCorrect,
        winConditionMet,
        unlockedLevels: updatedUnlockedLevels,
        isCongratulationsLevel: gameState.level === 10 && winConditionMet
    };
    
    console.log(`📤 Sending response:`, response);
    res.json(response);
});

// JazzCash integration endpoint
app.post('/api/claim-prize', async (req, res) => {
    const { username, jazzCashNumber, accountName } = req.body;
    console.log(`💰 Prize claim request from ${username}:`, { jazzCashNumber, accountName });

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.unlockedLevels.includes(11)) {
            return res.status(403).json({ message: 'Complete all 10 levels first to claim prize.' });
        }

        // Here you would integrate with JazzCash API
        // For now, we'll simulate the transaction
        const transactionId = 'JZ' + Date.now() + Math.random().toString(36).substr(2, 5);
        
        // Save prize claim details
        user.prizeClaimed = true;
        user.jazzCashNumber = jazzCashNumber;
        user.accountName = accountName;
        user.transactionId = transactionId;
        user.prizeClaimedAt = new Date();
        await user.save();

        console.log(`💰 Prize claimed successfully for ${username}. Transaction ID: ${transactionId}`);
        
        res.json({ 
            success: true, 
            message: 'Prize claimed successfully! Rs. 200 will be sent to your JazzCash account within 3 days.',
            transactionId: transactionId
        });
    } catch (err) {
        console.error('Error claiming prize:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Register new user
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    console.log(`📝 Registration request for username: ${username}`);

    try {
        // Validate input
        if (!firstName || !lastName || !username || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Validate username format (must have chars + digits)
        const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ 
                message: 'Username must be at least 4 characters long and contain both letters and numbers.' 
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists. Please choose a different one.' });
        }

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            username,
            password, // In production, hash this password
            unlockedLevels: [1]
        });

        await newUser.save();
        console.log(`✅ New user registered: ${username}`);

        res.json({ 
            success: true, 
            message: 'Account created successfully!',
            user: {
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }
        });
    } catch (err) {
        console.error('Error in registration:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`🔐 Login attempt for username: ${username}`);

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Check password (in production, use bcrypt to compare hashed passwords)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        console.log(`✅ User logged in: ${username}`);

        res.json({ 
            success: true, 
            message: 'Login successful!',
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                unlockedLevels: user.unlockedLevels
            }
        });
    } catch (err) {
        console.error('Error in login:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get user's unlocked levels
app.post('/api/get-user-levels', async (req, res) => {
    const { username } = req.body;
    console.log(`🔍 Getting unlocked levels for user: ${username}`);

    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username });
            await user.save();
            console.log('🆕 New user created:', username);
        }

        console.log(`🔓 Unlocked levels for ${username}:`, user.unlockedLevels);
        res.json({ unlockedLevels: user.unlockedLevels });
    } catch (err) {
        console.error('Error getting user levels:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Test endpoint: Unlock all levels for a user
app.post('/api/unlock-all-levels', async (req, res) => {
    const { username } = req.body;
    console.log(`🔓 Unlocking all levels for user: ${username}`);

    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username });
        }
        
        user.unlockedLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        await user.save();
        console.log(`🔓 All levels unlocked for ${username}:`, user.unlockedLevels);
        
        res.json({ success: true, unlockedLevels: user.unlockedLevels });
    } catch (err) {
        console.error('Error unlocking all levels:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Admin endpoint: Get all prize claims
app.get('/api/admin/prize-claims', async (req, res) => {
    console.log('🔍 Admin requesting prize claims');

    try {
        const users = await User.find({ 
            prizeClaimed: true 
        }).select('username jazzCashNumber accountName transactionId prizeClaimedAt');
        
        console.log(`📊 Found ${users.length} prize claims`);
        
        res.json({ 
            success: true, 
            totalClaims: users.length,
            claims: users 
        });
    } catch (err) {
        console.error('Error fetching prize claims:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Admin endpoint: Get specific user's prize claim
app.get('/api/admin/user/:username', async (req, res) => {
    const { username } = req.params;
    console.log(`🔍 Admin requesting user: ${username}`);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        res.json({ 
            success: true, 
            user: {
                username: user.username,
                jazzCashNumber: user.jazzCashNumber,
                accountName: user.accountName,
                transactionId: user.transactionId,
                prizeClaimedAt: user.prizeClaimedAt,
                prizeClaimed: user.prizeClaimed,
                unlockedLevels: user.unlockedLevels
            }
        });
    } catch (err) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});