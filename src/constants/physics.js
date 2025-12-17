/**
 * SkyWorld v9.0 - Physics Constants
 * Tüm fizik sistemi sabitleri
 */

// Core Physics Constants
export const PHYSICS_CONFIG = {
    GRAVITY: 0.5,
    FRICTION: 0.98,
    BOUNCE: 0.3,
    MAX_FALL_SPEED: 15.0,
    AIR_RESISTANCE: 0.995,
    GROUND_FRICTION: 0.9
};

// Physics Engine Settings
export const PHYSICS_ENGINE = {
    UPDATE_RATE: 60, // Hz
    MAX_SUBSTEPS: 3,
    FIXED_TIMESTEP: 1 / 60,
    MAX_TIMESTEP: 1 / 30,
    ITERATIONS: 10
};

// Collision Detection
export const COLLISION = {
    CHECK_RADIUS: 0.6,
    GROUND_CHECK_RADIUS: 0.6,
    BLOCK_SIZE: 1.0,
    PRECISION: 0.01,
    
    // Collision types
    TYPES: {
        BLOCK_BLOCK: 'block-block',
        BLOCK_GROUND: 'block-ground',
        BLOCK_WORLD: 'block-world',
        BLOCK_VOID: 'block-void'
    },
    
    // Collision response
    RESPONSE: {
        BOUNCE: 'bounce',
        STOP: 'stop',
        SLIDE: 'slide',
        IGNORE: 'ignore'
    }
};

// Block Physics Properties
export const BLOCK_PHYSICS = {
    [BLOCK_TYPES.GRASS]: {
        mass: 1.0,
        density: 0.8,
        restitution: 0.2,
        friction: 0.6,
        drag: 0.95
    },
    
    [BLOCK_TYPES.STONE]: {
        mass: 2.5,
        density: 2.5,
        restitution: 0.1,
        friction: 0.8,
        drag: 0.98
    },
    
    [BLOCK_TYPES.WOOD]: {
        mass: 0.8,
        density: 0.6,
        restitution: 0.3,
        friction: 0.5,
        drag: 0.92
    },
    
    [BLOCK_TYPES.IRON]: {
        mass: 7.8,
        density: 7.8,
        restitution: 0.05,
        friction: 0.9,
        drag: 0.99
    },
    
    [BLOCK_TYPES.DIAMOND]: {
        mass: 3.5,
        density: 3.5,
        restitution: 0.05,
        friction: 0.9,
        drag: 0.99
    },
    
    [BLOCK_TYPES.LAVA]: {
        mass: 2.8,
        density: 2.8,
        restitution: 0.4,
        friction: 0.3,
        drag: 0.88
    }
};

// Physics Materials
export const PHYSICS_MATERIALS = {
    GRASS: {
        friction: 0.6,
        restitution: 0.2,
        density: 0.8
    },
    
    STONE: {
        friction: 0.8,
        restitution: 0.1,
        density: 2.5
    },
    
    WOOD: {
        friction: 0.5,
        restitution: 0.3,
        density: 0.6
    },
    
    METAL: {
        friction: 0.9,
        restitution: 0.05,
        density: 7.8
    },
    
    LIQUID: {
        friction: 0.3,
        restitution: 0.4,
        density: 2.8
    }
};

// World Physics
export const WORLD_PHYSICS = {
    VOID_LEVEL: -50,
    WORLD_BOUNDS: {
        MIN_X: -100,
        MAX_X: 100,
        MIN_Y: -50,
        MAX_Y: 100,
        MIN_Z: -100,
        MAX_Z: 100
    },
    
    ISLAND_PHYSICS: {
        ELASTICITY: 0.1,
        FRICTION: 0.8,
        DENSITY: 10.0
    }
};

// Gravity Zones (Future feature)
export const GRAVITY_ZONES = {
    NORMAL: {
        gravity: 0.5,
        direction: { x: 0, y: -1, z: 0 }
    },
    
    LOW_GRAVITY: {
        gravity: 0.2,
        direction: { x: 0, y: -1, z: 0 }
    },
    
    ZERO_GRAVITY: {
        gravity: 0.0,
        direction: { x: 0, y: 0, z: 0 }
    },
    
    REVERSE_GRAVITY: {
        gravity: 0.5,
        direction: { x: 0, y: 1, z: 0 }
    }
};

// Physics Events
export const PHYSICS_EVENTS = {
    COLLISION_DETECTED: 'physics:collision:detected',
    BLOCK_SETTLED: 'physics:block:settled',
    BLOCK_FELL: 'physics:block:fell',
    PHYSICS_TOGGLED: 'physics:toggled',
    GRAVITY_CHANGED: 'physics:gravity:changed'
};

// Performance Settings
export const PHYSICS_PERFORMANCE = {
    MAX_ACTIVE_OBJECTS: 1000,
    MAX_FALLING_OBJECTS: 100,
    CLEANUP_INTERVAL: 5000,
    MAX_MEMORY_USAGE: 10 * 1024 * 1024, // 10MB
    
    // Optimization levels
    OPTIMIZATION: {
        LOW: {
            updateRate: 30,
            maxSubsteps: 1,
            precision: 0.1
        },
        MEDIUM: {
            updateRate: 60,
            maxSubsteps: 2,
            precision: 0.05
        },
        HIGH: {
            updateRate: 120,
            maxSubsteps: 3,
            precision: 0.01
        }
    }
};

// Physics Utilities
export const PHYSICS_UTILS = {
    // Calculate distance between two points
    distance3D(x1, y1, z1, x2, y2, z2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    
    // Calculate distance in 2D (XZ plane)
    distance2D(x1, z1, x2, z2) {
        const dx = x2 - x1;
        const dz = z2 - z1;
        return Math.sqrt(dx * dx + dz * dz);
    },
    
    // Check if point is within bounds
    isInBounds(x, y, z, bounds) {
        return x >= bounds.MIN_X && x <= bounds.MAX_X &&
               y >= bounds.MIN_Y && y <= bounds.MAX_Y &&
               z >= bounds.MIN_Z && z <= bounds.MAX_Z;
    },
    
    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    // Check collision between two AABBs
    checkAABBCollision(a, b) {
        return a.minX <= b.maxX && a.maxX >= b.minX &&
               a.minY <= b.maxY && a.maxY >= b.minY &&
               a.minZ <= b.maxZ && a.maxZ >= b.minZ;
    },
    
    // Create AABB from position and size
    createAABB(x, y, z, size = 1) {
        const half = size / 2;
        return {
            minX: x - half,
            maxX: x + half,
            minY: y - half,
            maxY: y + half,
            minZ: z - half,
            maxZ: z + half
        };
    },
    
    // Apply impulse to object
    applyImpulse(object, impulse) {
        object.velocity.x += impulse.x / object.mass;
        object.velocity.y += impulse.y / object.mass;
        object.velocity.z += impulse.z / object.mass;
    },
    
    // Apply force to object over time
    applyForce(object, force, dt) {
        const impulse = {
            x: force.x * dt,
            y: force.y * dt,
            z: force.z * dt
        };
        this.applyImpulse(object, impulse);
    },
    
    // Calculate kinetic energy
    calculateKineticEnergy(object) {
        const v = object.velocity;
        const speed = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return 0.5 * object.mass * speed * speed;
    },
    
    // Calculate potential energy
    calculatePotentialEnergy(object, groundLevel = 0) {
        return object.mass * PHYSICS_CONFIG.GRAVITY * (object.position.y - groundLevel);
    }
};

// Physics Configuration Presets
export const PHYSICS_PRESETS = {
    REALISTIC: {
        gravity: 9.81,
        friction: 0.8,
        bounce: 0.3,
        airResistance: 0.99
    },
    
    GAME: {
        gravity: 0.5,
        friction: 0.98,
        bounce: 0.3,
        airResistance: 0.995
    },
    
    ARCADE: {
        gravity: 0.3,
        friction: 0.95,
        bounce: 0.6,
        airResistance: 0.99
    },
    
    MOBILE: {
        gravity: 0.4,
        friction: 0.97,
        bounce: 0.25,
        airResistance: 0.994
    }
};

// Import BLOCK_TYPES from blocks.js
import { BLOCK_TYPES } from './blocks.js';

// Export for compatibility
export default {
    PHYSICS_CONFIG,
    PHYSICS_ENGINE,
    COLLISION,
    BLOCK_PHYSICS,
    PHYSICS_MATERIALS,
    WORLD_PHYSICS,
    GRAVITY_ZONES,
    PHYSICS_EVENTS,
    PHYSICS_PERFORMANCE,
    PHYSICS_UTILS,
    PHYSICS_PRESETS
};