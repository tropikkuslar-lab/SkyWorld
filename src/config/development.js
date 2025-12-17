/**
 * SkyWorld v2.0 - Development Configuration
 * @author MiniMax Agent
 * 
 * Bu dosya geliştirme ortamı için konfigürasyon ayarlarını içerir.
 * Üretim ortamı için farklı değerler kullanılabilir.
 */

export const DEVELOPMENT_CONFIG = {
    // Debug ayarları
    debug: {
        enabled: true,
        showFPS: true,
        showCoords: true,
        showMemoryUsage: true,
        wireframeMode: false,
        collisionDebug: false,
        chunkDebug: false
    },

    // Geliştirici araçları
    devTools: {
        enabled: true,
        hotReload: true,
        sourceMap: true,
        consoleLogging: true,
        performanceMonitoring: true
    },

    // Grafik ayarları (geliştirme)
    graphics: {
        quality: 'medium',
        shadows: false, // Performans için geliştirmede kapalı
        antialiasing: false,
        maxRenderDistance: 4, // Daha düşük mesafe
        frustumCulling: true,
        occlusionCulling: false
    },

    // Ses ayarları (geliştirme)
    audio: {
        enabled: true,
        masterVolume: 0.3, // Daha düşük ses
        musicVolume: 0.1,
        sfxVolume: 0.5,
        preloadSounds: false,
        debugAudio: true
    },

    // Performans ayarları
    performance: {
        targetFPS: 30, // Düşük FPS hedefi
        frameSkip: true,
        adaptiveQuality: false,
        lodLevels: 2, // Daha az LOD seviyesi
        maxChunks: 16, // Daha az chunk
        garbageCollection: true
    },

    // Kontrol ayarları
    controls: {
        mouseSensitivity: 5,
        invertY: false,
        touchSensitivity: 3,
        keyboardRepeat: true
    },

    // Test ayarları
    testing: {
        enabled: false, // Test modu kapalı
        autoTest: false,
        mockWebGL: false,
        headlessMode: false
    },

    // Network ayarları (gelecek için)
    network: {
        enabled: false,
        multiplayer: false,
        serverUrl: '',
        autoConnect: false
    },

    // Log ayarları
    logging: {
        level: 'debug', // debug, info, warn, error
        console: true,
        file: false,
        maxFileSize: '10MB',
        maxFiles: 5
    },

    // Cache ayarları
    cache: {
        enabled: true,
        maxSize: '50MB',
        ttl: 3600000, // 1 saat
        autoCleanup: true
    },

    // API ayarları
    api: {
        baseUrl: 'http://localhost:3000',
        timeout: 5000,
        retries: 3,
        rateLimit: {
            requests: 100,
            window: 60000 // 1 dakika
        }
    }
};

export const PRODUCTION_CONFIG = {
    // Debug ayarları (üretim)
    debug: {
        enabled: false,
        showFPS: false,
        showCoords: false,
        showMemoryUsage: false,
        wireframeMode: false,
        collisionDebug: false,
        chunkDebug: false
    },

    // Geliştirici araçları (üretim)
    devTools: {
        enabled: false,
        hotReload: false,
        sourceMap: false,
        consoleLogging: false,
        performanceMonitoring: false
    },

    // Grafik ayarları (üretim)
    graphics: {
        quality: 'high',
        shadows: true,
        antialiasing: true,
        maxRenderDistance: 8,
        frustumCulling: true,
        occlusionCulling: true
    },

    // Ses ayarları (üretim)
    audio: {
        enabled: true,
        masterVolume: 0.5,
        musicVolume: 0.3,
        sfxVolume: 0.7,
        preloadSounds: true,
        debugAudio: false
    },

    // Performans ayarları (üretim)
    performance: {
        targetFPS: 60,
        frameSkip: false,
        adaptiveQuality: true,
        lodLevels: 3,
        maxChunks: 64,
        garbageCollection: true
    },

    // Log ayarları (üretim)
    logging: {
        level: 'error',
        console: false,
        file: true,
        maxFileSize: '50MB',
        maxFiles: 10
    },

    // API ayarları (üretim)
    api: {
        baseUrl: 'https://api.skyworld.game',
        timeout: 10000,
        retries: 3,
        rateLimit: {
            requests: 1000,
            window: 60000
        }
    }
};

// Environment detection
export function getConfig() {
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1';
    
    return isDevelopment ? DEVELOPMENT_CONFIG : PRODUCTION_CONFIG;
}

// Configuration utilities
export class ConfigManager {
    constructor() {
        this.config = getConfig();
        this.listeners = new Map();
    }

    get(path) {
        return this.getNestedValue(this.config, path);
    }

    set(path, value) {
        this.setNestedValue(this.config, path, value);
        this.notifyListeners(path, value);
    }

    update(updates) {
        Object.assign(this.config, updates);
        Object.keys(updates).forEach(key => {
            this.notifyListeners(key, updates[key]);
        });
    }

    onChange(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, new Set());
        }
        this.listeners.get(path).add(callback);

        return () => {
            const callbacks = this.listeners.get(path);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }

    notifyListeners(path, value) {
        const callbacks = this.listeners.get(path);
        if (callbacks) {
            callbacks.forEach(callback => callback(value));
        }
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key]) {
                current[key] = {};
            }
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    export() {
        return JSON.parse(JSON.stringify(this.config));
    }

    import(config) {
        this.config = { ...this.config, ...config };
        return this;
    }

    reset() {
        this.config = getConfig();
        this.listeners.clear();
    }
}

// Global config instance
export const config = new ConfigManager();

// Export for global access
if (typeof window !== 'undefined') {
    window.SkyWorldConfig = config;
}

// Development helpers
if (DEVELOPMENT_CONFIG.debug.enabled) {
    console.log('🎮 SkyWorld Development Mode Enabled');
    console.log('📊 Debug Config:', config.export());
    
    // Add development shortcuts
    window.debugSkyWorld = {
        config: config,
        get: (path) => config.get(path),
        set: (path, value) => config.set(path, value),
        reset: () => config.reset(),
        export: () => config.export()
    };
}