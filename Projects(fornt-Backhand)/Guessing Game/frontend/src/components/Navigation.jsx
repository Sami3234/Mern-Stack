import React, { useState } from 'react';
import './Navigation.css';
import soundManager from './SoundManager';
import SoundSettings from './SoundSettings';
import Logo from './Logo';

function Navigation({ username, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isSoundMuted());
  const [showSoundSettings, setShowSoundSettings] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    soundManager.playButtonClick();
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('gameUsername');
    localStorage.removeItem('gameUser');
    
    // Call parent logout function
    onLogout();
    
    // Close menu
    setIsMenuOpen(false);
    
    soundManager.playButtonClick();
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playButtonClick();
  };

  const openSoundSettings = () => {
    setShowSoundSettings(true);
    setIsMenuOpen(false);
    soundManager.playButtonClick();
  };

  return (
    <>
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-brand">
            <Logo size="medium" animated={true} />
          </div>
          
          <div className="nav-user">
            <span className="username">Welcome, {username}</span>
            
            <div className="hamburger-menu" onClick={toggleMenu}>
              <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="menu-item" onClick={toggleSound}>
            <span className="menu-icon">{isMuted ? '🔇' : '🔊'}</span>
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </div>
          <div className="menu-item" onClick={openSoundSettings}>
            <span className="menu-icon">⚙️</span>
            <span>Sound Settings</span>
          </div>
          <div className="menu-item" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </nav>

      {/* Sound Settings Modal */}
      <SoundSettings 
        isOpen={showSoundSettings} 
        onClose={() => setShowSoundSettings(false)} 
      />
    </>
  );
}

export default Navigation; 