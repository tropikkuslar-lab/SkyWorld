/**
 * SkyWorld v9.0 - Color Constants
 * Tüm renk paleti ve görsel sabitler
 */

// Main Color Palette
export const COLORS = {
    PRIMARY: {
        GREEN: 0x4CAF50,
        BLUE: 0x2196F3,
        RED: 0xF44336,
        YELLOW: 0xFFEB3B,
        PURPLE: 0x9C27B0,
        ORANGE: 0xFF9800
    },
    
    NEUTRAL: {
        WHITE: 0xFFFFFF,
        BLACK: 0x000000,
        GRAY_100: 0xF5F5F5,
        GRAY_200: 0xEEEEEE,
        GRAY_300: 0xE0E0E0,
        GRAY_400: 0xBDBDBD,
        GRAY_500: 0x9E9E9E,
        GRAY_600: 0x757575,
        GRAY_700: 0x616161,
        GRAY_800: 0x424242,
        GRAY_900: 0x212121
    },
    
    SEMANTIC: {
        SUCCESS: 0x4CAF50,
        WARNING: 0xFF9800,
        ERROR: 0xF44336,
        INFO: 0x2196F3
    }
};

// Block Colors
export const BLOCK_COLORS = {
    [BLOCK_TYPES.GRASS]: {
        primary: 0x228B22,
        secondary: 0x32CD32,
        dark: 0x1e5f1e,
        light: 0x6B8E23
    },
    
    [BLOCK_TYPES.STONE]: {
        primary: 0x696969,
        secondary: 0xA9A9A9,
        dark: 0x4f4f4f,
        light: 0xD3D3D3
    },
    
    [BLOCK_TYPES.WOOD]: {
        primary: 0x8B4513,
        secondary: 0xA0522D,
        dark: 0x654321,
        light: 0xCD853F
    },
    
    [BLOCK_TYPES.IRON]: {
        primary: 0xC0C0C0,
        secondary: 0xE6E6FA,
        dark: 0x808080,
        light: 0xF8F8FF
    },
    
    [BLOCK_TYPES.DIAMOND]: {
        primary: 0x00FFFF,
        secondary: 0x87CEEB,
        dark: 0x00BFFF,
        light: 0xAFEEEE
    },
    
    [BLOCK_TYPES.LAVA]: {
        primary: 0xFF4500,
        secondary: 0xFF6347,
        dark: 0xFF0000,
        light: 0xFFA500
    }
};

// UI Colors
export const UI_COLORS = {
    BACKGROUND: {
        PRIMARY: 'rgba(0, 0, 0, 0.8)',
        SECONDARY: 'rgba(0, 0, 0, 0.9)',
        OVERLAY: 'rgba(0, 0, 0, 0.7)',
        TRANSPARENT: 'rgba(0, 0, 0, 0.5)'
    },
    
    TEXT: {
        PRIMARY: '#FFFFFF',
        SECONDARY: '#CCCCCC',
        MUTED: '#999999',
        ACCENT: '#4CAF50'
    },
    
    BUTTONS: {
        PRIMARY: '#4CAF50',
        PRIMARY_HOVER: '#45a049',
        SECONDARY: '#2196F3',
        SECONDARY_HOVER: '#1976D2',
        DANGER: '#F44336',
        DANGER_HOVER: '#D32F2F'
    },
    
    BORDERS: {
        DEFAULT: '#333333',
        HOVER: '#4CAF50',
        ACTIVE: '#4CAF50',
        FOCUS: '#2196F3'
    }
};

// Environment Colors
export const ENVIRONMENT_COLORS = {
    SKY: {
        DAY: 0x87CEEB,
        NIGHT: 0x000011,
        DAWN: 0xFFA07A,
        DUSK: 0xFF6347
    },
    
    LIGHTING: {
        AMBIENT_DAY: 0x404040,
        AMBIENT_NIGHT: 0x111111,
        DIRECTIONAL: 0xFFFFFF,
        POINT: 0xFFFFAA
    },
    
    ATMOSPHERE: {
        CLEAR: 'rgba(135, 206, 235, 0.6)',
        CLOUDY: 'rgba(200, 200, 200, 0.8)',
        FOGGY: 'rgba(150, 150, 150, 0.9)'
    }
};

// Particle Colors
export const PARTICLE_COLORS = {
    PLACE: ['#4CAF50', '#8BC34A', '#CDDC39'],
    LAND: ['#FF9800', '#FFC107', '#FFEB3B'],
    DESTROY: ['#F44336', '#FF5722', '#FF1744'],
    MAGIC: ['#9C27B0', '#E91E63', '#673AB7'],
    
    BY_BLOCK: {
        [BLOCK_TYPES.GRASS]: ['#228B22', '#32CD32', '#6B8E23'],
        [BLOCK_TYPES.STONE]: ['#696969', '#A9A9A9', '#D3D3D3'],
        [BLOCK_TYPES.WOOD]: ['#8B4513', '#A0522D', '#CD853F'],
        [BLOCK_TYPES.IRON]: ['#C0C0C0', '#E6E6FA', '#F8F8FF'],
        [BLOCK_TYPES.DIAMOND]: ['#00FFFF', '#87CEEB', '#AFEEEE'],
        [BLOCK_TYPES.LAVA]: ['#FF4500', '#FF6347', '#FFA500']
    }
};

// Color Utilities
export const COLOR_UTILS = {
    // Convert hex to RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    // Convert RGB to hex
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // Lighten color
    lighten(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;
        
        const factor = 1 + (percent / 100);
        const r = Math.min(255, Math.round(rgb.r * factor));
        const g = Math.min(255, Math.round(rgb.g * factor));
        const b = Math.min(255, Math.round(rgb.b * factor));
        
        return this.rgbToHex(r, g, b);
    },
    
    // Darken color
    darken(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;
        
        const factor = 1 - (percent / 100);
        const r = Math.max(0, Math.round(rgb.r * factor));
        const g = Math.max(0, Math.round(rgb.g * factor));
        const b = Math.max(0, Math.round(rgb.b * factor));
        
        return this.rgbToHex(r, g, b);
    },
    
    // Get contrast color (black or white)
    getContrastColor(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return '#000000';
        
        // Calculate relative luminance
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    },
    
    // Create gradient
    createGradient(colors, stops = []) {
        const gradient = {
            type: 'linear',
            colors: colors.map((color, index) => ({
                color: color,
                stop: stops[index] || (index / (colors.length - 1))
            }))
        };
        return gradient;
    },
    
    // Blend two colors
    blend(color1, color2, factor) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return color1;
        
        const r = Math.round(rgb1.r * (1 - factor) + rgb2.r * factor);
        const g = Math.round(rgb1.g * (1 - factor) + rgb2.g * factor);
        const b = Math.round(rgb1.b * (1 - factor) + rgb2.b * factor);
        
        return this.rgbToHex(r, g, b);
    }
};

// Theme Configuration
export const THEMES = {
    DEFAULT: {
        name: 'Default',
        colors: {
            primary: COLORS.PRIMARY.GREEN,
            secondary: COLORS.PRIMARY.BLUE,
            background: UI_COLORS.BACKGROUND.PRIMARY,
            text: UI_COLORS.TEXT.PRIMARY
        }
    },
    
    DARK: {
        name: 'Dark',
        colors: {
            primary: COLORS.PRIMARY.PURPLE,
            secondary: COLORS.PRIMARY.BLUE,
            background: 'rgba(0, 0, 0, 0.95)',
            text: '#FFFFFF'
        }
    },
    
    HIGH_CONTRAST: {
        name: 'High Contrast',
        colors: {
            primary: '#FFFF00',
            secondary: '#00FFFF,
            background: '#000000',
            text: '#FFFFFF'
        }
    }
};

// Import BLOCK_TYPES from blocks.js
import { BLOCK_TYPES } from './blocks.js';

// Export for compatibility
export default {
    COLORS,
    BLOCK_COLORS,
    UI_COLORS,
    ENVIRONMENT_COLORS,
    PARTICLE_COLORS,
    COLOR_UTILS,
    THEMES
};