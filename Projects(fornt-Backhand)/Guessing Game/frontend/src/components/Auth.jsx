import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('username'); // 'username' or 'email'

  useEffect(() => {
    // Check for Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('user', JSON.stringify({ token }));
      onLogin(token);
    }
  }, [onLogin]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin) {
        // Registration validation
        if (!formData.username || !formData.email || !formData.password) {
          throw new Error('All fields are required');
        }
        if (!validateEmail(formData.email)) {
          throw new Error('Please enter a valid email address');
        }
        if (!validatePassword(formData.password)) {
          throw new Error('Password must be at least 6 characters long');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
      } else {
        // Login validation
        if (loginMethod === 'email' && !formData.email) {
          throw new Error('Email is required');
        }
        if (loginMethod === 'username' && !formData.username) {
          throw new Error('Username is required');
        }
        if (!formData.password) {
          throw new Error('Password is required');
        }
      }

      const response = await fetch(`http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(loginMethod === 'email' ? { email: formData.email } : { username: formData.username }),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify({
        token: data.token,
        username: data.username,
        email: data.email
      }));

      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {isLogin ? 'Welcome Back! 👋' : 'Create Account ✨'}
        </h2>

        {isLogin && (
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setLoginMethod('username')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                loginMethod === 'username'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Username
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                loginMethod === 'email'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Email
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="text-label block">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Choose a username"
                required
              />
              <p className="text-description">
                Username must be at least 3 characters long
              </p>
            </div>
          )}

          {(!isLogin || loginMethod === 'email') && (
            <div>
              <label className="text-label block">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
                required
              />
              <p className="text-description">
                We'll never share your email with anyone else
              </p>
            </div>
          )}

          {isLogin && loginMethod === 'username' && (
            <div>
              <label className="text-label block">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your username"
                required
              />
            </div>
          )}

          <div>
            <label className="text-label block">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your password"
              required
            />
            <p className="text-description">
              Password must be at least 6 characters long
            </p>
          </div>

          {!isLogin && (
            <div>
              <label className="text-label block">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </motion.button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </motion.button>

          <p className="text-center text-gray-700">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  username: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth; 