/**
 * SkyWorld v9.0 - Audio Manager
 * Handles all audio functionality including block sounds and background music
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.isEnabled = true;
        this.isInitialized = false;
        this.isMusicPlaying = false;
        this.backgroundMusicOscillators = [];
        
        // Audio settings
        this.volume = 0.7;
        this.sfxVolume = 0.3;
        this.musicVolume = 0.1;
        
        // Block sound mappings
        this.blockSounds = {
            grass: [200, 220],
            stone: [150, 180],
            wood: [250, 280],
            iron: [400, 450],
            diamond: [600, 700],
            liquid: [100, 120],
            crystal: [800, 900]
        };
        
        // Background music pattern
        this.musicPattern = [
            [261.63, 0.3], // C
            [293.66, 0.3], // D
            [329.63, 0.3], // E
            [349.23, 0.3], // F
            [392.00, 0.6], // G
            [440.00, 0.3], // A
            [493.88, 0.6], // B
            [523.25, 1.0]  // C
        ];
    }
    
    async initialize() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume context if suspended (required by browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.isInitialized = true;
            console.log('🔊 Audio system initialized');
            
            return true;
        } catch (error) {
            console.warn('⚠️ Web Audio API not supported:', error);
            this.isEnabled = false;
            this.updateUI();
            return false;
        }
    }
    
    async playBlockSound(blockType, volume = 1) {
        if (!this.isEnabled || !this.isInitialized || !this.audioContext) {
            return;
        }
        
        try {
            // Create oscillator for block sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            // Configure sound based on block type
            const frequencies = this.blockSounds[blockType] || [300, 350];
            
            oscillator.frequency.setValueAtTime(frequencies[0], this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(frequencies[1], this.audioContext.currentTime + 0.1);
            
            // Add filter for different block textures
            this.configureBlockFilter(filterNode, blockType);
            
            // Set volume
            const finalVolume = this.sfxVolume * volume;
            gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            // Connect audio nodes
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Play sound
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.15);
            
            console.log(`🔨 Played ${blockType} sound`);
            
        } catch (error) {
            console.warn('⚠️ Error playing block sound:', error);
        }
    }
    
    configureBlockFilter(filterNode, blockType) {
        // Configure frequency filter based on block material
        switch (blockType) {
            case 'stone':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(800, this.audioContext.currentTime);
                break;
            case 'wood':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(400, this.audioContext.currentTime);
                break;
            case 'iron':
            case 'diamond':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(300, this.audioContext.currentTime);
                break;
            case 'lava':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(200, this.audioContext.currentTime);
                filterNode.Q.setValueAtTime(5, this.audioContext.currentTime);
                break;
            default:
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(500, this.audioContext.currentTime);
        }
    }
    
    async playClickSound(volume = 0.5) {
        if (!this.isEnabled || !this.isInitialized || !this.audioContext) {
            return;
        }
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(this.sfxVolume * volume * 0.5, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
            
        } catch (error) {
            console.warn('⚠️ Error playing click sound:', error);
        }
    }
    
    async playSuccessSound() {
        if (!this.isEnabled || !this.isInitialized || !this.audioContext) {
            return;
        }
        
        try {
            // Play a success chord
            const frequencies = [523.25, 659.25, 783.99]; // C-E-G chord
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    if (this.isEnabled) {
                        const oscillator = this.audioContext.createOscillator();
                        const gainNode = this.audioContext.createGain();
                        
                        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                        oscillator.type = 'sine';
                        
                        gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(this.audioContext.destination);
                        
                        oscillator.start();
                        oscillator.stop(this.audioContext.currentTime + 0.3);
                    }
                }, index * 50);
            });
            
        } catch (error) {
            console.warn('⚠️ Error playing success sound:', error);
        }
    }
    
    async playErrorSound() {
        if (!this.isEnabled || !this.isInitialized || !this.audioContext) {
            return;
        }
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.2);
            
        } catch (error) {
            console.warn('⚠️ Error playing error sound:', error);
        }
    }
    
    async playBackgroundMusic() {
        if (!this.isEnabled || !this.isInitialized || !this.audioContext || this.isMusicPlaying) {
            return;
        }
        
        try {
            this.isMusicPlaying = true;
            console.log('🎵 Starting background music');
            
            const playMelody = () => {
                if (!this.isEnabled || !this.isMusicPlaying) {
                    return;
                }
                
                let delay = 0;
                
                this.musicPattern.forEach(([frequency, duration]) => {
                    setTimeout(() => {
                        if (this.isEnabled && this.isMusicPlaying) {
                            this.playMusicNote(frequency, duration);
                        }
                    }, delay * 1000);
                    
                    delay += duration;
                });
                
                // Schedule next repetition
                setTimeout(() => {
                    if (this.isEnabled && this.isMusicPlaying) {
                        playMelody();
                    }
                }, delay * 1000 + 2000);
            };
            
            playMelody();
            
        } catch (error) {
            console.warn('⚠️ Error playing background music:', error);
            this.isMusicPlaying = false;
        }
    }
    
    playMusicNote(frequency, duration) {
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(this.musicVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
            
        } catch (error) {
            console.warn('⚠️ Error playing music note:', error);
        }
    }
    
    stopBackgroundMusic() {
        this.isMusicPlaying = false;
        console.log('🔇 Background music stopped');
    }
    
    toggleAudio() {
        this.isEnabled = !this.isEnabled;
        this.updateUI();
        
        if (this.isEnabled && !this.isInitialized) {
            this.initialize();
        }
        
        if (!this.isEnabled) {
            this.stopBackgroundMusic();
        } else if (window.SkyWorld && window.SkyWorld.gameStarted) {
            setTimeout(() => this.playBackgroundMusic(), 1000);
        }
        
        console.log(`Audio ${this.isEnabled ? 'enabled' : 'disabled'}`);
    }
    
    setVolume(type, volume) {
        volume = Math.max(0, Math.min(1, volume));
        
        switch (type) {
            case 'master':
                this.volume = volume;
                break;
            case 'sfx':
                this.sfxVolume = volume;
                break;
            case 'music':
                this.musicVolume = volume;
                break;
        }
        
        console.log(`🎛️ ${type} volume set to ${volume}`);
    }
    
    updateUI() {
        const soundToggle = document.getElementById('sound-toggle');
        const soundStatus = document.getElementById('sound-status');
        const effectsStatus = document.getElementById('effects-status');
        
        if (soundToggle) {
            soundToggle.textContent = this.isEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
            soundToggle.classList.toggle('off', !this.isEnabled);
        }
        
        if (soundStatus) {
            soundStatus.textContent = `Background: ${this.isEnabled ? 'Playing' : 'Muted'}`;
        }
        
        if (effectsStatus) {
            effectsStatus.textContent = `Effects: ${this.isEnabled ? 'Enabled' : 'Disabled'}`;
        }
    }
    
    getAudioInfo() {
        return {
            enabled: this.isEnabled,
            initialized: this.isInitialized,
            musicPlaying: this.isMusicPlaying,
            volume: this.volume,
            sfxVolume: this.sfxVolume,
            musicVolume: this.musicVolume,
            contextState: this.audioContext ? this.audioContext.state : 'unavailable'
        };
    }
    
    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('🔄 Audio context resumed');
            } catch (error) {
                console.warn('⚠️ Error resuming audio context:', error);
            }
        }
    }
}

// Make audio manager available globally
window.AudioManager = AudioManager;