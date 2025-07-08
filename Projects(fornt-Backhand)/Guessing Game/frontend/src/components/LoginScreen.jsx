import React, { useState } from 'react';
import './LoginScreen.css';
import soundManager from './SoundManager';
import Logo from './Logo';

function LoginScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage(''); // Clear message when user types
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        setMessage('Please fill in all fields.');
        return false;
      }
    } else {
      if (!formData.firstName || !formData.lastName || !formData.username || !formData.password || !formData.confirmPassword) {
        setMessage('Please fill in all fields.');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match.');
        return false;
      }
      
      if (formData.password.length < 4) {
        setMessage('Password must be at least 4 characters long.');
        return false;
      }
      
      // Username validation (must have chars + digits)
      const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
      if (!usernameRegex.test(formData.username)) {
        setMessage('Username must be at least 4 characters long and contain both letters and numbers.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const requestData = isLogin 
        ? { username: formData.username, password: formData.password }
        : { 
            firstName: formData.firstName, 
            lastName: formData.lastName, 
            username: formData.username, 
            password: formData.password 
          };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (data.success) {
          // Store user data in localStorage
          localStorage.setItem('gameUser', JSON.stringify(data.user));
          localStorage.setItem('gameUsername', data.user.username);
          
          // Call parent function to handle login
          onLogin(data.user);
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
    setMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Logo size="large" animated={true} />
          <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        </div>
        
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="form-group">
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
              />
            </>
          )}
          
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-input"
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
          />
          
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
            />
          )}
        </div>

        <button 
          className="submit-btn" 
          onClick={() => {
            soundManager.playButtonClick();
            handleSubmit();
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
        </button>

        <div className="toggle-mode">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="toggle-btn" onClick={() => {
              soundManager.playButtonClick();
              toggleMode();
            }}>
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>

        {!isLogin && (
          <div className="requirements">
            <h3>Requirements:</h3>
            <ul>
              <li>Username: At least 4 characters with letters and numbers</li>
              <li>Password: At least 4 characters</li>
              <li>First and Last name required</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginScreen; 