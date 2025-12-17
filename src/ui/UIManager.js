/**
 * SkyWorld - Kullanıcı Arayüzü Bileşenleri
 * @author MiniMax Agent
 * @version 2.0
 */

export class UIManager {
    constructor() {
        this.elements = new Map();
        this.styles = this.getDefaultStyles();
        this.init();
    }

    init() {
        this.createMainUI();
        this.createMenuUI();
        this.createSettingsUI();
        this.createHUD();
        console.log('UI Manager initialized');
    }

    createMainUI() {
        // Ana oyun UI'si
        const gameUI = document.createElement('div');
        gameUI.id = 'game-ui';
        gameUI.className = 'game-ui';
        gameUI.innerHTML = `
            <div class="ui-top-bar">
                <div class="ui-stats">
                    <div class="stat-item">
                        <span class="stat-label">FPS:</span>
                        <span class="stat-value" id="fps-counter">60</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Time:</span>
                        <span class="stat-value" id="time-display">12:00</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Position:</span>
                        <span class="stat-value" id="position-display">0, 0, 0</span>
                    </div>
                </div>
                
                <div class="ui-controls">
                    <button class="ui-btn" id="menu-btn">☰</button>
                    <button class="ui-btn" id="settings-btn">⚙</button>
                    <button class="ui-btn" id="inventory-btn">📦</button>
                </div>
            </div>
            
            <div class="ui-crosshair">
                <div class="crosshair-line horizontal"></div>
                <div class="crosshair-line vertical"></div>
            </div>
        `;
        
        document.body.appendChild(gameUI);
        this.elements.set('game-ui', gameUI);
        
        // Buton event listener'ları
        document.getElementById('menu-btn').addEventListener('click', () => this.showMenu());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('inventory-btn').addEventListener('click', () => this.toggleInventory());
    }

    createMenuUI() {
        const menu = document.createElement('div');
        menu.id = 'menu-ui';
        menu.className = 'menu-ui hidden';
        menu.innerHTML = `
            <div class="menu-content">
                <h1>SkyWorld</h1>
                <div class="menu-buttons">
                    <button class="menu-btn" id="resume-btn">Devam Et</button>
                    <button class="menu-btn" id="new-world-btn">Yeni Dünya</button>
                    <button class="menu-btn" id="save-btn">Kaydet</button>
                    <button class="menu-btn" id="load-btn">Yükle</button>
                    <button class="menu-btn" id="settings-menu-btn">Ayarlar</button>
                    <button class="menu-btn danger" id="quit-btn">Çıkış</button>
                </div>
                <div class="menu-footer">
                    <p>SkyWorld v2.0 - MiniMax Agent</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(menu);
        this.elements.set('menu-ui', menu);
        
        // Menu event listener'ları
        document.getElementById('resume-btn').addEventListener('click', () => this.hideMenu());
        document.getElementById('new-world-btn').addEventListener('click', () => this.newWorld());
        document.getElementById('save-btn').addEventListener('click', () => this.saveGame());
        document.getElementById('load-btn').addEventListener('click', () => this.loadGame());
        document.getElementById('settings-menu-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('quit-btn').addEventListener('click', () => this.quitGame());
    }

    createSettingsUI() {
        const settings = document.createElement('div');
        settings.id = 'settings-ui';
        settings.className = 'settings-ui hidden';
        settings.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <h2>Ayarlar</h2>
                    <button class="close-btn" id="close-settings">×</button>
                </div>
                
                <div class="settings-section">
                    <h3>Grafik</h3>
                    <div class="setting-item">
                        <label>Görüntü Kalitesi:</label>
                        <select id="graphics-quality">
                            <option value="low">Düşük</option>
                            <option value="medium" selected>Orta</option>
                            <option value="high">Yüksek</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label>Gölgeler:</label>
                        <input type="checkbox" id="shadows-enabled" checked>
                    </div>
                    <div class="setting-item">
                        <label>FPS Limiti:</label>
                        <select id="fps-limit">
                            <option value="30">30 FPS</option>
                            <option value="60" selected>60 FPS</option>
                            <option value="120">120 FPS</option>
                            <option value="unlimited">Sınırsız</option>
                        </select>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>Ses</h3>
                    <div class="setting-item">
                        <label>Genel Ses:</label>
                        <input type="range" id="master-volume" min="0" max="100" value="50">
                        <span class="value-display">50%</span>
                    </div>
                    <div class="setting-item">
                        <label>Müzik:</label>
                        <input type="range" id="music-volume" min="0" max="100" value="30">
                        <span class="value-display">30%</span>
                    </div>
                    <div class="setting-item">
                        <label>Efektler:</label>
                        <input type="range" id="sfx-volume" min="0" max="100" value="70">
                        <span class="value-display">70%</span>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>Kontroller</h3>
                    <div class="setting-item">
                        <label>Mouse Hassasiyeti:</label>
                        <input type="range" id="mouse-sensitivity" min="1" max="10" value="5">
                        <span class="value-display">5</span>
                    </div>
                    <div class="setting-item">
                        <label>Ters Y Eksen:</label>
                        <input type="checkbox" id="invert-y">
                    </div>
                    <div class="setting-item">
                        <label>Tuş Atamaları:</label>
                        <button class="menu-btn" id="key-bindings-btn">Yeniden Atama</button>
                    </div>
                </div>
                
                <div class="settings-footer">
                    <button class="menu-btn" id="reset-settings-btn">Varsayılanlara Dön</button>
                    <button class="menu-btn primary" id="apply-settings-btn">Uygula</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(settings);
        this.elements.set('settings-ui', settings);
        
        // Settings event listener'ları
        document.getElementById('close-settings').addEventListener('click', () => this.hideSettings());
        document.getElementById('apply-settings-btn').addEventListener('click', () => this.applySettings());
        document.getElementById('reset-settings-btn').addEventListener('click', () => this.resetSettings());
        
        // Slider event listener'ları
        this.setupSliderListeners();
    }

    setupSliderListeners() {
        const sliders = ['master-volume', 'music-volume', 'sfx-volume', 'mouse-sensitivity'];
        
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            const valueDisplay = slider.parentNode.querySelector('.value-display');
            
            slider.addEventListener('input', () => {
                if (valueDisplay) {
                    valueDisplay.textContent = slider.value + (slider.type === 'range' && sliderId !== 'mouse-sensitivity' ? '%' : '');
                }
            });
        });
    }

    createHUD() {
        // HUD elementleri
        this.createMessageSystem();
        this.createLoadingScreen();
        this.createNotificationSystem();
    }

    createMessageSystem() {
        const messageSystem = document.createElement('div');
        messageSystem.id = 'message-system';
        messageSystem.className = 'message-system';
        
        document.body.appendChild(messageSystem);
        this.elements.set('message-system', messageSystem);
    }

    createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.className = 'loading-screen hidden';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h2>Yükleniyor...</h2>
                <div class="loading-progress">
                    <div class="progress-bar" id="loading-progress-bar"></div>
                </div>
                <p class="loading-text" id="loading-text">Hazırlanıyor</p>
            </div>
        `;
        
        document.body.appendChild(loadingScreen);
        this.elements.set('loading-screen', loadingScreen);
    }

    createNotificationSystem() {
        const notificationSystem = document.createElement('div');
        notificationSystem.id = 'notification-system';
        notificationSystem.className = 'notification-system';
        
        document.body.appendChild(notificationSystem);
        this.elements.set('notification-system', notificationSystem);
    }

    // UI Kontrol Metodları
    showMenu() {
        this.hideAll();
        this.elements.get('menu-ui').classList.remove('hidden');
    }

    hideMenu() {
        this.elements.get('menu-ui').classList.add('hidden');
        this.elements.get('game-ui').style.display = 'flex';
    }

    showSettings() {
        this.hideAll();
        this.elements.get('settings-ui').classList.remove('hidden');
    }

    hideSettings() {
        this.elements.get('settings-ui').classList.add('hidden');
        this.elements.get('game-ui').style.display = 'flex';
    }

    toggleInventory() {
        // Inventory sistemi ile iletişim kuracak
        const event = new CustomEvent('toggle-inventory');
        document.dispatchEvent(event);
    }

    hideAll() {
        this.elements.forEach((element, id) => {
            if (id !== 'game-ui') {
                element.classList.add('hidden');
            }
        });
        this.elements.get('game-ui').style.display = 'none';
    }

    showLoading(text = 'Yükleniyor...') {
        const loadingScreen = this.elements.get('loading-screen');
        const loadingText = document.getElementById('loading-text');
        loadingText.textContent = text;
        loadingScreen.classList.remove('hidden');
    }

    hideLoading() {
        this.elements.get('loading-screen').classList.add('hidden');
    }

    updateLoadingProgress(progress, text) {
        const progressBar = document.getElementById('loading-progress-bar');
        const loadingText = document.getElementById('loading-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (loadingText && text) {
            loadingText.textContent = text;
        }
    }

    showMessage(text, type = 'info', duration = 3000) {
        const messageSystem = this.elements.get('message-system');
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.textContent = text;
        
        messageSystem.appendChild(message);
        
        // Animasyon
        setTimeout(() => message.classList.add('show'), 10);
        
        // Kaldır
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 300);
        }, duration);
    }

    showNotification(text, type = 'info') {
        const notificationSystem = this.elements.get('notification-system');
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-text">${text}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        notificationSystem.appendChild(notification);
        
        // Kapatma butonu
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Otomatik kaldır
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    removeNotification(notification) {
        notification.classList.add('removing');
        setTimeout(() => notification.remove(), 300);
    }

    updateStats(stats) {
        const fpsCounter = document.getElementById('fps-counter');
        const timeDisplay = document.getElementById('time-display');
        const positionDisplay = document.getElementById('position-display');
        
        if (fpsCounter) fpsCounter.textContent = Math.round(stats.fps || 0);
        if (timeDisplay) timeDisplay.textContent = stats.timeOfDay || '00:00';
        if (positionDisplay) {
            const pos = stats.position || { x: 0, y: 0, z: 0 };
            positionDisplay.textContent = `${Math.round(pos.x)}, ${Math.round(pos.y)}, ${Math.round(pos.z)}`;
        }
    }

    // Oyun kontrolleri
    newWorld() {
        this.showLoading('Yeni dünya oluşturuluyor...');
        const event = new CustomEvent('new-world');
        document.dispatchEvent(event);
    }

    saveGame() {
        this.showMessage('Oyun kaydedildi', 'success');
        const event = new CustomEvent('save-game');
        document.dispatchEvent(event);
    }

    loadGame() {
        this.showLoading('Oyun yükleniyor...');
        const event = new CustomEvent('load-game');
        document.dispatchEvent(event);
    }

    quitGame() {
        this.showMessage('Oyun kapatılıyor...', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    applySettings() {
        this.showMessage('Ayarlar uygulandı', 'success');
        const event = new CustomEvent('apply-settings', {
            detail: this.getCurrentSettings()
        });
        document.dispatchEvent(event);
    }

    resetSettings() {
        this.showMessage('Ayarlar sıfırlandı', 'info');
        this.resetToDefaults();
    }

    getCurrentSettings() {
        return {
            graphics: {
                quality: document.getElementById('graphics-quality').value,
                shadows: document.getElementById('shadows-enabled').checked,
                fpsLimit: document.getElementById('fps-limit').value
            },
            audio: {
                masterVolume: document.getElementById('master-volume').value,
                musicVolume: document.getElementById('music-volume').value,
                sfxVolume: document.getElementById('sfx-volume').value
            },
            controls: {
                mouseSensitivity: document.getElementById('mouse-sensitivity').value,
                invertY: document.getElementById('invert-y').checked
            }
        };
    }

    resetToDefaults() {
        // Varsayılan değerlere dön
        document.getElementById('graphics-quality').value = 'medium';
        document.getElementById('shadows-enabled').checked = true;
        document.getElementById('fps-limit').value = '60';
        document.getElementById('master-volume').value = 50;
        document.getElementById('music-volume').value = 30;
        document.getElementById('sfx-volume').value = 70;
        document.getElementById('mouse-sensitivity').value = 5;
        document.getElementById('invert-y').checked = false;
        
        // Value display'leri güncelle
        this.setupSliderListeners();
    }

    getDefaultStyles() {
        return `
            /* UI Stilleri CSS olarak eklenecek */
        `;
    }

    destroy() {
        // Tüm UI elementlerini temizle
        this.elements.forEach((element, id) => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.elements.clear();
        console.log('UI Manager destroyed');
    }
}