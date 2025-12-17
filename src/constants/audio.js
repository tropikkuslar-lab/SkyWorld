/**
 * SkyWorld v9.0 - Audio Constants
 * Tüm ses sistemi sabitleri
 */

// Audio Context Configuration
export const AUDIO_CONFIG = {
    SAMPLE_RATE: 44100,
    BIT_DEPTH: 16,
    CHANNELS: 2,
    LATENCY: 'interactive',
    SAMPLE_SIZE: 4096
};

// Volume Levels
export const VOLUME_LEVELS = {
    MASTER: 0.7,
    SFX: 0.3,
    MUSIC: 0.1,
    MIN: 0.0,
    MAX: 1.0,
    
    // Volume presets
    PRESETS: {
        MUTED: 0.0,
        QUIET: 0.2,
        NORMAL: 0.5,
        LOUD: 0.8,
        MAXIMUM: 1.0
    }
};

// Block Sound Frequencies
export const BLOCK_SOUND_FREQUENCIES = {
    [BLOCK_TYPES.GRASS]: [200, 220],
    [BLOCK_TYPES.STONE]: [150, 180],
    [BLOCK_TYPES.WOOD]: [250, 280],
    [BLOCK_TYPES.IRON]: [400, 450],
    [BLOCK_TYPES.DIAMOND]: [600, 700],
    [BLOCK_TYPES.LAVA]: [100, 120],
    
    // Fallback
    DEFAULT: [300, 350]
};

// Audio Filter Types
export const AUDIO_FILTERS = {
    [BLOCK_TYPES.GRASS]: {
        type: 'bandpass',
        frequency: 500,
        Q: 1
    },
    [BLOCK_TYPES.STONE]: {
        type: 'lowpass',
        frequency: 800,
        Q: 1
    },
    [BLOCK_TYPES.WOOD]: {
        type: 'bandpass',
        frequency: 400,
        Q: 1
    },
    [BLOCK_TYPES.IRON]: {
        type: 'highpass',
        frequency: 300,
        Q: 1
    },
    [BLOCK_TYPES.DIAMOND]: {
        type: 'highpass',
        frequency: 400,
        Q: 2
    },
    [BLOCK_TYPES.LAVA]: {
        type: 'lowpass',
        frequency: 200,
        Q: 5
    },
    DEFAULT: {
        type: 'bandpass',
        frequency: 500,
        Q: 1
    }
};

// Background Music Configuration
export const MUSIC_CONFIG = {
    BPM: 120,
    KEY: 'C Major',
    SCALE: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
    
    // Melody pattern (frequency, duration in seconds)
    PATTERN: [
        [261.63, 0.3], // C
        [293.66, 0.3], // D
        [329.63, 0.3], // E
        [349.23, 0.3], // F
        [392.00, 0.6], // G
        [440.00, 0.3], // A
        [493.88, 0.6], // B
        [523.25, 1.0]  // C
    ],
    
    REPEAT_DELAY: 2000, // 2 seconds between repeats
    FADE_DURATION: 0.5
};

// Sound Effects Configuration
export const SFX_CONFIG = {
    CLICK: {
        frequency: [800, 1200],
        duration: 0.1,
        type: 'sine',
        volume: 0.5
    },
    
    SUCCESS: {
        frequencies: [523.25, 659.25, 783.99], // C-E-G chord
        duration: 0.3,
        type: 'sine',
        volume: 0.3,
        delay: 0.05
    },
    
    ERROR: {
        frequency: [200, 100],
        duration: 0.2,
        type: 'sawtooth',
        volume: 0.4
    },
    
    PLACE: {
        duration: 0.15,
        type: 'square',
        volume: 0.6
    },
    
    LAND: {
        duration: 0.2,
        type: 'triangle',
        volume: 0.4
    }
};

// Audio Wave Types
export const WAVE_TYPES = {
    SINE: 'sine',
    SQUARE: 'square',
    SAWTOOTH: 'sawtooth',
    TRIANGLE: 'triangle'
};

// Audio Context States
export const AUDIO_STATES = {
    SUSPENDED: 'suspended',
    RUNNING: 'running',
    CLOSED: 'closed'
};

// Audio Events
export const AUDIO_EVENTS = {
    BLOCK_PLACED: 'audio:block:placed',
    BLOCK_REMOVED: 'audio:block:removed',
    MUSIC_STARTED: 'audio:music:started',
    MUSIC_STOPPED: 'audio:music:stopped',
    VOLUME_CHANGED: 'audio:volume:changed',
    AUDIO_TOGGLED: 'audio:toggled'
};

// Audio Performance Settings
export const AUDIO_PERFORMANCE = {
    MAX_CONCURRENT_SOUNDS: 16,
    REUSE_OSCILLATORS: true,
    CLEANUP_INTERVAL: 5000, // 5 seconds
    MAX_MEMORY_USAGE: 50 * 1024 * 1024 // 50MB
};

// Mobile Audio Settings
export const MOBILE_AUDIO = {
    REQUIRE_USER_GESTURE: true,
    AUTOPLAY_RESTRICTED: true,
    TOUCH_FEEDBACK_ENABLED: true,
    HAPTIC_FEEDBACK: false, // Future feature
    BATTERY_SAVER_MODE: false
};

// Audio Quality Settings
export const AUDIO_QUALITY = {
    SAMPLE_RATE: 44100,
    BIT_DEPTH: 16,
    CHANNELS: 1, // Mono for better performance
    COMPRESSION: false,
    REVERB: false,
    EQUALIZER: false
};

// Block Sound Properties
export const BLOCK_SOUND_PROPERTIES = {
    [BLOCK_TYPES.GRASS]: {
        waveform: WAVE_TYPES.SINE,
        envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.7,
            release: 0.05
        },
        pitch: 1.0,
        reverb: 0.1
    },
    
    [BLOCK_TYPES.STONE]: {
        waveform: WAVE_TYPES.SAWTOOTH,
        envelope: {
            attack: 0.005,
            decay: 0.05,
            sustain: 0.8,
            release: 0.1
        },
        pitch: 0.8,
        reverb: 0.05
    },
    
    [BLOCK_TYPES.WOOD]: {
        waveform: WAVE_TYPES.TRIANGLE,
        envelope: {
            attack: 0.02,
            decay: 0.08,
            sustain: 0.6,
            release: 0.08
        },
        pitch: 1.2,
        reverb: 0.15
    },
    
    [BLOCK_TYPES.IRON]: {
        waveform: WAVE_TYPES.SQUARE,
        envelope: {
            attack: 0.001,
            decay: 0.03,
            sustain: 0.9,
            release: 0.02
        },
        pitch: 1.5,
        reverb: 0.0
    },
    
    [BLOCK_TYPES.DIAMOND]: {
        waveform: WAVE_TYPES.SINE,
        envelope: {
            attack: 0.005,
            decay: 0.15,
            sustain: 0.8,
            release: 0.1
        },
        pitch: 2.0,
        reverb: 0.2
    },
    
    [BLOCK_TYPES.LAVA]: {
        waveform: WAVE_TYPES.SAWTOOTH,
        envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.7,
            release: 0.3
        },
        pitch: 0.6,
        reverb: 0.3
    }
};

// Audio Utility Functions
export const AUDIO_UTILS = {
    // Volume conversion
    dbToVolume(db) {
        return Math.pow(10, db / 20);
    },
    
    volumeToDb(volume) {
        return 20 * Math.log10(volume);
    },
    
    // Frequency utilities
    noteToFrequency(note) {
        const notes = {
            'C': 261.63,
            'C#': 277.18,
            'D': 293.66,
            'D#': 311.13,
            'E': 329.63,
            'F': 349.23,
            'F#': 369.99,
            'G': 392.00,
            'G#': 415.30,
            'A': 440.00,
            'A#': 466.16,
            'B': 493.88
        };
        return notes[note] || 440;
    },
    
    // Waveform utilities
    generateWave(type, frequency, duration, sampleRate) {
        const samples = duration * sampleRate;
        const wave = new Float32Array(samples);
        
        for (let i = 0; i < samples; i++) {
            const t = i / sampleRate;
            let value;
            
            switch (type) {
                case WAVE_TYPES.SINE:
                    value = Math.sin(2 * Math.PI * frequency * t);
                    break;
                case WAVE_TYPES.SQUARE:
                    value = Math.sin(2 * Math.PI * frequency * t) >= 0 ? 1 : -1;
                    break;
                case WAVE_TYPES.SAWTOOTH:
                    value = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
                    break;
                case WAVE_TYPES.TRIANGLE:
                    value = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
                    break;
                default:
                    value = Math.sin(2 * Math.PI * frequency * t);
            }
            
            wave[i] = value;
        }
        
        return wave;
    },
    
    // Envelope utilities
    applyEnvelope(wave, envelope) {
        const { attack, decay, sustain, release } = envelope;
        const length = wave.length;
        
        for (let i = 0; i < length; i++) {
            const t = i / length;
            let gain;
            
            if (t < attack) {
                gain = t / attack;
            } else if (t < attack + decay) {
                gain = 1 - (t - attack) / decay * (1 - sustain);
            } else if (t < 1 - release) {
                gain = sustain;
            } else {
                gain = sustain * (1 - (t - (1 - release)) / release);
            }
            
            wave[i] *= Math.max(0, gain);
        }
        
        return wave;
    }
};

// Import BLOCK_TYPES from blocks.js
import { BLOCK_TYPES } from './blocks.js';

// Export for compatibility
export default {
    AUDIO_CONFIG,
    VOLUME_LEVELS,
    BLOCK_SOUND_FREQUENCIES,
    AUDIO_FILTERS,
    MUSIC_CONFIG,
    SFX_CONFIG,
    WAVE_TYPES,
    AUDIO_STATES,
    AUDIO_EVENTS,
    AUDIO_PERFORMANCE,
    MOBILE_AUDIO,
    AUDIO_QUALITY,
    BLOCK_SOUND_PROPERTIES,
    AUDIO_UTILS
};