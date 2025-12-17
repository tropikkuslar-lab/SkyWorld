/**
 * SkyWorld v9.0 - Block System Component
 * Handles block creation, management, and interaction
 */

class BlockSystem {
    constructor() {
        // Block type definitions
        this.blockTypes = {
            grass: { 
                color: 0x228B22, 
                name: 'Grass',
                hasTexture: true,
                density: 0.8,
                breakable: true,
                sound: 'grass',
                hardness: 1,
                transparent: false
            },
            stone: { 
                color: 0x696969, 
                name: 'Stone',
                hasTexture: true,
                density: 2.5,
                breakable: true,
                sound: 'stone',
                hardness: 3,
                transparent: false
            },
            wood: { 
                color: 0x8B4513, 
                name: 'Wood',
                hasTexture: true,
                density: 0.6,
                breakable: true,
                sound: 'wood',
                hardness: 2,
                transparent: false
            },
            iron: { 
                color: 0xC0C0C0, 
                name: 'Iron',
                hasTexture: true,
                density: 7.8,
                breakable: false,
                sound: 'metal',
                hardness: 5,
                transparent: false
            },
            diamond: { 
                color: 0x00FFFF, 
                name: 'Diamond',
                hasTexture: true,
                density: 3.5,
                breakable: false,
                sound: 'crystal',
                hardness: 5,
                transparent: false
            },
            lava: { 
                color: 0xFF4500, 
                name: 'Lava',
                hasTexture: true,
                density: 2.8,
                breakable: true,
                sound: 'liquid',
                hardness: 1,
                transparent: false,
                emissive: true,
                temperature: 'hot'
            }
        };
        
        // Selected block type
        this.selectedBlockType = 'grass';
        
        // Block registry for performance
        this.blockRegistry = new Map();
        
        // Block counter for unique IDs
        this.blockCounter = 0;
        
        this.isInitialized = false;
    }
    
    initialize() {
        console.log('🔨 Initializing Block System...');
        
        // Setup block selection UI
        this.setupBlockSelectionUI();
        
        // Setup block interaction
        this.setupBlockInteraction();
        
        this.isInitialized = true;
        console.log('✅ Block System initialized');
    }
    
    setupBlockSelectionUI() {
        const blockSelector = document.getElementById('block-selector');
        if (!blockSelector) {
            console.error('❌ Block selector not found');
            return;
        }
        
        // Clear existing buttons
        blockSelector.innerHTML = '';
        
        // Create block buttons
        Object.keys(this.blockTypes).forEach(blockType => {
            const button = this.createBlockButton(blockType);
            blockSelector.appendChild(button);
        });
        
        // Set initial selection
        this.selectBlockType('grass');
    }
    
    createBlockButton(blockType) {
        const button = document.createElement('div');
        button.className = `block-btn block-${blockType}`;
        button.dataset.block = blockType;
        button.title = `${this.blockTypes[blockType].name} Block`;
        
        button.addEventListener('click', () => {
            this.selectBlockType(blockType);
            
            if (window.AudioSystem) {
                window.AudioSystem.playClickSound(0.5);
            }
        });
        
        return button;
    }
    
    selectBlockType(blockType) {
        if (!this.blockTypes[blockType]) {
            console.warn(`⚠️ Unknown block type: ${blockType}`);
            return;
        }
        
        // Update button states
        document.querySelectorAll('.block-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-block="${blockType}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        this.selectedBlockType = blockType;
        
        // Update inventory selection if available
        if (window.InventorySystem) {
            window.InventorySystem.selectSlot(window.InventorySystem.inventory.selectedSlot);
        }
        
        console.log(`🔨 Selected block: ${blockType}`);
    }
    
    setSelectedBlockType(blockType) {
        this.selectedBlockType = blockType;
    }
    
    createBlock(x, y, z, blockType) {
        if (!this.blockTypes[blockType]) {
            console.error(`❌ Cannot create unknown block type: ${blockType}`);
            return null;
        }
        
        // Create geometry
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        // Create material with enhanced properties
        const material = this.createBlockMaterial(blockType);
        
        // Create mesh
        const blockMesh = new THREE.Mesh(geometry, material);
        
        // Set position
        blockMesh.position.set(x, y, z);
        
        // Set user data
        blockMesh.userData = { 
            type: 'block', 
            blockType: blockType,
            id: ++this.blockCounter,
            created: Date.now()
        };
        
        // Enable shadows
        blockMesh.castShadow = true;
        blockMesh.receiveShadow = true;
        
        // Register block
        this.registerBlock(blockMesh);
        
        return blockMesh;
    }
    
    createBlockMaterial(blockType) {
        const blockData = this.blockTypes[blockType];
        const material = new THREE.MeshLambertMaterial({ 
            color: blockData.color,
            transparent: true,
            opacity: 0.9
        });
        
        // Add emissive properties for special blocks
        if (blockData.emissive) {
            material.emissive = new THREE.Color(blockData.color);
            material.emissiveIntensity = 0.2;
        }
        
        // Add transparency for certain blocks
        if (blockData.transparent) {
            material.transparent = true;
            material.opacity = 0.7;
        }
        
        return material;
    }
    
    registerBlock(block) {
        const id = block.userData.id;
        this.blockRegistry.set(id, block);
    }
    
    unregisterBlock(block) {
        const id = block.userData.id;
        this.blockRegistry.delete(id);
    }
    
    getBlock(blockType, x, y, z) {
        // Find block at specific coordinates
        for (let [id, block] of this.blockRegistry) {
            if (block.userData.blockType === blockType &&
                Math.abs(block.position.x - x) < 0.1 &&
                Math.abs(block.position.y - y) < 0.1 &&
                Math.abs(block.position.z - z) < 0.1) {
                return block;
            }
        }
        return null;
    }
    
    removeBlock(block) {
        if (!block || !block.userData || block.userData.type !== 'block') {
            return false;
        }
        
        // Unregister block
        this.unregisterBlock(block);
        
        // Remove from scene
        if (block.parent) {
            block.parent.remove(block);
        }
        
        // Play sound effect
        if (window.AudioSystem) {
            window.AudioSystem.playBlockSound(block.userData.blockType, 0.7);
        }
        
        console.log(`🗑️ Removed ${block.userData.blockType} block`);
        return true;
    }
    
    placeBlock(x, y, z, blockType = null) {
        const type = blockType || this.selectedBlockType;
        
        // Check if placement is valid
        if (!this.canPlaceBlock(x, y, z, type)) {
            console.warn(`⚠️ Cannot place ${type} block at (${x}, ${y}, ${z})`);
            
            if (window.AudioSystem) {
                window.AudioSystem.playErrorSound();
            }
            return false;
        }
        
        // Check inventory
        if (window.InventorySystem) {
            if (!window.InventorySystem.canPlaceBlock(type, 1)) {
                console.warn(`⚠️ Not enough ${type} blocks in inventory`);
                
                if (window.AudioSystem) {
                    window.AudioSystem.playErrorSound();
                }
                return false;
            }
            
            // Remove from inventory
            window.InventorySystem.removeItem(type, 1);
        }
        
        // Create and place block
        const block = this.createBlock(x, y, z, type);
        
        if (block && window.SkyWorld) {
            window.SkyWorld.scene.add(block);
            window.SkyWorld.placedBlocks.push(block);
            
            // Play placement sound
            if (window.AudioSystem) {
                window.AudioSystem.playBlockSound(type);
            }
            
            // Create particles
            if (window.UIManager) {
                window.UIManager.createParticles(x, y, z, 'place');
            }
            
            // Check if block should fall (physics)
            if (window.PhysicsSystem && window.PhysicsSystem.enabled) {
                this.checkAndMakeBlockFall(block);
            }
            
            console.log(`🔨 Placed ${type} block at (${x}, ${y}, ${z})`);
            return true;
        }
        
        return false;
    }
    
    canPlaceBlock(x, y, z, blockType) {
        // Check if position is occupied
        for (let [id, block] of this.blockRegistry) {
            if (Math.abs(block.position.x - x) < 0.1 &&
                Math.abs(block.position.y - y) < 0.1 &&
                Math.abs(block.position.z - z) < 0.1) {
                return false;
            }
        }
        
        // Check if block type is valid
        if (!this.blockTypes[blockType]) {
            return false;
        }
        
        return true;
    }
    
    checkAndMakeBlockFall(block) {
        if (!window.SkyWorld || !window.PhysicsSystem) return;
        
        const groundLevel = window.PhysicsSystem.findGroundLevel(
            block.position.x,
            block.position.z,
            window.SkyWorld.placedBlocks,
            window.SkyWorld.fallingBlocks
        );
        
        const supportBlocks = window.PhysicsSystem.getSupportBlocks(
            block.position,
            window.SkyWorld.placedBlocks
        );
        
        // If block is floating and has no support, make it fall
        if (supportBlocks.length === 0 && block.position.y > groundLevel + 0.5) {
            window.PhysicsSystem.makeBlockFall(block, window.SkyWorld.fallingBlocks, window.SkyWorld.placedBlocks);
            console.log(`⚡ ${block.userData.blockType} block will fall due to gravity`);
        }
    }
    
    setupBlockInteraction() {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;
        
        canvas.addEventListener('click', this.handleBlockClick.bind(this));
    }
    
    handleBlockClick(event) {
        if (!window.SkyWorld || !window.SkyWorld.gameStarted) return;
        
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, window.SkyWorld.camera);
        
        const intersects = raycaster.intersectObjects(window.SkyWorld.scene.children);
        
        if (intersects.length > 0) {
            const intersect = intersects[0];
            const point = intersect.point;
            
            // Calculate placement point
            const normal = intersect.face.normal.clone();
            const placementPoint = point.clone().add(normal.multiplyScalar(0.5));
            
            // Round to grid
            placementPoint.x = Math.round(placementPoint.x);
            placementPoint.y = Math.round(placementPoint.y);
            placementPoint.z = Math.round(placementPoint.z);
            
            // Place block
            this.placeBlock(placementPoint.x, placementPoint.y, placementPoint.z);
        }
    }
    
    generateNaturalBlocks(scene, islands) {
        if (!islands || islands.length === 0) return;
        
        islands.forEach(island => {
            this.addNaturalBlocksToIsland(island, scene);
        });
    }
    
    addNaturalBlocksToIsland(island, scene) {
        const islandData = island.userData;
        const radius = island.geometry.parameters.radiusTop || 3;
        
        // Add random natural blocks
        for (let i = 0; i < Math.floor(radius * 2); i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius * 0.8;
            const x = island.position.x + Math.cos(angle) * distance;
            const z = island.position.z + Math.sin(angle) * distance;
            const y = island.position.y + 1.5;
            
            if (Math.random() > 0.5) {
                // Add a tree
                this.createTree(x, y, z, scene);
            } else {
                // Add rocks
                this.createRock(x, y, z, scene);
            }
        }
    }
    
    createTree(x, y, z, scene) {
        // Tree trunk
        const trunk = this.createBlock(x, y, z, 'wood');
        const trunk2 = this.createBlock(x, y + 1, z, 'wood');
        const trunk3 = this.createBlock(x, y + 2, z, 'wood');
        
        scene.add(trunk);
        scene.add(trunk2);
        scene.add(trunk3);
        
        // Tree leaves
        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                const leaves = this.createBlock(x + dx, y + 3, z + dz, 'grass');
                scene.add(leaves);
            }
        }
    }
    
    createRock(x, y, z, scene) {
        const rock = this.createBlock(x, y, z, 'stone');
        scene.add(rock);
        
        // Sometimes add a second rock on top
        if (Math.random() > 0.5) {
            const rock2 = this.createBlock(x, y + 1, z, 'stone');
            scene.add(rock2);
        }
    }
    
    // Utility methods
    getBlockTypeData(blockType) {
        return this.blockTypes[blockType] || null;
    }
    
    getAllBlockTypes() {
        return Object.keys(this.blockTypes);
    }
    
    getSelectedBlockType() {
        return this.selectedBlockType;
    }
    
    getBlockCount() {
        return this.blockRegistry.size;
    }
    
    getBlocksByType(blockType) {
        const blocks = [];
        for (let [id, block] of this.blockRegistry) {
            if (block.userData.blockType === blockType) {
                blocks.push(block);
            }
        }
        return blocks;
    }
    
    clearAllBlocks() {
        for (let [id, block] of this.blockRegistry) {
            if (block.parent) {
                block.parent.remove(block);
            }
        }
        this.blockRegistry.clear();
        console.log('🧹 All blocks cleared');
    }
    
    getDebugInfo() {
        const blockCounts = {};
        for (let [id, block] of this.blockRegistry) {
            const type = block.userData.blockType;
            blockCounts[type] = (blockCounts[type] || 0) + 1;
        }
        
        return {
            selectedBlockType: this.selectedBlockType,
            totalBlocks: this.blockRegistry.size,
            blockCounts: blockCounts,
            blockTypes: Object.keys(this.blockTypes).length,
            isInitialized: this.isInitialized
        };
    }
}

// Make block system available globally
window.BlockSystem = BlockSystem;