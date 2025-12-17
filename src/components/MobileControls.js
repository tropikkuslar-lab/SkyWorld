/**
 * SkyWorld - Mobil Kontroller
 * @author MiniMax Agent
 * @version 2.0
 */

export class MobileControls {
    constructor(camera, player) {
        this.camera = camera;
        this.player = player;
        this.isActive = false;
        this.movement = { forward: false, backward: false, left: false, right: false, jump: false };
        this.touchStartPos = { x: 0, y: 0 };
        this.currentTouch = null;
        this.cameraRotation = { x: 0, y: 0 };
        this.sensitivity = 0.002;
        
        this.init();
    }

    init() {
        this.createControlUI();
        this.setupEventListeners();
        this.isActive = true;
        console.log('Mobile Controls initialized');
    }

    createControlUI() {
        const mobileControls = document.createElement('div');
        mobileControls.id = 'mobile-controls';
        mobileControls.className = 'mobile-controls';
        mobileControls.innerHTML = `
            <div class="movement-controls">
                <div class="control-btn up" data-action="forward">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M7 14l5-5 5 5z"/>
                    </svg>
                </div>
                <div class="control-btn left" data-action="left">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M14 7l-5 5 5 5z"/>
                    </svg>
                </div>
                <div class="control-btn down" data-action="backward">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                    </svg>
                </div>
                <div class="control-btn right" data-action="right">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M10 17l5-5-5-5z"/>
                    </svg>
                </div>
            </div>
            
            <div class="action-controls">
                <div class="control-btn jump" data-action="jump">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <div class="control-btn interact" data-action="interact">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
            </div>
            
            <div class="camera-area" id="camera-area">
                <div class="camera-dot"></div>
            </div>
        `;
        
        document.body.appendChild(mobileControls);
        this.mobileControls = mobileControls;
        
        // Kamera alanını ayarla
        this.cameraArea = document.getElementById('camera-area');
    }

    setupEventListeners() {
        // Dokunma kontrolleri
        this.mobileControls.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.mobileControls.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        this.mobileControls.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
        
        // Buton kontrolleri
        const buttons = this.mobileControls.querySelectorAll('.control-btn');
        buttons.forEach(button => {
            const action = button.dataset.action;
            
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.movement[action] = true;
                button.classList.add('active');
            }, { passive: false });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.movement[action] = false;
                button.classList.remove('active');
            }, { passive: false });
        });
        
        // Kamera kontrolleri
        this.cameraArea.addEventListener('touchstart', (e) => this.onCameraTouchStart(e), { passive: false });
        this.cameraArea.addEventListener('touchmove', (e) => this.onCameraTouchMove(e), { passive: false });
        this.cameraArea.addEventListener('touchend', (e) => this.onCameraTouchEnd(e), { passive: false });
    }

    onTouchStart(e) {
        e.preventDefault();
    }

    onTouchMove(e) {
        e.preventDefault();
    }

    onTouchEnd(e) {
        e.preventDefault();
        // Tüm butonları bırak
        Object.keys(this.movement).forEach(key => {
            this.movement[key] = false;
        });
        
        // Buton stillerini sıfırla
        const buttons = this.mobileControls.querySelectorAll('.control-btn.active');
        buttons.forEach(button => button.classList.remove('active'));
    }

    onCameraTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.touchStartPos = {
            x: touch.clientX,
            y: touch.clientY
        };
        this.currentTouch = touch;
    }

    onCameraTouchMove(e) {
        e.preventDefault();
        
        if (!this.currentTouch) return;
        
        const touch = e.touches[0];
        if (touch !== this.currentTouch) return;
        
        const deltaX = touch.clientX - this.touchStartPos.x;
        const deltaY = touch.clientY - this.touchStartPos.y;
        
        // Kamera rotasyonu güncelle
        this.cameraRotation.y -= deltaX * this.sensitivity;
        this.cameraRotation.x -= deltaY * this.sensitivity;
        
        // X rotasyonunu sınırla (-PI/2 ile PI/2 arası)
        this.cameraRotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.cameraRotation.x));
        
        // Kamera uygula
        this.updateCameraRotation();
        
        // Başlangıç pozisyonunu güncelle
        this.touchStartPos = {
            x: touch.clientX,
            y: touch.clientY
        };
    }

    onCameraTouchEnd(e) {
        e.preventDefault();
        this.currentTouch = null;
    }

    updateCameraRotation() {
        // Kamera rotasyonunu uygula
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.cameraRotation.y;
        this.camera.rotation.x = this.cameraRotation.x;
    }

    getMovement() {
        return { ...this.movement };
    }

    setMovement(action, state) {
        if (this.movement.hasOwnProperty(action)) {
            this.movement[action] = state;
            
            // UI güncelle
            const button = this.mobileControls.querySelector(`[data-action="${action}"]`);
            if (button) {
                if (state) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        }
    }

    setSensitivity(sensitivity) {
        this.sensitivity = Math.max(0.001, Math.min(0.01, sensitivity));
    }

    show() {
        if (this.mobileControls) {
            this.mobileControls.style.display = 'flex';
        }
    }

    hide() {
        if (this.mobileControls) {
            this.mobileControls.style.display = 'none';
        }
    }

    toggle() {
        if (this.isActive) {
            this.hide();
            this.isActive = false;
        } else {
            this.show();
            this.isActive = true;
        }
    }

    destroy() {
        if (this.mobileControls) {
            this.mobileControls.remove();
        }
        this.isActive = false;
        console.log('Mobile Controls destroyed');
    }

    // Debug fonksiyonları
    getDebugInfo() {
        return {
            isActive: this.isActive,
            movement: { ...this.movement },
            cameraRotation: { ...this.cameraRotation },
            sensitivity: this.sensitivity
        };
    }

    reset() {
        // Tüm kontrolleri sıfırla
        Object.keys(this.movement).forEach(key => {
            this.movement[key] = false;
        });
        
        this.cameraRotation = { x: 0, y: 0 };
        this.updateCameraRotation();
        
        // UI güncelle
        const buttons = this.mobileControls.querySelectorAll('.control-btn.active');
        buttons.forEach(button => button.classList.remove('active'));
    }
}