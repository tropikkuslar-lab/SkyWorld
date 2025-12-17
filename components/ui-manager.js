/**
 * SkyWorld v9.0 - UI Manager Component
 * Handles UI panels, notifications, and visual feedback
 */

class UIManager {
    constructor() {
        // UI state
        this.isInitialized = false;
        this.activeNotifications = [];
        this.uiElements = new Map();
        
        // UI settings
        this.notificationDuration = 3000;
        this.fadeDuration = 500;
        this.animationQueue = [];
        
        // Mobile detection
        this.isMobile = this.checkMobileDevice();
        
        // Performance tracking
        this.uiUpdatesPerSecond = 0;
        this.lastUpdateTime = performance.now();
        this.updateCount = 0;
    }
    
    initialize() {
        console.log('🖥️ Initializing UI Manager...');
        
        // Setup UI elements
        this.setupUIElements();
        
        // Setup notifications
        this.setupNotifications();
        
        // Setup animations
        this.setupAnimations();
        
        // Setup mobile UI if needed
        if (this.isMobile) {
            this.setupMobileUI();
        }
        
        // Setup responsive design
        this.setupResponsiveDesign();
        
        this.isInitialized = true;
        console.log('✅ UI Manager initialized');
    }
    
    setupUIElements() {
        // Cache frequently used UI elements
        this.uiElements.set('welcomeMessage', document.getElementById('welcome-message'));
        this.uiElements.set('startButton', document.getElementById('start-button'));
        this.uiElements.set('blockPanel', document.getElementById('block-panel'));
        this.uiElements.set('inventoryPanel', document.getElementById('inventory-panel'));
        this.uiElements.set('timeDisplay', document.getElementById('time-display'));
        this.uiElements.set('physicsInfo', document.getElementById('physics-info'));
        this.uiElements.set('soundInfo', document.getElementById('sound-info'));
        this.uiElements.set('controlsHint', document.getElementById('controls-hint'));
        
        // Setup start button
        const startButton = this.uiElements.get('startButton');
        if (startButton) {
            startButton.addEventListener('click', this.handleStartGame.bind(this));
        }
    }
    
    setupNotifications() {
        // Create notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(notificationContainer);
        this.uiElements.set('notificationContainer', notificationContainer);
    }
    
    setupAnimations() {
        // Setup animation frame loop for UI updates
        this.animate();
    }
    
    setupMobileUI() {
        console.log('📱 Setting up mobile UI enhancements');
        
        // Add mobile-specific classes
        document.body.classList.add('mobile-device');
        
        // Optimize touch targets
        this.optimizeTouchTargets();
        
        // Add mobile controls overlay
        this.createMobileControlsOverlay();
    }
    
    optimizeTouchTargets() {
        // Increase touch target sizes for mobile
        const style = document.createElement('style');
        style.textContent = `
            .mobile-device .block-btn {
                min-width: 44px;
                min-height: 44px;
            }
            .mobile-device .inventory-slot {
                min-width: 44px;
                min-height: 44px;
            }
            .mobile-device .sound-toggle {
                min-height: 44px;
                min-width: 44px;
            }
        `;
        document.head.appendChild(style);
    }
    
    createMobileControlsOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-controls-overlay';
        overlay.innerHTML = `
            <div class="mobile-hint-overlay">
                <p>📱 Touch and drag to look around</p>
                <p>🔨 Tap blocks to place them</p>
                <p>📦 Tap inventory slots to select blocks</p>
            </div>
        `;
        
        overlay.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            z-index: 100;
            pointer-events: none;
        `;
        
        document.body.appendChild(overlay);
        
        // Hide after a few seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            }
        }, 5000);
    }
    
    setupResponsiveDesign() {
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Initial responsive setup
        this.handleResize();
    }
    
    handleResize() {
        // Update UI layout based on screen size
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update notification position
        const notificationContainer = this.uiElements.get('notificationContainer');
        if (notificationContainer) {
            if (width < 768) {
                notificationContainer.style.top = '10px';
                notificationContainer.style.right = '10px';
            } else {
                notificationContainer.style.top = '20px';
                notificationContainer.style.right = '20px';
            }
        }
        
        this.updatePerformance();
    }
    
    handleStartGame() {
        // Hide welcome message
        this.hideWelcomeMessage();
        
        // Show game UI
        this.showGameUI();
        
        // Initialize game systems
        this.initializeGameSystems();
        
        // Show welcome notification
        this.showNotification('🎮 SkyWorld started! Have fun!', 'success');
    }
    
    hideWelcomeMessage() {
        const welcomeMessage = this.uiElements.get('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.opacity = '0';
            setTimeout(() => {
                welcomeMessage.style.display = 'none';
            }, this.fadeDuration);
        }
    }
    
    showGameUI() {
        const panels = ['blockPanel', 'inventoryPanel', 'timeDisplay', 'physicsInfo', 'soundInfo', 'controlsHint'];
        
        panels.forEach(panelKey => {
            const panel = this.uiElements.get(panelKey);
            if (panel) {
                panel.style.display = 'block';
                panel.style.opacity = '0';
                
                setTimeout(() => {
                    panel.style.opacity = '1';
                }, 100);
            }
        });
    }
    
    initializeGameSystems() {
        // Initialize game systems in the correct order
        const systems = [
            () => window.AudioSystem && window.AudioSystem.initialize(),
            () => window.InventorySystem && window.InventorySystem.initialize(),
            () => window.PhysicsSystem && window.PhysicsSystem.initialize(),
            () => window.BlockSystem && window.BlockSystem.initialize(),
            () => window.IslandGenerator && window.IslandGenerator.initialize()
        ];
        
        systems.forEach((init, index) => {
            setTimeout(() => {
                try {
                    init();
                } catch (error) {
                    console.warn(`⚠️ Failed to initialize system ${index}:`, error);
                }
            }, index * 200);
        });
    }
    
    showNotification(message, type = 'info', duration = null) {
        const notificationDuration = duration || this.notificationDuration;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = message;
        
        // Style notification
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            pointer-events: auto;
            max-width: 300px;
            word-wrap: break-word;
            font-size: 14px;
            position: relative;
        `;
        
        // Add close button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 8px;
            right: 12px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
        `;
        
        closeButton.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        notification.appendChild(closeButton);
        
        // Add to container
        const container = this.uiElements.get('notificationContainer');
        if (container) {
            container.appendChild(notification);
            this.activeNotifications.push(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            // Auto-hide
            setTimeout(() => {
                this.hideNotification(notification);
            }, notificationDuration);
        }
        
        return notification;
    }
    
    hideNotification(notification) {
        if (!notification || !notification.parentNode) return;
        
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove from active notifications
            const index = this.activeNotifications.indexOf(notification);
            if (index > -1) {
                this.activeNotifications.splice(index, 1);
            }
        }, this.fadeDuration);
    }
    
    getNotificationColor(type) {
        const colors = {
            info: 'rgba(33, 150, 243, 0.9)',
            success: 'rgba(76, 175, 80, 0.9)',
            warning: 'rgba(255, 193, 7, 0.9)',
            error: 'rgba(244, 67, 54, 0.9)',
            debug: 'rgba(156, 39, 176, 0.9)'
        };
        return colors[type] || colors.info;
    }
    
    createParticles(x, y, z, type = 'place') {
        if (!this.isMobile) {
            // Desktop: Use CSS particles
            this.createCSSParticles(x, y, z, type);
        } else {
            // Mobile: Use simpler particles for performance
            this.createSimpleParticles(x, y, z, type);
        }
    }
    
    createCSSParticles(x, y, z, type) {
        const particleCount = type === 'place' ? 5 : 8;
        const colors = {
            place: ['#4CAF50', '#8BC34A', '#CDDC39'],
            land: ['#FF9800', '#FFC107', '#FFEB3B'],
            settle: ['#2196F3', '#03A9F4', '#00BCD4']
        };
        
        const particleColors = colors[type] || colors.place;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${type} particle-${i < particleCount / 2 ? 'small' : 'medium'}`;
            particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
            
            // Position particles based on world coordinates
            const screenX = x * 20 + window.innerWidth / 2;
            const screenY = y * 20 + window.innerHeight / 2;
            
            particle.style.left = screenX + 'px';
            particle.style.top = screenY + 'px';
            
            // Random offset
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            particle.style.transform += ` translate(${offsetX}px, ${offsetY}px)`;
            
            // Add to game container
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }
        }
    }
    
    createSimpleParticles(x, y, z, type) {
        // Simplified particles for mobile performance
        const particleCount = type === 'place' ? 3 : 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: ${type === 'place' ? '#4CAF50' : '#FF9800'};
                border-radius: 50%;
                pointer-events: none;
                z-index: 40;
            `;
            
            // Position
            const screenX = x * 15 + window.innerWidth / 2;
            const screenY = y * 15 + window.innerHeight / 2;
            particle.style.left = screenX + 'px';
            particle.style.top = screenY + 'px';
            
            // Simple fade out animation
            particle.animate([
                { opacity: 1, transform: 'translateY(0px)' },
                { opacity: 0, transform: 'translateY(-20px)' }
            ], { duration: 800, easing: 'ease-out' });
            
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 800);
            }
        }
    }
    
    showLoadingScreen(message = 'Loading...') {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            color: white;
        `;
        
        document.body.appendChild(loadingScreen);
        
        // Add spinner styles
        const spinnerStyle = document.createElement('style');
        spinnerStyle.textContent = `
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #333;
                border-top: 4px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinnerStyle);
        
        return loadingScreen;
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 300);
        }
    }
    
    updateUIElement(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
        }
    }
    
    toggleUIPanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';
            
            if (window.AudioSystem) {
                window.AudioSystem.playClickSound(0.4);
            }
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update performance tracking
        this.updatePerformance();
        
        // Process animation queue
        this.processAnimationQueue();
    }
    
    processAnimationQueue() {
        const now = performance.now();
        this.animationQueue = this.animationQueue.filter(animation => {
            if (now >= animation.startTime) {
                animation.callback();
                return false;
            }
            return true;
        });
    }
    
    scheduleAnimation(callback, delay = 0) {
        this.animationQueue.push({
            callback: callback,
            startTime: performance.now() + delay
        });
    }
    
    updatePerformance() {
        this.updateCount++;
        const now = performance.now();
        
        if (now - this.lastUpdateTime >= 1000) {
            this.uiUpdatesPerSecond = Math.round((this.updateCount * 1000) / (now - this.lastUpdateTime));
            this.updateCount = 0;
            this.lastUpdateTime = now;
        }
    }
    
    // Utility methods
    checkMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    showDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.className = 'debug-panel';
        
        const debugInfo = this.getDebugInfo();
        debugPanel.innerHTML = `
            <h3>🔍 Debug Info</h3>
            <pre>${JSON.stringify(debugInfo, null, 2)}</pre>
        `;
        
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1500;
            max-width: 300px;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        document.body.appendChild(debugPanel);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (debugPanel.parentNode) {
                debugPanel.remove();
            }
        }, 10000);
    }
    
    getDebugInfo() {
        return {
            uiUpdatesPerSecond: this.uiUpdatesPerSecond,
            activeNotifications: this.activeNotifications.length,
            isMobile: this.isMobile,
            isInitialized: this.isInitialized,
            animationQueue: this.animationQueue.length,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
}

// Make UI manager available globally
window.UIManager = UIManager;