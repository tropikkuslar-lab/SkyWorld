/**
 * SkyWorld v9.0 - Block Constants
 * Tüm blok tipleri ve özellikleri
 */

// Block Types Enumeration
export const BLOCK_TYPES = {
    GRASS: 'grass',
    STONE: 'stone',
    WOOD: 'wood',
    IRON: 'iron',
    DIAMOND: 'diamond',
    LAVA: 'lava'
};

// Block Properties
export const BLOCK_PROPERTIES = {
    [BLOCK_TYPES.GRASS]: {
        name: 'Grass',
        displayName: 'Çimen',
        color: 0x228B22,
        gradient: [
            { color: 0x228B22, stop: 0 },
            { color: 0x32CD32, stop: 0.5 },
            { color: 0x228B22, stop: 1 }
        ],
        density: 0.8,
        hardness: 1,
        breakable: true,
        sound: 'grass',
        frequency: [200, 220],
        texture: 'grass',
        stackSize: 64,
        emissive: false,
        transparent: false,
        description: 'Temel blok tipi, doğada bol bulunur'
    },
    
    [BLOCK_TYPES.STONE]: {
        name: 'Stone',
        displayName: 'Taş',
        color: 0x696969,
        gradient: [
            { color: 0x696969, stop: 0 },
            { color: 0xA9A9A9, stop: 0.5 },
            { color: 0x696969, stop: 1 }
        ],
        density: 2.5,
        hardness: 3,
        breakable: true,
        sound: 'stone',
        frequency: [150, 180],
        texture: 'stone',
        stackSize: 64,
        emissive: false,
        transparent: false,
        description: 'Orta sertlikte, dağlarda bulunur'
    },
    
    [BLOCK_TYPES.WOOD]: {
        name: 'Wood',
        displayName: 'Ahşap',
        color: 0x8B4513,
        gradient: [
            { color: 0x8B4513, stop: 0 },
            { color: 0xA0522D, stop: 0.5 },
            { color: 0x8B4513, stop: 1 }
        ],
        density: 0.6,
        hardness: 2,
        breakable: true,
        sound: 'wood',
        frequency: [250, 280],
        texture: 'wood',
        stackSize: 64,
        emissive: false,
        transparent: false,
        description: 'Ağaçlardan elde edilen malzeme'
    },
    
    [BLOCK_TYPES.IRON]: {
        name: 'Iron',
        displayName: 'Demir',
        color: 0xC0C0C0,
        gradient: [
            { color: 0xC0C0C0, stop: 0 },
            { color: 0xE6E6FA, stop: 0.5 },
            { color: 0xC0C0C0, stop: 1 }
        ],
        density: 7.8,
        hardness: 5,
        breakable: false,
        sound: 'metal',
        frequency: [400, 450],
        texture: 'metal',
        stackSize: 64,
        emissive: false,
        transparent: false,
        description: 'Sert metal, kırılamaz'
    },
    
    [BLOCK_TYPES.DIAMOND]: {
        name: 'Diamond',
        displayName: 'Elmas',
        color: 0x00FFFF,
        gradient: [
            { color: 0x00FFFF, stop: 0 },
            { color: 0x87CEEB, stop: 0.5 },
            { color: 0x00FFFF, stop: 1 }
        ],
        density: 3.5,
        hardness: 5,
        breakable: false,
        sound: 'crystal',
        frequency: [600, 700],
        texture: 'crystal',
        stackSize: 64,
        emissive: false,
        transparent: false,
        description: 'En sert malzeme, nadide bulunur'
    },
    
    [BLOCK_TYPES.LAVA]: {
        name: 'Lava',
        displayName: 'Lava',
        color: 0xFF4500,
        gradient: [
            { color: 0xFF4500, stop: 0 },
            { color: 0xFF6347, stop: 0.5 },
            { color: 0xFF4500, stop: 1 }
        ],
        density: 2.8,
        hardness: 1,
        breakable: true,
        sound: 'liquid',
        frequency: [100, 120],
        texture: 'lava',
        stackSize: 64,
        emissive: true,
        transparent: false,
        description: 'Yanıcı, özel efektli blok'
    }
};

// Block Categories
export const BLOCK_CATEGORIES = {
    NATURAL: [BLOCK_TYPES.GRASS, BLOCK_TYPES.STONE],
    CONSTRUCTED: [BLOCK_TYPES.WOOD, BLOCK_TYPES.IRON, BLOCK_TYPES.DIAMOND],
    SPECIAL: [BLOCK_TYPES.LAVA],
    BREAKABLE: [BLOCK_TYPES.GRASS, BLOCK_TYPES.STONE, BLOCK_TYPES.WOOD, BLOCK_TYPES.LAVA],
    UNBREAKABLE: [BLOCK_TYPES.IRON, BLOCK_TYPES.DIAMOND]
};

// Block Relationships
export const BLOCK_RELATIONSHIPS = {
    // Hangi bloklar hangilerinden yapılabilir
    CRAFTING: {
        [BLOCK_TYPES.WOOD]: [BLOCK_TYPES.GRASS], // Grass'tan wood yapılabilir (örnek)
    },
    
    // Hangi bloklar hangilerini destekler
    SUPPORT: {
        [BLOCK_TYPES.STONE]: [BLOCK_TYPES.GRASS, BLOCK_TYPES.STONE, BLOCK_TYPES.WOOD],
        [BLOCK_TYPES.IRON]: [BLOCK_TYPES.GRASS, BLOCK_TYPES.STONE, BLOCK_TYPES.WOOD, BLOCK_TYPES.IRON],
        [BLOCK_TYPES.DIAMOND]: [BLOCK_TYPES.GRASS, BLOCK_TYPES.STONE, BLOCK_TYPES.WOOD, BLOCK_TYPES.IRON, BLOCK_TYPES.DIAMOND]
    }
};

// Block Physics Properties
export const BLOCK_PHYSICS = {
    // Her blok tipi için fizik parametreleri
    BOUNCE_FACTOR: {
        [BLOCK_TYPES.GRASS]: 0.2,
        [BLOCK_TYPES.STONE]: 0.1,
        [BLOCK_TYPES.WOOD]: 0.3,
        [BLOCK_TYPES.IRON]: 0.05,
        [BLOCK_TYPES.DIAMOND]: 0.05,
        [BLOCK_TYPES.LAVA]: 0.4
    },
    
    // Yerleştirme sırasında hangi bloklara yerleştirilemez
    PLACE_RESTRICTIONS: {
        [BLOCK_TYPES.LAVA]: [BLOCK_TYPES.GRASS] // Lava grass'a yerleştirilemez (örnek)
    }
};

// Block Interaction Properties
export const BLOCK_INTERACTIONS = {
    // Hangi bloklar birbirleriyle etkileşime girer
    COMBINE: {
        // Placeholder for future crafting system
    },
    
    // Hangi bloklar birbirlerini etkiler
    AFFECTS: {
        [BLOCK_TYPES.LAVA]: [BLOCK_TYPES.GRASS] // Lava grass'ı etkiler (yakar)
    }
};

// Block Spawning Properties
export const BLOCK_SPAWNING = {
    // Doğal olarak hangi adalarda hangi bloklar bulunur
    ISLAND_DISTRIBUTION: {
        'Forest Island': {
            [BLOCK_TYPES.GRASS]: 0.6,
            [BLOCK_TYPES.STONE]: 0.2,
            [BLOCK_TYPES.WOOD]: 0.2
        },
        'Mountain Island': {
            [BLOCK_TYPES.STONE]: 0.7,
            [BLOCK_TYPES.GRASS]: 0.3
        },
        'Desert Island': {
            [BLOCK_TYPES.STONE]: 0.8,
            [BLOCK_TYPES.GRASS]: 0.2
        },
        'Ocean Island': {
            [BLOCK_TYPES.GRASS]: 0.5,
            [BLOCK_TYPES.STONE]: 0.3,
            [BLOCK_TYPES.DIAMOND]: 0.1,
            [BLOCK_TYPES.IRON]: 0.1
        }
    },
    
    // Blok spawn oranları
    SPAWN_RATES: {
        [BLOCK_TYPES.GRASS]: 0.4,
        [BLOCK_TYPES.STONE]: 0.3,
        [BLOCK_TYPES.WOOD]: 0.2,
        [BLOCK_TYPES.IRON]: 0.05,
        [BLOCK_TYPES.DIAMOND]: 0.02,
        [BLOCK_TYPES.LAVA]: 0.03
    }
};

// Block Rendering Properties
export const BLOCK_RENDERING = {
    // Particle types for each block
    PARTICLES: {
        [BLOCK_TYPES.GRASS]: 'plant',
        [BLOCK_TYPES.STONE]: 'rock',
        [BLOCK_TYPES.WOOD]: 'wood',
        [BLOCK_TYPES.IRON]: 'metal',
        [BLOCK_TYPES.DIAMOND]: 'crystal',
        [BLOCK_TYPES.LAVA]: 'fire'
    },
    
    // Glow effects
    GLOW_EFFECTS: {
        [BLOCK_TYPES.LAVA]: {
            intensity: 0.3,
            color: 0xFF4500,
            pulse: true
        },
        [BLOCK_TYPES.DIAMOND]: {
            intensity: 0.1,
            color: 0x00FFFF,
            pulse: false
        }
    },
    
    // Shadow casting
    SHADOW_CASTING: {
        [BLOCK_TYPES.GRASS]: false,
        [BLOCK_TYPES.STONE]: true,
        [BLOCK_TYPES.WOOD]: true,
        [BLOCK_TYPES.IRON]: true,
        [BLOCK_TYPES.DIAMOND]: true,
        [BLOCK_TYPES.LAVA]: false
    }
};

// Block Utility Functions
export const BLOCK_UTILS = {
    // Blok tipinin geçerli olup olmadığını kontrol et
    isValidBlockType(type) {
        return Object.values(BLOCK_TYPES).includes(type);
    },
    
    // Blok tipinin kırılabilir olup olmadığını kontrol et
    isBreakable(blockType) {
        return BLOCK_PROPERTIES[blockType]?.breakable || false;
    },
    
    // Blok tipinin ses frekansını al
    getSoundFrequency(blockType) {
        return BLOCK_PROPERTIES[blockType]?.frequency || [300, 350];
    },
    
    // Blok tipinin rengini al
    getBlockColor(blockType) {
        return BLOCK_PROPERTIES[blockType]?.color || 0x666666;
    },
    
    // Blok tipinin display name'ini al
    getDisplayName(blockType) {
        return BLOCK_PROPERTIES[blockType]?.displayName || blockType;
    },
    
    // Kategoriye göre blok tiplerini al
    getBlocksByCategory(category) {
        return BLOCK_CATEGORIES[category] || [];
    },
    
    // Tüm blok tiplerini al
    getAllBlockTypes() {
        return Object.values(BLOCK_TYPES);
    },
    
    // Kırılabilir blokları al
    getBreakableBlocks() {
        return BLOCK_CATEGORIES.BREAKABLE;
    },
    
    // Kırılamaz blokları al
    getUnbreakableBlocks() {
        return BLOCK_CATEGORIES.UNBREAKABLE;
    }
};

// Export for compatibility
export default {
    BLOCK_TYPES,
    BLOCK_PROPERTIES,
    BLOCK_CATEGORIES,
    BLOCK_RELATIONSHIPS,
    BLOCK_PHYSICS,
    BLOCK_INTERACTIONS,
    BLOCK_SPAWNING,
    BLOCK_RENDERING,
    BLOCK_UTILS
};