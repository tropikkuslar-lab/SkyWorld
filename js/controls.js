/**
 * SkyWorld v9.0 - Controls Manager
 * Handles keyboard, mouse, and touch controls
 */

class ControlsManager {
    constructor() {
        // Movement settings
        this.movementSpeed = 1;
        this.mouseSensitivity = 0.01;
        this.touchSensitivity = 0.5;
        
        // Control state
        this.isMouseDown = false;
        this.isTouchActive = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.lastTouchX = 0;
        this.lastTouchY = 0;
        
        // Player position
        this.player = { x: 0, y: 8, z: 0 };
        
        // Camera state
        this.cameraRotation = { x: 0, y: 0 };
        this.isPointerLocked = false;
        
        // Control preferences
        this.invertedY = false;
        this.enablePointerLock = false;
        this.mobileOptimized = this.checkMobileDevice();
        
        // Key bindings
        this.keyBindings = {
            moveForward: ['KeyW', 'ArrowUp'],
            moveBackward: ['KeyS', 'ArrowDown'],
            moveLeft: ['KeyA', 'ArrowLeft'],
            moveRight: ['KeyD', 'ArrowRight'],
            togglePhysics: ['KeyP'],
            toggleInventory: ['KeyI'],
            toggleDebug: ['F3'],
            jump: ['Space'],
            sprint: ['ShiftLeft', 'ShiftRight']
        };
        
        this.isInitialized = false;
        
        // Performance tracking
        this.controlUpdatesPerSecond = 0;
        this.lastUpdateTime = performance.now();
        this.updateCount = 0;
    }
    
    initialize() {
        console.log('🎮 Initializing Controls Manager...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup mobile controls if needed
        if (this.mobileOptimized) {
            this.setupMobileControls();
        }
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        this.isInitialized = true;
        console.log('✅ Controls Manager initialized');
    }
    
    setupEventListeners() {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) {
            console.error('❌ Game canvas not found');
            return;
        }
        
        // Mouse events
        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        canvas.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Touch events (for mobile)
        canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Window events
        window.addEventListener('blur', this.handleWindowBlur.bind(this));
        window.addEventListener('focus', this.handleWindowFocus.bind(this));
        
        // Pointer lock events
        document.addEventListener('pointerlockchange', this.handlePointerLockChange.bind(this));
        document.addEventListener('pointerlockerror', this.handlePointerLockError.bind(this));
    }
    
    setupMobileControls() {
        console.log('📱 Setting up mobile controls');
        
        // Add mobile-specific UI elements
        this.createMobileControlsUI();
        
        // Disable context menu on mobile
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
    
    createMobileControlsUI() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'mobile-controls';
        controlsContainer.innerHTML = `
            <div class="mobile-joystick" id="mobile-joystick">
                <div class="joystick-knob"></div>
            </div>
            <div class="mobile-actions">
                <button class="action-btn" id="jump-btn">⤴️</button>
                <button class="action-btn" id="interact-btn">🔨</button>
            </div>
        `;
        
        document.getElementById('game-container').appendChild(controlsContainer);
        
        // Setup mobile button events
        this.setupMobileButtons();
    }
    
    setupMobileButtons() {
        // Jump button
        const jumpBtn = document.getElementById('jump-btn');
        if (jumpBtn) {
            jumpBtn.addEventListener('touchstart', () => {
                this.handleJump();
            });
        }
        
        // Interact button
        const interactBtn = document.getElementById('interact-btn');
        if (interactBtn) {
            interactBtn.addEventListener('touchstart', () => {
                this.handleInteract();
            });
        }
    }
    
    setupKeyboardShortcuts() {
        // F1 - Help
        // F3 - Debug mode
        // P - Toggle physics
        // I - Toggle inventory
        // ESC - Pause menu
        // Tab - Inventory (prevent default)
        
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyF3':
                    event.preventDefault();
                    this.toggleDebugMode();
                    break;
                case 'KeyI':
                    event.preventDefault();
                    this.toggleInventory();
                    break;
                case 'Escape':
                    this.handleEscape();
                    break;
                case 'Tab':
                    event.preventDefault();
                    this.handleInventoryNavigation(event.shiftKey ? 'prev' : 'next');
                    break;
            }
        });
    }
    
    handleMouseDown(event) {
        if (!window.SkyWorld || !window.SkyWorld.gameStarted) return;
        
        this.isMouseDown = true;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        
        // Enable pointer lock if enabled
        if (this.enablePointerLock) {
            event.target.requestPointerLock();
        }
        
        // Play click sound
        if (window.AudioSystem) {
            window.AudioSystem.playClickSound(0.5);
        }
    }
    
    handleMouseUp(event) {
        this.isMouseDown = false;
        
        // Exit pointer lock
        if (this.enablePointerLock && document.pointerLockElement) {
            document.exitPointerLock();
        }
    }
    
    handleMouseMove(event) {
        if (!window.SkyWorld || !window.SkyWorld.gameStarted) return;
        
        const deltaX = event.movementX || (event.clientX - this.lastMouseX);
        const deltaY = event.movementY || (event.clientY - this.lastMouseY);
        
        if (this.isMouseDown || this.isPointerLocked) {
            this.updateCameraRotation(deltaX, deltaY);
        }
        
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
    }
    
    handleTouchStart(event) {
        if (!window.SkyWorld || !window.SkyWorld.gameStarted) return;
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.isTouchActive = true;
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
        }
        
        event.preventDefault();
    }
    
    handleTouchMove(event) {
        if (!window.SkyWorld || !window.SkyWorld.gameStarted) return;
        
        if (this.isTouchActive && event.touches.length === 1) {
            const touch = event.touches[0];
            const deltaX = (touch.clientX - this.lastTouchX) * this.touchSensitivity;
            const deltaY = (touch.clientY - this.lastTouchY) * this.touchSensitivity;
            
            this.updateCameraRotation(deltaX, deltaY);
            
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
        }
        
        event.preventDefault();
    }
    
    handleTouchEnd(event) {
        this.isTouchActive = false;
        event.preventDefault();
    }
    
    updateCameraRotation(deltaX, deltaY) {
        const camera = window.SkyWorld.camera;
        if (!camera) return;
        
        // Update rotation with sensitivity and inversion
        const rotationSpeed = this.mouseSensitivity;
        const yRotation = -deltaX * rotationSpeed;
        const xRotation = this.invertedY ? deltaY * rotationSpeed : -deltaY * rotationSpeed;
        
        camera.rotation.y += yRotation;
        camera.rotation.x += xRotation;
        
        // Clamp vertical rotation
        camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
        
        // Update performance tracking
        this.updatePerformance();
    }
    
    handleKeyDown(event) {
        if (!window.SkyWorld || !window.SkyWorld.gameStarted) return;
        
        // Prevent default for game keys
        if (Object.values(this.keyBindings).flat().includes(event.code)) {
            event.preventDefault();
        }
        
        this.handleMovement(event.code, true);
        this.handleSpecialKeys(event.code);
    }
    
    handleKeyUp(event) {
        this.handleMovement(event.code, false);
    }
    
    handleMovement(keyCode, isPressed) {
        if (!window.SkyWorld) return;
        
        const camera = window.SkyWorld.camera;
       .SkyWorld.player const player = window;
        
        if (!camera || !player) return;
        
        let moved = false;
        
        // Handle movement keys
        if (this.keyBindings.moveForward.includes(keyCode)) {
            if (isPressed) {
                player.z -= this.movementSpeed;
                moved = true;
            }
        } else if (this.keyBindings.moveBackward.includes(keyCode)) {
            if (isPressed) {
                player.z += this.movementSpeed;
                moved = true;
            }
        } else if (this.keyBindings.moveLeft.includes(keyCode)) {
            if (isPressed) {
                player.x -= this.movementSpeed;
                moved = true;
            }
        } else if (this.keyBindings.moveRight.includes(keyCode)) {
            if (isPressed) {
                player.x += this.movementSpeed;
                moved = true;
            }
        }
        
        // Update camera position if moved
        if (moved) {
            camera.position.x = player.x;
            camera.position.z = player.z + 10;
            camera.lookAt(player.x, player.y, player.z);
        }
    }
    
    handleSpecialKeys(keyCode) {
        switch (keyCode) {
            case 'KeyP':
                this.togglePhysics();
                break;
            case 'Space':
                this.handleJump();
                break;
        }
    }
    
    togglePhysics() {
        if (window.PhysicsSystem) {
            window.PhysicsSystem.togglePhysics();
        }
    }
    
    handleJump() {
        // Simple jump implementation
        console.log('⤴️ Jump triggered');
        
        if (window.AudioSystem) {
            window.AudioSystem.playClickSound(0.3);
        }
    }
    
    handleInteract() {
        // Handle block interaction (placement/removal)
        console.log('🔨 Interact triggered');
        
        if (window.AudioSystem) {
            window.AudioSystem.playClickSound(0.4);
        }
    }
    
    handleContextMenu(event) {
        event.preventDefault();
        // Right-click could be used for block removal
        this.handleInteract();
    }
    
    handleWindowBlur() {
        // Pause game or disable controls when window loses focus
        this.isMouseDown = false;
        this.isTouchActive = false;
    }
    
    handleWindowFocus() {
        // Resume normal operation when window gains focus
        console.log('🎯 Window focused, controls active');
    }
    
    handlePointerLockChange() {
        this.isPointerLocked = !!document.pointerLockElement;
        console.log(`🎯 Pointer lock ${this.isPointerLocked ? 'enabled' : 'disabled'}`);
    }
    
    handlePointerLockError() {
        console.warn('⚠️ Pointer lock failed');
        this.enablePointerLock = false;
    }
    
    toggleDebugMode() {
        window.debugMode = !window.debugMode;
        console.log(`🔍 Debug mode ${window.debugMode ? 'enabled' : 'disabled'}`);
    }
    
    toggleInventory() {
        const inventoryPanel = document.getElementById('inventory-panel');
        if (inventoryPanel) {
            const isVisible = inventoryPanel.style.display !== 'none';
            inventoryPanel.style.display = isVisible ? 'none' : 'block';
            
            if (window.AudioSystem) {
                window.AudioSystem.playClickSound(0.6);
            }
        }
    }
    
    handleEscape() {
        // Handle escape key (pause menu, etc.)
        this.toggleInventory();
    }
    
    handleInventoryNavigation(direction) {
        if (window.InventorySystem) {
            const currentSlot = window.InventorySystem.inventory.selectedSlot;
            let newSlot = currentSlot;
            
            if (direction === 'next') {
                newSlot = (currentSlot + 1) % 25;
            } else {
                newSlot = currentSlot > 0 ? currentSlot - 1 : 24;
            }
            
            window.InventorySystem.selectSlot(newSlot);
        }
    }
    
    updatePerformance() {
        this.updateCount++;
        const now = performance.now();
        
        if (now - this.lastUpdateTime >= 1000) {
            this.controlUpdatesPerSecond = Math.round((this.updateCount * 1000) / (now - this.lastUpdateTime));
            this.updateCount = 0;
            this.lastUpdateTime = now;
        }
    }
    
    // Utility methods
    checkMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    setMovementSpeed(speed) {
        this.movementSpeed = Math.max(0.1, Math.min(5.0, speed));
        console.log(`🎮 Movement speed set to ${this.movementSpeed}`);
    }
    
    setMouseSensitivity(sensitivity) {
        this.mouseSensitivity = Math.max(0.001, Math.min(0.1, sensitivity));
        console.log(`🎮 Mouse sensitivity set to ${this.mouseSensitivity}`);
    }
    
    setTouchSensitivity(sensitivity) {
        this.touchSensitivity = Math.max(0.1, Math.min(2.0, sensitivity));
        console.log(`📱 Touch sensitivity set to ${this.touchSensitivity}`);
    }
    
    invertYAxis(invert) {
        this.invertedY = invert;
        console.log(`🎮 Y-axis ${invert ? 'inverted' : 'normal'}`);
    }
    
    enablePointerLockMode(enable) {
        this.enablePointerLock = enable;
        console.log(`🎯 Pointer lock ${enable ? 'enabled' : 'disabled'}`);
    }
    
    // Getters
    getPlayerPosition() {
        return { ...this.player };
    }
    
    getCameraRotation() {
        return { ...this.cameraRotation };
    }
    
    getControlsInfo() {
        return {
            movementSpeed: this.movementSpeed,
            mouseSensitivity: this.mouseSensitivity,
            touchSensitivity: this.touchSensitivity,
            invertedY: this.invertedY,
            enablePointerLock: this.enablePointerLock,
            isMobile: this.mobileOptimized,
            controlUpdatesPerSecond: this.controlUpdatesPerSecond,
            isPointerLocked: this.isPointerLocked
        };
    }
}

// Make controls manager available globally
window.ControlsManager = ControlsManager;