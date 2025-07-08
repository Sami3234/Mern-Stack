import React, { useState, useEffect } from 'react';
import soundManager from './SoundManager';
import './SoundSettings.css';

function SoundSettings({ isOpen, onClose }) {
  const [volume, setVolume] = useState(soundManager.getVolume());
  const [isMuted, setIsMuted] = useState(soundManager.isSoundMuted());

  useEffect(() => {
    setVolume(soundManager.getVolume());
    setIsMuted(soundManager.isSoundMuted());
  }, [isOpen]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
  };

  const handleMuteToggle = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playButtonClick();
  };

  const handleClose = () => {
    soundManager.playButtonClick();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sound-settings-overlay" onClick={handleClose}>
      <div className="sound-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>🔊 Sound Settings</h2>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
        
        <div className="settings-content">
          <div className="setting-item">
            <label>Master Volume</label>
            <div className="volume-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
              <span className="volume-value">{Math.round(volume * 100)}%</span>
            </div>
            <p className="volume-note">Note: Volume control works with real audio files</p>
          </div>

          <div className="setting-item">
            <label>Mute All Sounds</label>
            <button 
              className={`mute-btn ${isMuted ? 'muted' : ''}`}
              onClick={handleMuteToggle}
            >
              {isMuted ? '🔇 Unmute' : '🔊 Mute'}
            </button>
          </div>

          <div className="sound-test">
            <h3>Test Generated Sounds</h3>
            <p className="test-note">These are simple generated tones for testing</p>
            <div className="test-buttons">
              <button onClick={() => soundManager.playBoxClick()}>
                📦 Box Click
              </button>
              <button onClick={() => soundManager.playCorrectGuess()}>
                ✅ Correct
              </button>
              <button onClick={() => soundManager.playWrongGuess()}>
                ❌ Wrong
              </button>
              <button onClick={() => soundManager.playButtonClick()}>
                🔘 Button
              </button>
              <button onClick={() => soundManager.playLevelComplete()}>
                🎉 Victory
              </button>
              <button onClick={() => soundManager.playGameOver()}>
                😢 Game Over
              </button>
            </div>
          </div>

          <div className="info-section">
            <h3>ℹ️ About Sounds</h3>
            <p>Currently using generated tones. For better sounds:</p>
            <ul>
              <li>Download real audio files from freesound.org</li>
              <li>Replace placeholder files in /sounds folder</li>
              <li>Restart the app to use real sounds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoundSettings; 