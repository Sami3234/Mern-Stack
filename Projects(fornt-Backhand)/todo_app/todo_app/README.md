# Todo App

A simple Todo application with React frontend and Node.js/Express backend using MongoDB.

## Project Structure
```
todo_app/
├── backend/           # Node.js/Express backend
│   ├── config/       # Configuration files
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── server.js     # Express server
└── frontend/         # React frontend (Vite)
    ├── src/
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the backend directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todoapp
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
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

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Features
- Create, Read, Update, and Delete todos
- MongoDB database integration
- RESTful API
- React frontend with Axios for API calls
- Express backend with CORS support 