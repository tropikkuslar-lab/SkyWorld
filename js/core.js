/**
 * SkyWorld v9.0 - Core Game Engine
 * Main game loop and initialization
 */

class SkyWorldCore {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.islands = [];
        this.placedBlocks = [];
        this.fallingBlocks = [];
        this.timeOfDay = 12;
        this.dayNumber = 1;
        this.gameStarted = false;
        this.player = { x: 0, y: 8, z: 0 };
        
        // Game state
        this.isPaused = false;
        this.isMobile = this.checkMobileDevice();
        
        // Performance tracking
        this.fps = 0;
        this.frameCount = 0;
        this.lastFrameTime = performance.now();
    }
    
    initialize() {
        console.log('🎮 Initializing SkyWorld Core...');
        
        // Initialize Three.js
        this.initThreeJS();
        
        // Setup game world
        this.setupWorld();
        
        // Start game loop
        this.startGameLoop();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.gameStarted = true;
        console.log('✅ SkyWorld Core initialized successfully!');
    }
    
    initThreeJS() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB);
        
        document.getElementById('game-container').appendChild(this.renderer.domElement);
        
        // Position camera
        this.camera.position.set(this.player.x, this.player.y + 5, this.player.z + 10);
        this.camera.lookAt(this.player.x, this.player.y, this.player.z);
    }
    
    setupWorld() {
        // Initialize lighting
        this.updateLighting();
        
        // Create islands
        if (window.IslandGenerator) {
            this.islands = window.IslandGenerator.createAllIslands(this.scene);
        }
        
        // Add initial blocks (natural generation)
        if (window.BlockSystem) {
            window.BlockSystem.generateNaturalBlocks(this.scene, this.islands);
        }
        
        console.log('🌍 World setup complete');
    }
    
    updateLighting() {
        // Remove existing lights
        const existingLights = this.scene.children.filter(child => child.isLight);
        existingLights.forEach(light => this.scene.remove(light));
        
        // Calculate light intensity based on time
        const timeFactor = Math.sin((this.timeOfDay / 24) * Math.PI * 2) * 0.5 + 0.5;
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3 + timeFactor * 0.4);
        this.scene.add(ambientLight);
        
        // Directional light (sun/moon)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8 * timeFactor + 0.2);
        directionalLight.position.set(50 * timeFactor, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);
        
        // Add point lights for special blocks
        this.addSpecialLighting();
        
        // Update sky color
        this.updateSkyColor(timeFactor);
    }
    
    addSpecialLighting() {
        // Add lighting for special blocks (lava, etc.)
        this.placedBlocks.forEach(block => {
            if (block.userData && block.userData.blockType === 'lava') {
                const lavaLight = new THREE.PointLight(0xFF4500, 0.5, 10);
                lavaLight.position.copy(block.position);
                this.scene.add(lavaLight);
            }
        });
    }
    
    updateSkyColor(timeFactor) {
        const skyColor = new THREE.Color().lerpColors(
            new THREE.Color(0x000011), // Night blue
            new THREE.Color(0x87CEEB), // Day blue
            timeFactor
        );
        this.renderer.setClearColor(skyColor);
    }
    
    updateTimeOfDay() {
        if (!this.gameStarted || this.isPaused) return;
        
        this.timeOfDay += 0.02; // Speed of time progression
        
        if (this.timeOfDay >= 24) {
            this.timeOfDay = 0;
            this.dayNumber++;
            console.log(`📅 New day: ${this.dayNumber}`);
        }
        
        // Update lighting
        this.updateLighting();
        
        // Update UI
        this.updateTimeDisplay();
    }
    
    updateTimeDisplay() {
        const hours = Math.floor(this.timeOfDay);
        const minutes = Math.floor((this.timeOfDay % 1) * 60);
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const timeElement = document.getElementById('time-text');
        if (timeElement) {
            timeElement.textContent = `Day ${this.dayNumber} - ${timeString}`;
        }
    }
    
    addBlock(x, y, z, blockType) {
        if (window.BlockSystem) {
            const block = window.BlockSystem.createBlock(x, y, z, blockType);
            this.placedBlocks.push(block);
            this.scene.add(block);
            
            // Add special lighting for certain blocks
            if (blockType === 'lava') {
                this.addSpecialLighting();
            }
            
            return block;
        }
        return null;
    }
    
    removeBlock(block) {
        // Remove from arrays
        const index = this.placedBlocks.indexOf(block);
        if (index > -1) {
            this.placedBlocks.splice(index, 1);
        }
        
        // Remove from scene
        this.scene.remove(block);
        
        console.log('🗑️ Block removed');
    }
    
    getAllBlocks() {
        return [...this.placedBlocks, ...this.fallingBlocks.map(fb => fb.mesh)];
    }
    
    startGameLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Update performance tracking
            this.updatePerformance();
            
            // Skip updates if paused
            if (this.isPaused) {
                this.renderer.render(this.scene, this.camera);
                return;
            }
            
            // Update time
            this.updateTimeOfDay();
            
            // Update physics
            if (window.PhysicsSystem) {
                window.PhysicsSystem.update(this.fallingBlocks, this.placedBlocks, this.scene);
            }
            
            // Update block animations
            this.updateBlockAnimations();
            
            // Rotate islands slightly for visual effect
            this.islands.forEach(island => {
                island.rotation.y += 0.001;
            });
            
            // Render
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
        console.log('🎯 Game loop started');
    }
    
    updatePerformance() {
        this.frameCount++;
        const now = performance.now();
        
        if (now - this.lastFrameTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
            this.frameCount = 0;
            this.lastFrameTime = now;
            
            // Update FPS display if needed
            if (window.debugMode) {
                console.log(`FPS: ${this.fps}`);
            }
        }
    }
    
    updateBlockAnimations() {
        this.placedBlocks.forEach(block => {
            if (block.userData && block.userData.blockType === 'lava') {
                const material = block.material;
                if (material.emissive) {
                    // Lava pulsing effect
                    material.emissive.setHex(0xFF4500 + Math.sin(Date.now() * 0.003) * 0x100000);
                }
            }
        });
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Visibility change (pause when tab not visible)
        document.addEventListener('visibilitychange', () => {
            this.isPaused = document.hidden;
            console.log(`Game ${this.isPaused ? 'paused' : 'resumed'}`);
        });
        
        // Mobile orientation change
        if (this.isMobile) {
            window.addEventListener('orientationchange', () => {
                setTimeout(() => this.handleResize(), 100);
            });
        }
    }
    
    handleResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            console.log('📱 Window resized');
        }
    }
    
    checkMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    pauseGame() {
        this.isPaused = true;
        console.log('⏸️ Game paused');
    }
    
    resumeGame() {
        this.isPaused = false;
        console.log('▶️ Game resumed');
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        console.log(`Game ${this.isPaused ? 'paused' : 'resumed'}`);
    }
    
    getPerformanceInfo() {
        return {
            fps: this.fps,
            blocksCount: this.placedBlocks.length,
            fallingBlocksCount: this.fallingBlocks.length,
            islandsCount: this.islands.length,
            gameStarted: this.gameStarted,
            isPaused: this.isPaused
        };
    }
    
    cleanup() {
        // Clean up resources
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        console.log('🧹 SkyWorld Core cleaned up');
    }
}

// Make core available globally
window.SkyWorldCore = SkyWorldCore;