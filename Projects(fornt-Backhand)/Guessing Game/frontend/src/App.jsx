import { useState } from 'react'
import Auth from './components/Auth'
import Game from './components/Game'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
      {user ? (
        <Game user={user} onLogout={handleLogout} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
