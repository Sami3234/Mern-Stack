class SoundManager {
  constructor() {
    this.isMuted = false;
    this.volume = 0.5;
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      // Try to create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('Audio context initialized successfully');
    } catch (error) {
      console.warn('Web Audio API not supported, using fallback:', error);
      this.audioContext = null;
    }
  }

  // Simple beep sound generator
  generateBeep(frequency = 800, duration = 0.1, type = 'sine') {
    if (!this.audioContext) {
      console.log('Audio context not available, skipping sound');
      return;
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Error generating beep:', error);
    }
  }

  play(soundName) {
    if (this.isMuted) {
      console.log('Sound is muted, skipping:', soundName);
      return;
    }

    try {
      switch(soundName) {
        case 'boxClick':
          this.generateBeep(1000, 0.05, 'square');
          break;
        case 'correctGuess':
          this.generateBeep(800, 0.2, 'sine');
          setTimeout(() => this.generateBeep(1000, 0.2, 'sine'), 100);
          break;
        case 'wrongGuess':
          this.generateBeep(200, 0.3, 'sawtooth');
          break;
        case 'levelComplete':
          this.generateBeep(523, 0.1, 'sine'); // C
          setTimeout(() => this.generateBeep(659, 0.1, 'sine'), 100); // E
          setTimeout(() => this.generateBeep(784, 0.1, 'sine'), 200); // G
          setTimeout(() => this.generateBeep(1047, 0.3, 'sine'), 300); // C
          break;
        case 'gameOver':
          this.generateBeep(200, 0.5, 'sawtooth');
          setTimeout(() => this.generateBeep(150, 0.5, 'sawtooth'), 500);
          break;
        case 'buttonClick':
          this.generateBeep(1000, 0.05, 'square');
          break;
        default:
          this.generateBeep(800, 0.1, 'sine');
      }
      console.log('Sound played successfully:', soundName);
    } catch (error) {
      console.warn(`Error playing sound: ${soundName}`, error);
    }
  }

  playBackgroundMusic() {
    console.log('Background music not implemented');
  }

  stopBackgroundMusic() {
    console.log('Background music not implemented');
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    console.log(`Volume set to: ${this.volume}`);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    console.log(`Sound ${this.isMuted ? 'muted' : 'unmuted'}`);
    return this.isMuted;
  }

  // Convenience methods
  playBoxClick() { this.play('boxClick'); }
  playCorrectGuess() { this.play('correctGuess'); }
  playWrongGuess() { this.play('wrongGuess'); }
  playLevelComplete() { this.play('levelComplete'); }
  playGameOver() { this.play('gameOver'); }
  playButtonClick() { this.play('buttonClick'); }

  getVolume() { return this.volume; }
  isSoundMuted() { return this.isMuted; }
}

const soundManager = new SoundManager();
export default soundManager;