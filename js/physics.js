/**
 * SkyWorld v9.0 - Physics Engine
 * Handles gravity, collision detection, and block falling mechanics
 */

class PhysicsEngine {
    constructor() {
        this.gravity = 0.5;
        this.friction = 0.98;
        this.enabled = true;
        
        // Physics settings
        this.maxFallDistance = 50;
        this.collisionCheckRadius = 0.6;
        this.groundCheckRadius = 0.6;
        
        // Performance tracking
        this.activeFallingBlocks = 0;
        this.physicsUpdatesPerSecond = 0;
        this.lastUpdateTime = performance.now();
        this.updateCount = 0;
        
        this.isInitialized = false;
    }
    
    initialize() {
        console.log('⚡ Initializing Physics Engine...');
        
        this.isInitialized = true;
        console.log('✅ Physics Engine initialized');
    }
    
    update(fallingBlocks, placedBlocks, scene) {
        if (!this.enabled || !this.isInitialized) {
            return;
        }
        
        const startTime = performance.now();
        
        // Update performance tracking
        this.updatePerformance();
        
        // Update falling blocks
        this.updateFallingBlocks(fallingBlocks, placedBlocks, scene);
        
        // Check for block collisions and settling
        this.checkBlockSettling(fallingBlocks, placedBlocks, scene);
        
        // Clean up blocks that fell too far
        this.cleanupFallenBlocks(fallingBlocks, scene);
        
        // Update UI info
        this.updatePhysicsUI();
    }
    
    updateFallingBlocks(fallingBlocks, placedBlocks, scene) {
        const blocksToRemove = [];
        
        fallingBlocks.forEach((block, index) => {
            // Apply gravity
            block.velocity.y -= this.gravity;
            
            // Apply air resistance
            block.velocity.x *= this.friction;
            block.velocity.z *= this.friction;
            
            // Update position
            block.mesh.position.x += block.velocity.x;
            block.mesh.position.y += block.velocity.y;
            block.mesh.position.z += block.velocity.z;
            
            // Add rotation for falling effect
            if (block.velocity.y < 0) {
                block.mesh.rotation.x += 0.1;
                block.mesh.rotation.z += 0.05;
            }
            
            // Check for ground collision
            const groundLevel = this.findGroundLevel(
                block.mesh.position.x, 
                block.mesh.position.z, 
                placedBlocks, 
                fallingBlocks
            );
            
            if (block.mesh.position.y <= groundLevel + 0.5) {
                // Block has hit the ground
                this.handleGroundCollision(block, index, fallingBlocks, placedBlocks, scene);
            }
        });
    }
    
    findGroundLevel(x, z, placedBlocks, fallingBlocks) {
        let groundLevel = -this.maxFallDistance; // Void level
        
        // Check placed blocks
        placedBlocks.forEach(block => {
            const pos = block.position;
            if (Math.abs(pos.x - x) < this.groundCheckRadius && 
                Math.abs(pos.z - z) < this.groundCheckRadius) {
                groundLevel = Math.max(groundLevel, pos.y + 0.5);
            }
        });
        
        // Check falling blocks (other blocks that are already falling)
        fallingBlocks.forEach(block => {
            const pos = block.mesh.position;
            if (Math.abs(pos.x - x) < this.groundCheckRadius && 
                Math.abs(pos.z - z) < this.groundCheckRadius &&
                block.mesh !== fallingBlocks.find(fb => fb.mesh === block.mesh)?.mesh) {
                groundLevel = Math.max(groundLevel, pos.y + 0.5);
            }
        });
        
        // Check islands (world geometry)
        if (window.SkyWorld && window.SkyWorld.islands) {
            window.SkyWorld.islands.forEach(island => {
                const pos = island.position;
                const radius = island.geometry.parameters.radiusTop || 3;
                const distance = Math.sqrt(
                    Math.pow(pos.x - x, 2) + Math.pow(pos.z - z, 2)
                );
                
                if (distance < radius * 1.2) {
                    groundLevel = Math.max(groundLevel, pos.y + 1);
                }
            });
        }
        
        return groundLevel;
    }
    
    handleGroundCollision(block, index, fallingBlocks, placedBlocks, scene) {
        // Stop the block at ground level
        block.mesh.position.y = this.findGroundLevel(
            block.mesh.position.x,
            block.mesh.position.z,
            placedBlocks,
            fallingBlocks
        ) + 0.5;
        
        block.velocity.y = 0;
        block.velocity.x = 0;
        block.velocity.z = 0;
        
        // Reset rotation
        block.mesh.rotation.set(0, 0, 0);
        
        // Check if block has support (other blocks below it)
        const supportBlocks = this.getSupportBlocks(
            block.mesh.position,
            placedBlocks
        );
        
        if (supportBlocks.length > 0) {
            // Block has support, it can stay here
            this.settleBlock(block, index, fallingBlocks, placedBlocks);
            this.createLandingParticles(block.mesh.position);
            
            if (window.AudioSystem) {
                window.AudioSystem.playBlockSound(block.blockType, 0.7);
            }
            
            console.log(`📦 Block settled at (${block.mesh.position.x}, ${block.mesh.position.y}, ${block.mesh.position.z})`);
        } else {
            // Block has no support, it should continue falling
            // This might happen if there's a gap or the block is on the edge
            console.log('⚠️ Block has no support, continuing to fall');
        }
    }
    
    getSupportBlocks(position, placedBlocks) {
        const supportBlocks = [];
        const checkY = position.y - 1;
        const checkX = position.x;
        const checkZ = position.z;
        
        placedBlocks.forEach(block => {
            if (Math.abs(block.position.x - checkX) < this.collisionCheckRadius &&
                Math.abs(block.position.y - checkY) < this.collisionCheckRadius &&
                Math.abs(block.position.z - checkZ) < this.collisionCheckRadius) {
                supportBlocks.push(block);
            }
        });
        
        return supportBlocks;
    }
    
    checkBlockSettling(fallingBlocks, placedBlocks, scene) {
        // Check if any falling blocks should settle
        fallingBlocks.forEach(block => {
            const groundLevel = this.findGroundLevel(
                block.mesh.position.x,
                block.mesh.position.z,
                placedBlocks,
                fallingBlocks
            );
            
            const supportBlocks = this.getSupportBlocks(block.mesh.position, placedBlocks);
            
            // If block is on ground and has support
            if (Math.abs(block.mesh.position.y - (groundLevel + 0.5)) < 0.1 && 
                supportBlocks.length > 0 &&
                Math.abs(block.velocity.y) < 0.1) {
                
                // Find block index and settle it
                const index = fallingBlocks.indexOf(block);
                if (index > -1) {
                    this.settleBlock(block, index, fallingBlocks, placedBlocks);
                }
            }
        });
    }
    
    settleBlock(block, index, fallingBlocks, placedBlocks) {
        // Move block from falling to placed
        placedBlocks.push(block.mesh);
        fallingBlocks.splice(index, 1);
        
        // Reset rotation
        block.mesh.rotation.set(0, 0, 0);
        
        // Add visual effect for settling
        this.createSettleEffect(block.mesh.position);
    }
    
    createLandingParticles(position) {
        if (window.UIManager) {
            window.UIManager.createParticles(position.x, position.y, position.z, 'land');
        }
    }
    
    createSettleEffect(position) {
        if (window.UIManager) {
            // Create a subtle settle effect
            window.UIManager.createParticles(position.x, position.y, position.z, 'settle');
        }
    }
    
    cleanupFallenBlocks(fallingBlocks, scene) {
        const blocksToRemove = [];
        
        fallingBlocks.forEach((block, index) => {
            // Remove blocks that fell too far
            if (block.mesh.position.y < -this.maxFallDistance) {
                blocksToRemove.push(index);
            }
        });
        
        // Remove blocks in reverse order to maintain indices
        blocksToRemove.reverse().forEach(index => {
            scene.remove(fallingBlocks[index].mesh);
            fallingBlocks.splice(index, 1);
            console.log('🗑️ Removed block that fell too far');
        });
    }
    
    updatePerformance() {
        this.updateCount++;
        const now = performance.now();
        
        if (now - this.lastUpdateTime >= 1000) {
            this.physicsUpdatesPerSecond = Math.round((this.updateCount * 1000) / (now - this.lastUpdateTime));
            this.updateCount = 0;
            this.lastUpdateTime = now;
        }
    }
    
    updatePhysicsUI() {
        const fallingBlocksElement = document.getElementById('falling-blocks');
        if (fallingBlocksElement) {
            fallingBlocksElement.textContent = `Falling: ${this.activeFallingBlocks}`;
        }
    }
    
    togglePhysics() {
        this.enabled = !this.enabled;
        
        const gravityStatus = document.getElementById('gravity-status');
        if (gravityStatus) {
            gravityStatus.textContent = `Gravity: ${this.enabled ? 'ON' : 'OFF'}`;
        }
        
        console.log(`⚡ Physics ${this.enabled ? 'enabled' : 'disabled'}`);
    }
    
    setGravity(value) {
        this.gravity = Math.max(0.1, Math.min(2.0, value));
        console.log(`⚡ Gravity set to ${this.gravity}`);
    }
    
    setFriction(value) {
        this.friction = Math.max(0.9, Math.min(0.99, value));
        console.log(`⚡ Friction set to ${this.friction}`);
    }
    
    // Block interaction methods
    applyImpulse(block, force, direction) {
        if (!this.enabled) return;
        
        switch (direction) {
            case 'up':
                block.velocity.y += force;
                break;
            case 'down':
                block.velocity.y -= force;
                break;
            case 'forward':
                block.velocity.z += force;
                break;
            case 'backward':
                block.velocity.z -= force;
                break;
            case 'left':
                block.velocity.x -= force;
                break;
            case 'right':
                block.velocity.x += force;
                break;
        }
    }
    
    makeBlockFall(block, fallingBlocks, placedBlocks) {
        // Remove from placed blocks
        const index = placedBlocks.indexOf(block);
        if (index > -1) {
            placedBlocks.splice(index, 1);
        }
        
        // Add to falling blocks
        const fallingBlock = {
            mesh: block,
            velocity: { x: 0, y: 0, z: 0 },
            blockType: block.userData ? block.userData.blockType : 'unknown'
        };
        
        fallingBlocks.push(fallingBlock);
        console.log(`⚡ Block made to fall: ${fallingBlock.blockType}`);
    }
    
    // Collision detection
    checkBlockCollision(block1, block2) {
        const pos1 = block1.position;
        const pos2 = block2.position;
        
        const distance = Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2) +
            Math.pow(pos1.z - pos2.z, 2)
        );
        
        return distance < this.collisionCheckRadius * 2;
    }
    
    // Debug and utility methods
    getPhysicsInfo() {
        return {
            enabled: this.enabled,
            gravity: this.gravity,
            friction: this.friction,
            activeFallingBlocks: this.activeFallingBlocks,
            physicsUpdatesPerSecond: this.physicsUpdatesPerSecond,
            maxFallDistance: this.maxFallDistance,
            collisionCheckRadius: this.collisionCheckRadius
        };
    }
    
    simulatePhysicsStep(fallingBlocks, placedBlocks) {
        // Simulate one physics step for testing
        this.update(fallingBlocks, placedBlocks, window.SkyWorld ? window.SkyWorld.scene : null);
    }
    
    resetAllBlocks(fallingBlocks, placedBlocks, scene) {
        // Reset all blocks to their original positions
        fallingBlocks.forEach(block => {
            scene.remove(block.mesh);
        });
        fallingBlocks.length = 0;
        
        console.log('🔄 All blocks reset to stable positions');
    }
}

// Make physics engine available globally
window.PhysicsEngine = PhysicsEngine;