const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Create new user if doesn't exist
        const email = profile.emails[0].value;
        const username = email.split('@')[0];
        
        // Check if username already exists
        let usernameExists = await User.findOne({ username });
        if (usernameExists) {
          username = `${username}${Math.floor(Math.random() * 1000)}`;
        }
        
        user = await User.create({
          googleId: profile.id,
          email: email,
          username: username,
          password: Math.random().toString(36).slice(-8) // Random password for Google users
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Google OAuth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: 'http://localhost:5173/login-error'
  }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, JWT_SECRET);
    res.redirect(`http://localhost:5173/auth-success?token=${token}`);
  }
);

// Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.username === username
          ? 'Username already exists'
          : 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(201).json({
      token,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username || '' },
        { email: email || '' }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
      token,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Update high score route
app.post('/api/game/score', auth, async (req, res) => {
  try {
    const { score } = req.body;
    
    if (score > req.user.highScore) {
      req.user.highScore = score;
      await req.user.save();
    }
    
    res.json({ highScore: req.user.highScore });
  } catch (error) {
    res.status(500).json({ message: 'Error updating score' });
  }
});

// Get user profile endpoint
app.get('/api/user/profile', auth, async (req, res) => {
  try {
    res.json({
      username: req.user.username,
      email: req.user.email,
      highScore: req.user.highScore,
      createdAt: req.user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 