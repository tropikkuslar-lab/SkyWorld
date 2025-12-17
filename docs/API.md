# SkyWorld - API Dokümantasyonu

## 🎯 Genel Bakış

SkyWorld API'si modüler yapısı sayesinde her sistem için ayrı interface'lere sahiptir. Bu dokümantasyon tüm public API'leri ve kullanım örneklerini içerir.

## 🚀 Ana Sistemler

### Core Engine API

#### SkyWorldCore
Ana oyun motoru sınıfı.

```javascript
class SkyWorldCore {
    constructor()
    initialize()
    addBlock(x, y, z, blockType)
    removeBlock(block)
    getAllBlocks()
    pauseGame()
    resumeGame()
    togglePause()
    getPerformanceInfo()
}
```

**Methods:**
- `initialize()` - Oyun motorunu başlatır
- `addBlock(x, y, z, blockType)` - Blok ekler
- `removeBlock(block)` - Blok kaldırır
- `pauseGame()` - Oyunu duraklatır
- `resumeGame()` - Oyunu devam ettirir
- `togglePause()` - Pause durumunu değiştirir
- `getPerformanceInfo()` - Performans bilgilerini döndürür

### Audio System API

#### AudioManager
Ses sistemi yöneticisi.

```javascript
class AudioManager {
    constructor()
    initialize()
    playBlockSound(blockType, volume)
    playClickSound(volume)
    playSuccessSound()
    playErrorSound()
    playBackgroundMusic()
    stopBackgroundMusic()
    toggleAudio()
    setVolume(type, volume)
    getAudioInfo()
}
```

**Methods:**
- `initialize()` - Audio sistemini başlatır
- `playBlockSound(blockType, volume)` - Blok sesini çalar
- `playClickSound(volume)` - Click sesini çalar
- `playSuccessSound()` - Başarı sesini çalar
- `playErrorSound()` - Hata sesini çalar
- `playBackgroundMusic()` - Arka plan müziğini başlatır
- `toggleAudio()` - Audio durumunu değiştirir
- `setVolume(type, volume)` - Ses seviyesini ayarlar

**Usage Examples:**
```javascript
// Blok sesi çal
window.AudioSystem.playBlockSound('grass', 1.0);

// Ses sistemini aç/kapat
window.AudioSystem.toggleAudio();

// Ses seviyesini ayarla
window.AudioSystem.setVolume('sfx', 0.5);
```

### Physics System API

#### PhysicsEngine
Fizik motoru yöneticisi.

```javascript
class PhysicsEngine {
    constructor()
    initialize()
    update(fallingBlocks, placedBlocks, scene)
    togglePhysics()
    setGravity(value)
    setFriction(value)
    applyImpulse(block, force, direction)
    makeBlockFall(block, fallingBlocks, placedBlocks)
    getPhysicsInfo()
}
```

**Methods:**
- `togglePhysics()` - Fizik sistemini aç/kapat
- `setGravity(value)` - Yerçekimi değerini ayarla
- `applyImpulse(block, force, direction)` - Bloka kuvvet uygula
- `makeBlockFall(block, fallingBlocks, placedBlocks)` - Blok düşürme

**Usage Examples:**
```javascript
// Fizik sistemini aç/kapat
window.PhysicsSystem.togglePhysics();

// Yerçekimi ayarla
window.PhysicsSystem.setGravity(0.8);

// Bloku düşür
window.PhysicsSystem.makeBlockFall(block, fallingBlocks, placedBlocks);
```

### Inventory System API

#### InventoryManager
Envanter sistemi yöneticisi.

```javascript
class InventoryManager {
    constructor()
    initialize()
    selectSlot(slotIndex)
    addItem(blockType, amount)
    removeItem(blockType, amount)
    canPlaceBlock(blockType, amount)
    getSelectedItem()
    getItemCount(blockType)
    getInventoryStats()
}
```

**Methods:**
- `selectSlot(slotIndex)` - Slot seçimi
- `addItem(blockType, amount)` - Eşya ekleme
- `removeItem(blockType, amount)` - Eşya çıkarma
- `canPlaceBlock(blockType, amount)` - Yerleştirme kontrolü
- `getSelectedItem()` - Seçili eşya
- `getItemCount(blockType)` - Eşya sayısı

**Usage Examples:**
```javascript
// 5 çimen bloğu ekle
window.InventorySystem.addItem('grass', 5);

// Seçili slot değiştir
window.InventorySystem.selectSlot(2);

// Çimen bloğu sayısını kontrol et
const grassCount = window.InventorySystem.getItemCount('grass');
```

### Block System API

#### BlockSystem
Blok sistemi yöneticisi.

```javascript
class BlockSystem {
    constructor()
    initialize()
    createBlock(x, y, z, blockType)
    placeBlock(x, y, z, blockType)
    removeBlock(block)
    selectBlockType(blockType)
    getSelectedBlockType()
    getBlockTypeData(blockType)
    getAllBlockTypes()
}
```

**Methods:**
- `createBlock(x, y, z, blockType)` - Blok oluşturma
- `placeBlock(x, y, z, blockType)` - Blok yerleştirme
- `selectBlockType(blockType)` - Blok tipi seçimi
- `getSelectedBlockType()` - Seçili blok tipi

**Usage Examples:**
```javascript
// Blok oluştur
const block = window.BlockSystem.createBlock(0, 5, 0, 'stone');

// Blok tipi seç
window.BlockSystem.selectBlockType('wood');

// Tüm blok tiplerini al
const allTypes = window.BlockSystem.getAllBlockTypes();
```

### UI System API

#### UIManager
Kullanıcı arayüzü yöneticisi.

```javascript
class UIManager {
    constructor()
    initialize()
    showNotification(message, type, duration)
    createParticles(x, y, z, type)
    toggleUIPanel(panelId)
    updateUIElement(elementId, content)
    showLoadingScreen(message)
    hideLoadingScreen()
}
```

**Methods:**
- `showNotification(message, type, duration)` - Bildirim göster
- `createParticles(x, y, z, type)` - Parçacık oluştur
- `toggleUIPanel(panelId)` - UI paneli aç/kapat
- `updateUIElement(elementId, content)` - UI element güncelle

**Usage Examples:**
```javascript
// Bildirim göster
window.UIManager.showNotification('Blok yerleştirildi!', 'success', 3000);

// Parçacık oluştur
window.UIManager.createParticles(0, 5, 0, 'place');

// UI paneli aç/kapat
window.UIManager.toggleUIPanel('inventory-panel');
```

### Controls System API

#### ControlsManager
Kontrol sistemi yöneticisi.

```javascript
class ControlsManager {
    constructor()
    initialize()
    setMovementSpeed(speed)
    setMouseSensitivity(sensitivity)
    setTouchSensitivity(sensitivity)
    invertYAxis(invert)
    enablePointerLockMode(enable)
    getPlayerPosition()
    getCameraRotation()
    getControlsInfo()
}
```

**Methods:**
- `setMovementSpeed(speed)` - Hareket hızı ayarla
- `setMouseSensitivity(sensitivity)` - Mouse hassasiyeti
- `setTouchSensitivity(sensitivity)` - Touch hassasiyeti
- `getPlayerPosition()` - Oyuncu pozisyonu

**Usage Examples:**
```javascript
// Hareket hızını ayarla
window.ControlsManager.setMovementSpeed(2.0);

// Mouse hassasiyetini ayarla
window.ControlsManager.setMouseSensitivity(0.02);

// Oyuncu pozisyonunu al
const position = window.ControlsManager.getPlayerPosition();
```

### Island Generator API

#### IslandGenerator
Ada oluşturucu sistemi.

```javascript
class IslandGenerator {
    constructor()
    initialize()
    createAllIslands(scene)
    addCustomIsland(x, y, z, radius, color, name)
    removeIsland(island)
    getIslandByName(name)
    getStructureByName(name)
}
```

**Methods:**
- `createAllIslands(scene)` - Tüm adaları oluştur
- `addCustomIsland(x, y, z, radius, color, name)` - Özel ada ekle
- `removeIsland(island)` - Ada kaldır
- `getIslandByName(name)` - Ada bul

**Usage Examples:**
```javascript
// Özel ada ekle
const island = window.IslandGenerator.addCustomIsland(10, 12, 10, 3, 0x228B22, 'Custom Island');

// Ada bul
const forestIsland = window.IslandGenerator.getIslandByName('Forest Island');
```

## 📊 Constants API

### Block Types
```javascript
const BLOCK_TYPES = {
    grass: {
        color: 0x228B22,
        name: 'Grass',
        density: 0.8,
        breakable: true,
        sound: 'grass'
    },
    stone: {
        color: 0x696969,
        name: 'Stone',
        density: 2.5,
        breakable: true,
        sound: 'stone'
    },
    // ... diğer blok tipleri
};
```

### Audio Constants
```javascript
const AUDIO_CONSTANTS = {
    BLOCK_SOUNDS: {
        grass: [200, 220],
        stone: [150, 180],
        wood: [250, 280],
        iron: [400, 450],
        diamond: [600, 700],
        lava: [100, 120]
    },
    VOLUME_LEVELS: {
        master: 0.7,
        sfx: 0.3,
        music: 0.1
    }
};
```

### Physics Constants
```javascript
const PHYSICS_CONSTANTS = {
    GRAVITY: 0.5,
    FRICTION: 0.98,
    MAX_FALL_DISTANCE: 50,
    COLLISION_CHECK_RADIUS: 0.6
};
```

## 🔧 Utility Functions

### Math Utilities
```javascript
// Distance calculation
function distance3D(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2) +
        Math.pow(z2 - z1, 2)
    );
}

// Grid snapping
function snapToGrid(value) {
    return Math.round(value);
}
```

### String Utilities
```javascript
// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Block name formatting
function formatBlockName(blockType) {
    return blockType.split('_')
        .map(word => capitalize(word))
        .join(' ');
}
```

## 📱 Mobile API

### Mobile Detection
```javascript
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
```

### Touch Events
```javascript
// Touch event handlers
function handleTouchStart(event) {
    // Touch start logic
}

function handleTouchMove(event) {
    // Touch move logic
}

function handleTouchEnd(event) {
    // Touch end logic
}
```

## 🎮 Event System

### Custom Events
```javascript
// Custom event names
const GAME_EVENTS = {
    BLOCK_PLACED: 'block:placed',
    BLOCK_REMOVED: 'block:removed',
    PHYSICS_TOGGLED: 'physics:toggled',
    AUDIO_TOGGLED: 'audio:toggled',
    INVENTORY_UPDATED: 'inventory:updated'
};

// Event listener
document.addEventListener(GAME_EVENTS.BLOCK_PLACED, (event) => {
    console.log('Block placed:', event.detail);
});

// Event dispatcher
function emitBlockPlaced(blockData) {
    const event = new CustomEvent(GAME_EVENTS.BLOCK_PLACED, {
        detail: blockData
    });
    document.dispatchEvent(event);
}
```

## 🔍 Debug API

### Debug Information
```javascript
function getDebugInfo() {
    return {
        performance: window.SkyWorld.getPerformanceInfo(),
        audio: window.AudioSystem.getAudioInfo(),
        physics: window.PhysicsSystem.getPhysicsInfo(),
        inventory: window.InventorySystem.getInventoryStats(),
        blocks: window.BlockSystem.getDebugInfo()
    };
}

// Show debug panel
function showDebugPanel() {
    const debugInfo = getDebugInfo();
    console.table(debugInfo);
}
```

## 🚀 Performance API

### Performance Monitoring
```javascript
// FPS tracking
function trackFPS() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    function measure() {
        frameCount++;
        const now = performance.now();
        
        if (now - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (now - lastTime));
            console.log(`FPS: ${fps}`);
            
            frameCount = 0;
            lastTime = now;
        }
        
        requestAnimationFrame(measure);
    }
    
    measure();
}

// Memory usage
function getMemoryUsage() {
    if (performance.memory) {
        return {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
    }
    return null;
}
```

## 📋 Best Practices

### API Usage
1. **Always check if system is initialized**
2. **Use proper error handling**
3. **Follow naming conventions**
4. **Document custom implementations**

### Performance Tips
1. **Minimize API calls in loops**
2. **Cache frequently accessed data**
3. **Use requestAnimationFrame for animations**
4. **Implement proper cleanup**

### Mobile Considerations
1. **Use touch events appropriately**
2. **Optimize for smaller screens**
3. **Handle orientation changes**
4. **Test on actual devices**

---

**SkyWorld v9.0** - Kapsamlı API Dokümantasyonu
*Son güncelleme: 2025-12-17*