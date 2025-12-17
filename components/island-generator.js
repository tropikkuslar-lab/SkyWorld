/**
 * SkyWorld v9.0 - Island Generator Component
 * Creates and manages floating islands, bridges, and aerial structures
 */

class IslandGenerator {
    constructor() {
        // Island configurations
        this.islandConfigs = [
            { x: -10, y: 8, z: -5, radius: 3, color: 0x228B22, name: 'Forest Island' },
            { x: 15, y: 12, z: 8, radius: 4, color: 0x8B4513, name: 'Mountain Island' },
            { x: -5, y: 6, z: 12, radius: 2, color: 0x32CD32, name: 'Grass Island' },
            { x: 8, y: 15, z: -12, radius: 5, color: 0xFF8C00, name: 'Desert Island' },
            { x: 18, y: 9, z: -3, radius: 3, color: 0x9ACD32, name: 'Meadow Island' },
            { x: -15, y: 14, z: 10, radius: 4, color: 0x20B2AA, name: 'Ocean Island' }
        ];
        
        // Bridge configurations
        this.bridgeConfigs = [
            { start: [-10, 10, -5], end: [15, 14, 8], color: 0x8B4513 },
            { start: [-5, 8, 12], end: [18, 11, -3], color: 0x8B4513 },
            { start: [-10, 10, -5], end: [-10, 15, -5], color: 0x8B4513 }
        ];
        
        // Aerial structure configurations
        this.structureConfigs = [
            { type: 'castle', position: [20, 18, 0], color: 0x696969, name: 'Sky Castle' },
            { type: 'tower', position: [-20, 22, 15], color: 0x778899, name: 'Sky Tower' },
            { type: 'pyramid', position: [0, 16, -18], color: 0xDAA520, name: 'Sky Pyramid' }
        ];
        
        // Generated objects
        this.islands = [];
        this.bridges = [];
        this.structures = [];
        
        this.isInitialized = false;
    }
    
    initialize() {
        console.log('🏝️ Initializing Island Generator...');
        
        this.isInitialized = true;
        console.log('✅ Island Generator initialized');
    }
    
    createAllIslands(scene) {
        console.log('🏗️ Creating floating islands...');
        
        // Create islands
        this.islands = this.createIslands(scene);
        
        // Create bridges
        this.bridges = this.createBridges(scene);
        
        // Create aerial structures
        this.structures = this.createStructures(scene);
        
        console.log(`✅ Created ${this.islands.length} islands, ${this.bridges.length} bridges, ${this.structures.length} structures`);
        
        return this.islands;
    }
    
    createIslands(scene) {
        const createdIslands = [];
        
        this.islandConfigs.forEach((config, index) => {
            const island = this.createIsland(config, index);
            scene.add(island);
            createdIslands.push(island);
        });
        
        return createdIslands;
    }
    
    createIsland(config, index) {
        // Create island base
        const geometry = new THREE.CylinderGeometry(config.radius, config.radius * 1.2, 2, 12);
        const material = new THREE.MeshLambertMaterial({ 
            color: config.color,
            transparent: true,
            opacity: 0.9
        });
        const islandMesh = new THREE.Mesh(geometry, material);
        
        islandMesh.position.set(config.x, config.y, config.z);
        islandMesh.userData = { 
            type: 'island', 
            name: config.name,
            index: index,
            config: config
        };
        islandMesh.castShadow = true;
        islandMesh.receiveShadow = true;
        
        // Create island top with enhanced features
        this.addIslandTop(islandMesh, config);
        
        // Add island features
        this.addIslandFeatures(islandMesh, config);
        
        return islandMesh;
    }
    
    addIslandTop(islandMesh, config) {
        const topGeometry = new THREE.CylinderGeometry(config.radius * 0.9, config.radius * 0.9, 0.3, 12);
        const topMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x228B22,
            emissive: 0x001100
        });
        const topMesh = new THREE.Mesh(topGeometry, topMaterial);
        topMesh.position.set(islandMesh.position.x, islandMesh.position.y + 1.15, islandMesh.position.z);
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        
        // Add to scene through parent island
        islandMesh.add(topMesh);
    }
    
    addIslandFeatures(islandMesh, config) {
        // Add decorative elements based on island type
        switch (config.name) {
            case 'Forest Island':
                this.addForestFeatures(islandMesh, config);
                break;
            case 'Mountain Island':
                this.addMountainFeatures(islandMesh, config);
                break;
            case 'Desert Island':
                this.addDesertFeatures(islandMesh, config);
                break;
            case 'Ocean Island':
                this.addOceanFeatures(islandMesh, config);
                break;
            default:
                this.addGrassFeatures(islandMesh, config);
        }
    }
    
    addForestFeatures(islandMesh, config) {
        // Add extra trees and vegetation
        const treeCount = Math.floor(config.radius * 1.5);
        
        for (let i = 0; i < treeCount; i++) {
            const angle = (i / treeCount) * Math.PI * 2;
            const distance = config.radius * 0.6;
            const x = islandMesh.position.x + Math.cos(angle) * distance;
            const z = islandMesh.position.z + Math.sin(angle) * distance;
            const y = islandMesh.position.y + 1.5;
            
            this.createSmallTree(x, y, z);
        }
    }
    
    addMountainFeatures(islandMesh, config) {
        // Add rocky outcrops
        const rockCount = Math.floor(config.radius * 1.2);
        
        for (let i = 0; i < rockCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * config.radius * 0.7;
            const x = islandMesh.position.x + Math.cos(angle) * distance;
            const z = islandMesh.position.z + Math.sin(angle) * distance;
            const y = islandMesh.position.y + 1.5;
            
            this.createRockCluster(x, y, z);
        }
    }
    
    addDesertFeatures(islandMesh, config) {
        // Add sand dunes and cacti
        this.createSandDunes(islandMesh, config);
        this.createCacti(islandMesh, config);
    }
    
    addOceanFeatures(islandMesh, config) {
        // Add coral and seaweed
        this.createCoralReef(islandMesh, config);
        this.createSeaweed(islandMesh, config);
    }
    
    addGrassFeatures(islandMesh, config) {
        // Add flowers and small bushes
        this.createFlowers(islandMesh, config);
        this.createBushes(islandMesh, config);
    }
    
    createSmallTree(x, y, z) {
        if (!window.BlockSystem) return;
        
        // Create a small tree using blocks
        window.BlockSystem.createBlock(x, y, z, 'wood');
        window.BlockSystem.createBlock(x, y + 1, z, 'wood');
        
        // Add leaves
        const leafPositions = [
            [x - 1, y + 2, z],
            [x + 1, y + 2, z],
            [x, y + 2, z - 1],
            [x, y + 2, z + 1]
        ];
        
        leafPositions.forEach(pos => {
            window.BlockSystem.createBlock(pos[0], pos[1], pos[2], 'grass');
        });
    }
    
    createRockCluster(x, y, z) {
        if (!window.BlockSystem) return;
        
        // Create a cluster of stone blocks
        const positions = [
            [x, y, z],
            [x + 1, y, z],
            [x, y, z + 1],
            [x - 1, y, z],
            [x, y, z - 1]
        ];
        
        positions.forEach(pos => {
            if (Math.random() > 0.3) { // Not every position gets a rock
                window.BlockSystem.createBlock(pos[0], pos[1], pos[2], 'stone');
            }
        });
    }
    
    createSandDunes(islandMesh, config) {
        // Create subtle sand formations
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const distance = config.radius * 0.5;
            const x = islandMesh.position.x + Math.cos(angle) * distance;
            const z = islandMesh.position.z + Math.sin(angle) * distance;
            const y = islandMesh.position.y + 1.3;
            
            this.createSandFormation(x, y, z);
        }
    }
    
    createSandFormation(x, y, z) {
        if (!window.BlockSystem) return;
        
        // Create a sand mound
        const positions = [
            [x, y, z],
            [x + 1, y, z],
            [x - 1, y, z],
            [x, y, z + 1],
            [x, y, z - 1]
        ];
        
        positions.forEach(pos => {
            window.BlockSystem.createBlock(pos[0], pos[1], pos[2], 'stone'); // Using stone as sand substitute
        });
    }
    
    createCacti(islandMesh, config) {
        // Add cactus-like structures
        for (let i = 0; i < 2; i++) {
            const angle = (i / 2) * Math.PI * 2;
            const distance = config.radius * 0.3;
            const x = islandMesh.position.x + Math.cos(angle) * distance;
            const z = islandMesh.position.z + Math.sin(angle) * distance;
            const y = islandMesh.position.y + 1.5;
            
            this.createCactus(x, y, z);
        }
    }
    
    createCactus(x, y, z) {
        if (!window.BlockSystem) return;
        
        // Create a cactus-like structure
        window.BlockSystem.createBlock(x, y, z, 'wood'); // Using wood as cactus
        window.BlockSystem.createBlock(x, y + 1, z, 'wood');
        window.BlockSystem.createBlock(x, y + 2, z, 'wood');
    }
    
    createCoralReef(islandMesh, config) {
        // Add colorful coral structures
        const coralTypes = ['diamond', 'iron']; // Using special blocks as coral
        const coralCount = 5;
        
        for (let i = 0; i < coralCount; i++) {
            const angle = (i / coralCount) * Math.PI * 2;
            const distance = config.radius * 0.4;
            const x = islandMesh.position.x + Math.cos(angle) * distance;
            const z = islandMesh.position.z + Math.sin(angle) * distance;
            const y = islandMesh.position.y + 1.2;
            
            const coralType = coralTypes[i % coralTypes.length];
            window.BlockSystem.createBlock(x, y, z, coralType);
        }
    }
    
    createSeaweed(islandMesh, config) {
        // Add seaweed-like structures
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const distance = config.radius * 0.6;
            const x = islandMesh.position.x + Math.cos(angle) * distance;
            const z = islandMesh.position.z + Math.sin(angle) * distance;
            const y = islandMesh.position.y + 1.5;
            
            window.BlockSystem.createBlock(x, y, z, 'wood'); // Using wood as seaweed
        }
    }
    
    createFlowers(islandMesh, config) {
        // Add flower patches
        const flowerCount = 8;
        
        for (let i = 0; i < flowerCount; i++) {
            const angle = (i / flowerCount) * Math.PI * 2;
            const distance = Math.random() * config.radius * 0.7;
            const x = islandMesh.position.x + Math.cos(angle) * distance;
            const z = islandMesh.position.z + Math.sin(angle) * distance;
            const y = islandMesh.position.y + 1.5;
            
            // Use different block types as flowers
            const flowerTypes = ['diamond', 'iron', 'lava'];
            const flowerType = flowerTypes[i % flowerTypes.length];
            window.BlockSystem.createBlock(x, y, z, flowerType);
        }
    }
    
    createBushes(islandMesh, config) {
        // Add small bush clusters
        const bushCount = 4;
        
        for (let i = 0; i < bushCount; i++) {
            const angle = (i / bushCount) * Math.PI * 2;
            const distance = config.radius * 0.5;
            const x = islandMesh.position.x + Math.cos(angle) * distance;
            const z = islandMesh.position.z + Math.sin(angle) * distance;
            const y = islandMesh.position.y + 1.5;
            
            // Create a small bush cluster
            const bushPositions = [
                [x, y, z],
                [x + 1, y, z],
                [x - 1, y, z],
                [x, y, z + 1],
                [x, y, z - 1]
            ];
            
            bushPositions.forEach(pos => {
                if (Math.random() > 0.4) { // Not every position gets a bush
                    window.BlockSystem.createBlock(pos[0], pos[1], pos[2], 'grass');
                }
            });
        }
    }
    
    createBridges(scene) {
        const createdBridges = [];
        
        this.bridgeConfigs.forEach((config, index) => {
            const bridge = this.createBridge(config, index);
            scene.add(bridge);
            createdBridges.push(bridge);
        });
        
        return createdBridges;
    }
    
    createBridge(config, index) {
        const [startX, startY, startZ] = config.start;
        const [endX, endY, endZ] = config.end;
        
        const length = Math.sqrt(
            Math.pow(endX - startX, 2) + 
            Math.pow(endY - startY, 2) + 
            Math.pow(endZ - startZ, 2)
        );
        
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const midZ = (startZ + endZ) / 2;
        
        const geometry = new THREE.BoxGeometry(length, 0.5, 1);
        const material = new THREE.MeshLambertMaterial({ 
            color: config.color,
            transparent: true,
            opacity: 0.8
        });
        const bridgeMesh = new THREE.Mesh(geometry, material);
        
        bridgeMesh.position.set(midX, midY, midZ);
        bridgeMesh.userData = { 
            type: 'bridge', 
            index: index,
            start: config.start,
            end: config.end,
            color: config.color
        };
        bridgeMesh.castShadow = true;
        
        return bridgeMesh;
    }
    
    createStructures(scene) {
        const createdStructures = [];
        
        this.structureConfigs.forEach((config, index) => {
            const structure = this.createStructure(config, index);
            scene.add(structure);
            createdStructures.push(structure);
        });
        
        return createdStructures;
    }
    
    createStructure(config, index) {
        const [x, y, z] = config.position;
        let geometry, material;
        
        switch (config.type) {
            case 'castle':
                geometry = new THREE.BoxGeometry(6, 8, 6);
                material = new THREE.MeshLambertMaterial({ 
                    color: config.color,
                    transparent: true,
                    opacity: 0.9
                });
                break;
                
            case 'tower':
                geometry = new THREE.CylinderGeometry(2, 2, 15, 8);
                material = new THREE.MeshLambertMaterial({ 
                    color: config.color,
                    transparent: true,
                    opacity: 0.9
                });
                break;
                
            case 'pyramid':
                geometry = new THREE.ConeGeometry(5, 8, 4);
                material = new THREE.MeshLambertMaterial({ 
                    color: config.color,
                    transparent: true,
                    opacity: 0.9
                });
                break;
                
            default:
                geometry = new THREE.BoxGeometry(3, 3, 3);
                material = new THREE.MeshLambertMaterial({ color: config.color });
        }
        
        const structureMesh = new THREE.Mesh(geometry, material);
        structureMesh.position.set(x, y, z);
        structureMesh.userData = { 
            type: config.type, 
            name: config.name,
            index: index,
            color: config.color
        };
        structureMesh.castShadow = true;
        
        return structureMesh;
    }
    
    // Utility methods
    getIslandByName(name) {
        return this.islands.find(island => island.userData.name === name);
    }
    
    getStructureByName(name) {
        return this.structures.find(structure => structure.userData.name === name);
    }
    
    addCustomIsland(x, y, z, radius, color, name) {
        const config = { x, y, z, radius, color, name: name || 'Custom Island' };
        const island = this.createIsland(config, this.islands.length);
        
        if (window.SkyWorld && window.SkyWorld.scene) {
            window.SkyWorld.scene.add(island);
            this.islands.push(island);
        }
        
        return island;
    }
    
    removeIsland(island) {
        if (!island || island.userData.type !== 'island') return false;
        
        if (window.SkyWorld && window.SkyWorld.scene) {
            window.SkyWorld.scene.remove(island);
        }
        
        const index = this.islands.indexOf(island);
        if (index > -1) {
            this.islands.splice(index, 1);
        }
        
        console.log(`🗑️ Removed island: ${island.userData.name}`);
        return true;
    }
    
    getDebugInfo() {
        return {
            islands: this.islands.length,
            bridges: this.bridges.length,
            structures: this.structures.length,
            islandConfigs: this.islandConfigs.length,
            bridgeConfigs: this.bridgeConfigs.length,
            structureConfigs: this.structureConfigs.length,
            isInitialized: this.isInitialized
        };
    }
}

// Make island generator available globally
window.IslandGenerator = IslandGenerator;