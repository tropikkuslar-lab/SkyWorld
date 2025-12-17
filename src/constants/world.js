/**
 * SkyWorld - Dünya Sabitleri
 * @author MiniMax Agent
 * @version 2.0
 */

export const WORLD_CONSTANTS = {
    // Dünya boyutları
    CHUNK_SIZE: 16,
    WORLD_HEIGHT: 256,
    MAX_WORLD_SIZE: 1000,
    
    // Chunk yönetimi
    VIEW_DISTANCE: 8,
    UNLOAD_DISTANCE: 12,
    CHUNK_CACHE_SIZE: 32,
    
    // Yükseklik ayarları
    SEA_LEVEL: 32,
    MAX_HEIGHT_VARIATION: 20,
    BASE_HEIGHT: 40,
    
    // Biom ayarları
    BIOME_SIZE: 128,
    TRANSITION_SIZE: 16,
    
    // Performans ayarları
    TARGET_FPS: 60,
    MAX_UPDATES_PER_FRAME: 5,
    CULLING_ENABLED: true,
    LOD_LEVELS: 3
};

export const RENDERING_CONSTANTS = {
    // Grafik ayarları
    SHADOW_MAP_SIZE: 2048,
    MAX_SHADOW_DISTANCE: 100,
    AMBIENT_OCCLUSION: true,
    
    // Kamera ayarları
    FOV: 75,
    NEAR_PLANE: 0.1,
    FAR_PLANE: 2000,
    
    // Material ayarları
    USE_INSTANCING: true,
    MAX_INSTANCES: 1000,
    
    // Post-processing
    ENABLE_BLOOM: false,
    ENABLE_DOF: false,
    ENABLE_SSAO: false
};

export const TERRAIN_CONSTANTS = {
    // Yükseklik üretimi
    NOISE_SCALE: 0.01,
    NOISE_OCTAVES: 4,
    NOISE_PERSISTENCE: 0.5,
    NOISE_LACUNARITY: 2.0,
    
    // Erozyon
    EROSION_STRENGTH: 0.1,
    EROSION_RADIUS: 5,
    
    // Çakıl/çakıl taşları
    STONE_LAYER_THICKNESS: 3,
    DIRT_LAYER_THICKNESS: 3,
    GRASS_LAYER_THICKNESS: 1,
    
    // Mağara sistemi
    CAVE_PROBABILITY: 0.02,
    CAVE_RADIUS: 3,
    CAVE_CONNECTION: 0.8,
    
    // Ağaç sistemi
    TREE_PROBABILITY: 0.005,
    TREE_MIN_HEIGHT: 4,
    TREE_MAX_HEIGHT: 8,
    TREE_SPREAD_RADIUS: 8
};

export const LIQUID_CONSTANTS = {
    // Su sistemi
    WATER_LEVEL: 32,
    WATER_FLOW_SPEED: 0.5,
    WATER_VISIBILITY: 0.8,
    
    // Lava sistemi
    LAVA_LEVEL: 10,
    LAVA_FLOW_SPEED: 0.3,
    LAVA_DAMAGE: 1.0
};

export const LIGHTING_CONSTANTS = {
    // Işık sistemi
    MAX_LIGHT_LEVELS: 15,
    LIGHT_DECAY_DISTANCE: 15,
    SUN_LIGHT_INTENSITY: 1.0,
    AMBIENT_LIGHT_INTENSITY: 0.4,
    
    // Gece/gündüz
    DAY_LENGTH: 240, // saniye
    TWILIGHT_DURATION: 30,
    
    // Yapay ışıklar
    TORCH_LIGHT_LEVEL: 14,
    TORCH_DISTANCE: 14,
    FURNACE_LIGHT_LEVEL: 13,
    FURNACE_DISTANCE: 13
};

export const PHYSICS_CONSTANTS = {
    // Yerçekimi
    GRAVITY: -9.81,
    TERMINAL_VELOCITY: -50,
    
    // Hareket
    WALK_SPEED: 4.3,
    RUN_SPEED: 5.6,
    JUMP_VELOCITY: 8,
    
    // Çarpışma
    PLAYER_WIDTH: 0.6,
    PLAYER_HEIGHT: 1.8,
    PLAYER_EYE_HEIGHT: 1.62,
    
    // Sürtünme
    GROUND_FRICTION: 0.8,
    AIR_FRICTION: 0.1
};

export const WORLD_GENERATION = {
    // Dünya üretimi
    SEED_LENGTH: 32,
    CHUNK_GENERATION_QUEUE: 4,
    GENERATION_TIMEOUT: 5000,
    
    // Chunk işleme
    FACES_PER_FRAME: 1000,
    VERTICES_PER_FRAME: 50000,
    
    // Bellek yönetimi
    MAX_CHUNKS_IN_MEMORY: 64,
    CHUNK_UNLOAD_DELAY: 30000, // 30 saniye
    
    // Optimizasyon
    USE_WORKER_THREADS: true,
    LAZY_GENERATION: true,
    STREAMING_ENABLED: true
};

export const WORLD_EVENTS = {
    // Oyun olayları
    DAY_NIGHT_CYCLE: 'day-night-cycle',
    WEATHER_CHANGE: 'weather-change',
    SEASON_CHANGE: 'season-change',
    
    // Dünya olayları
    CHUNK_LOADED: 'chunk-loaded',
    CHUNK_UNLOADED: 'chunk-unloaded',
    BLOCK_PLACED: 'block-placed',
    BLOCK_BROKEN: 'block-broken',
    
    // Oyuncu olayları
    PLAYER_MOVE: 'player-move',
    PLAYER_JUMP: 'player-jump',
    PLAYER_DEATH: 'player-death',
    
    // Sistem olayları
    WORLD_SAVED: 'world-saved',
    WORLD_LOADED: 'world-loaded',
    WORLD_ERROR: 'world-error'
};

export const WORLD_UTILS = {
    // Koordinat dönüşümleri
    worldToChunkCoords(x, y, z) {
        return {
            cx: Math.floor(x / WORLD_CONSTANTS.CHUNK_SIZE),
            cy: Math.floor(y / WORLD_CONSTANTS.WORLD_HEIGHT),
            cz: Math.floor(z / WORLD_CONSTANTS.CHUNK_SIZE)
        };
    },
    
    worldToLocalCoords(x, y, z) {
        const chunkSize = WORLD_CONSTANTS.CHUNK_SIZE;
        return {
            lx: ((x % chunkSize) + chunkSize) % chunkSize,
            ly: y,
            lz: ((z % chunkSize) + chunkSize) % chunkSize
        };
    },
    
    isValidChunkCoords(cx, cy, cz) {
        const maxSize = WORLD_CONSTANTS.MAX_WORLD_SIZE;
        return Math.abs(cx) < maxSize && 
               Math.abs(cy) < maxSize && 
               Math.abs(cz) < maxSize;
    },
    
    isValidBlockCoords(x, y, z) {
        return y >= 0 && y < WORLD_CONSTANTS.WORLD_HEIGHT;
    },
    
    getChunkDistance(cx1, cz1, cx2, cz2) {
        const dx = cx1 - cx2;
        const dz = cz1 - cz2;
        return Math.sqrt(dx * dx + dz * dz);
    },
    
    shouldChunkBeLoaded(playerChunkX, playerChunkZ, chunkX, chunkZ) {
        const distance = this.getChunkDistance(playerChunkX, playerChunkZ, chunkX, chunkZ);
        return distance <= WORLD_CONSTANTS.VIEW_DISTANCE;
    },
    
    shouldChunkBeUnloaded(playerChunkX, playerChunkZ, chunkX, chunkZ) {
        const distance = this.getChunkDistance(playerChunkX, playerChunkZ, chunkX, chunkZ);
        return distance > WORLD_CONSTANTS.UNLOAD_DISTANCE;
    }
};