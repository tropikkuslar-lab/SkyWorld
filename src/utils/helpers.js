/**
 * SkyWorld v2.0 - Utility Functions
 * @author MiniMax Agent
 * 
 * Oyun genelinde kullanılan yardımcı fonksiyonlar.
 */

// Math utilities
export class MathUtils {
    /**
     * Lineer interpolasyon
     */
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    /**
     * Bezier eğrisi interpolasyonu
     */
    static bezier(t, p0, p1, p2, p3) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;

        return {
            x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
            y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
            z: uuu * p0.z + 3 * uu * t * p1.z + 3 * u * tt * p2.z + ttt * p3.z
        };
    }

    /**
     * Mesafe hesaplama
     */
    static distance(x1, y1, z1, x2, y2, z2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Açı radyana çevir
     */
    static degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    /**
     * Radyan açıya çevir
     */
    static radToDeg(rad) {
        return rad * (180 / Math.PI);
    }

    /**
     * Değeri belirli aralıkta tut
     */
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Rastgele değer üret
     */
    static random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Normal dağılım rastgele değer
     */
    static randomNormal(mean = 0, stdDev = 1) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return num * stdDev + mean;
    }
}

// Array utilities
export class ArrayUtils {
    /**
     * Diziyi karıştır
     */
    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Benzersiz değerleri al
     */
    static unique(array) {
        return [...new Set(array)];
    }

    /**
     * Diziyi gruplara böl
     */
    static chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    /**
     * Dizideki maksimum değeri bul
     */
    static max(array, key = null) {
        if (key) {
            return array.reduce((max, item) => 
                item[key] > max[key] ? item : max
            );
        }
        return Math.max(...array);
    }

    /**
     * Dizideki minimum değeri bul
     */
    static min(array, key = null) {
        if (key) {
            return array.reduce((min, item) => 
                item[key] < min[key] ? item : min
            );
        }
        return Math.min(...array);
    }
}

// String utilities
export class StringUtils {
    /**
     * İlk harfi büyük yap
     */
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    /**
     * PascalCase'e çevir
     */
    static toPascalCase(str) {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/\s+/g, '');
    }

    /**
     * camelCase'e çevir
     */
    static toCamelCase(str) {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/\s+/g, '');
    }

    /**
     * Metni kısalt
     */
    static truncate(str, maxLength, suffix = '...') {
        if (str.length <= maxLength) return str;
        return str.slice(0, maxLength - suffix.length) + suffix;
    }

    /**
     * Hash oluştur
     */
    static hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit integer'a çevir
        }
        return hash;
    }
}

// Color utilities
export class ColorUtils {
    /**
     * RGB'yi HEX'e çevir
     */
    static rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * HEX'i RGB'ye çevir
     */
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Rengi karıştır
     */
    static mix(color1, color2, factor = 0.5) {
        const rgb1 = typeof color1 === 'string' ? this.hexToRgb(color1) : color1;
        const rgb2 = typeof color2 === 'string' ? this.hexToRgb(color2) : color2;
        
        return {
            r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor),
            g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor),
            b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor)
        };
    }

    /**
     * Rengi aç/koyu yap
     */
    static lighten(color, factor = 0.2) {
        const rgb = typeof color === 'string' ? this.hexToRgb(color) : color;
        return {
            r: Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor)),
            g: Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor)),
            b: Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor))
        };
    }

    /**
     * Rengi koyulaştır
     */
    static darken(color, factor = 0.2) {
        const rgb = typeof color === 'string' ? this.hexToRgb(color) : color;
        return {
            r: Math.round(rgb.r * (1 - factor)),
            g: Math.round(rgb.g * (1 - factor)),
            b: Math.round(rgb.b * (1 - factor))
        };
    }
}

// Performance utilities
export class PerformanceUtils {
    /**
     * FPS ölç
     */
    static measureFPS(callback) {
        let lastTime = performance.now();
        let frames = 0;
        let fps = 0;

        function update() {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                callback(fps);
            }
            
            requestAnimationFrame(update);
        }
        
        update();
    }

    /**
     * Bellek kullanımını ölç
     */
    static measureMemory() {
        if ('memory' in performance) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return null;
    }

    /**
     * Fonksiyon süresini ölç
     */
    static measureTime(fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        return {
            result,
            time: end - start
        };
    }
}

// File utilities
export class FileUtils {
    /**
     * Dosya boyutunu formatla
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Dosya uzantısını al
     */
    static getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    /**
     * Dosya adından adını al
     */
    static getFileName(filename) {
        return filename.substring(0, filename.lastIndexOf('.')) || filename;
    }
}

// Local storage utilities
export class StorageUtils {
    /**
     * Local storage'a kaydet
     */
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('LocalStorage kaydetme hatası:', error);
            return false;
        }
    }

    /**
     * Local storage'dan al
     */
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('LocalStorage okuma hatası:', error);
            return defaultValue;
        }
    }

    /**
     * Local storage'dan sil
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('LocalStorage silme hatası:', error);
            return false;
        }
    }

    /**
     * Tüm local storage'ı temizle
     */
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('LocalStorage temizleme hatası:', error);
            return false;
        }
    }
}

// Event utilities
export class EventUtils {
    /**
     * Event listener ekle (memory leak önleme ile)
     */
    static addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        
        return () => {
            element.removeEventListener(event, handler, options);
        };
    }

    /**
     * Debounce fonksiyonu
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle fonksiyonu
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Random utilities
export class RandomUtils {
    /**
     * Seed-based random sayı üretici
     */
    static createSeeded(seed) {
        let value = seed;
        return function() {
            value = (value * 9301 + 49297) % 233280;
            return value / 233280;
        };
    }

    /**
     * İsim üretici
     */
    static generateName() {
        const prefixes = ['Sky', 'Cloud', 'Void', 'Star', 'Moon', 'Sun'];
        const suffixes = ['World', 'Realm', 'Land', 'Domain', 'Zone', 'Field'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        return `${prefix}${suffix}`;
    }

    /**
     * Renk üretici
     */
    static generateColor() {
        return {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        };
    }
}

// Debug utilities
export class DebugUtils {
    /**
     * Obje bilgilerini göster
     */
    static inspect(obj, depth = 2) {
        console.dir(obj, { depth, colors: true });
    }

    /**
     * Memory snapshot al
     */
    static snapshot() {
        return {
            timestamp: Date.now(),
            memory: PerformanceUtils.measureMemory(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    }

    /**
     * Performance profili başlat
     */
    static profile(name) {
        console.profile(name);
        return () => console.profileEnd(name);
    }
}

// Export all utilities
export {
    MathUtils as Math,
    ArrayUtils as Array,
    StringUtils as String,
    ColorUtils as Color,
    PerformanceUtils as Performance,
    FileUtils as File,
    StorageUtils as Storage,
    EventUtils as Event,
    RandomUtils as Random,
    DebugUtils as Debug
};

// Global utility access
if (typeof window !== 'undefined') {
    window.SkyWorldUtils = {
        Math: MathUtils,
        Array: ArrayUtils,
        String: StringUtils,
        Color: ColorUtils,
        Performance: PerformanceUtils,
        File: FileUtils,
        Storage: StorageUtils,
        Event: EventUtils,
        Random: RandomUtils,
        Debug: DebugUtils
    };
}