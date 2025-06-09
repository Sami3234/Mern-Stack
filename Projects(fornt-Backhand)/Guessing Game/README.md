# Number Guessing Game

A modern web-based number guessing game with separate frontend and backend.

## Project Structure

```
number-guessing-game/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx    # Authentication component
│   │   │   └── Game.jsx    # Game component
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── backend/            # Express.js backend server
    ├── server.js       # Main server file
    └── package.json
```

## Getting Started

### Frontend
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Backend
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

The backend server will run on http://localhost:5000

## Features

- User authentication (login/register)
- Interactive number guessing game
- Beautiful UI with animations
- Mobile-responsive design
- Modern gradient backgrounds
- Smooth transitions and hover effects

## Technologies Used

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion (for animations)

### Backend
- Express.js
- CORS
- Node.js 