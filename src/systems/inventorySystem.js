/**
 * SkyWorld - Envanter Sistemi
 * @author MiniMax Agent
 * @version 2.0
 */

import { BLOCK_TYPES } from '../constants/blocks.js';

export class InventorySystem {
    constructor() {
        this.slots = new Array(9).fill(null); // 9 slotluk hızlı erişim
        this.selectedSlot = 0;
        this.inventoryOpen = false;
        this.ui = null;
        this.maxStackSize = 64;
    }

    init() {
        this.setupUI();
        this.setupDefaultItems();
        console.log('Inventory System initialized');
    }

    setupUI() {
        // Envanter UI'sini oluştur
        this.createInventoryUI();
        this.createHotbarUI();
    }

    createInventoryUI() {
        // Ana envanter UI'si (gizli başlar)
        const inventoryUI = document.createElement('div');
        inventoryUI.id = 'inventory-ui';
        inventoryUI.className = 'inventory-ui hidden';
        inventoryUI.innerHTML = `
            <div class="inventory-header">
                <h3>Envanter</h3>
                <button id="close-inventory">×</button>
            </div>
            <div class="inventory-content">
                <div class="inventory-grid" id="main-inventory"></div>
            </div>
        `;
        
        document.body.appendChild(inventoryUI);
        
        // Kapatma butonu
        document.getElementById('close-inventory').addEventListener('click', () => {
            this.toggleInventory();
        });
        
        this.inventoryUI = inventoryUI;
    }

    createHotbarUI() {
        // Hızlı erişim çubuğu (her zaman görünür)
        const hotbar = document.createElement('div');
        hotbar.id = 'hotbar';
        hotbar.className = 'hotbar';
        hotbar.innerHTML = `
            <div class="hotbar-slots" id="hotbar-slots"></div>
        `;
        
        document.body.appendChild(hotbar);
        
        // Slotları oluştur
        const slotsContainer = document.getElementById('hotbar-slots');
        for (let i = 0; i < 9; i++) {
            const slot = document.createElement('div');
            slot.className = 'hotbar-slot';
            slot.dataset.slot = i;
            slot.innerHTML = `
                <div class="slot-icon"></div>
                <div class="slot-count"></div>
            `;
            
            slot.addEventListener('click', () => {
                this.selectSlot(i);
            });
            
            slotsContainer.appendChild(slot);
        }
        
        this.hotbar = hotbar;
        this.updateHotbarUI();
    }

    setupDefaultItems() {
        // Başlangıç öğeleri
        this.addItem(BLOCK_TYPES.GRASS, 32);
        this.addItem(BLOCK_TYPES.DIRT, 64);
        this.addItem(BLOCK_TYPES.STONE, 32);
        this.addItem(BLOCK_TYPES.WOOD, 16);
        this.addItem(BLOCK_TYPES.LEAVES, 8);
    }

    addItem(blockType, count = 1) {
        // Mevcut stack'leri kontrol et
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i] && this.slots[i].type === blockType) {
                const slot = this.slots[i];
                const canAdd = Math.min(count, this.maxStackSize - slot.count);
                slot.count += canAdd;
                count -= canAdd;
                
                if (count <= 0) {
                    this.updateSlotUI(i);
                    return true;
                }
            }
        }
        
        // Yeni slot'a ekle
        for (let i = 0; i < this.slots.length && count > 0; i++) {
            if (!this.slots[i]) {
                const canAdd = Math.min(count, this.maxStackSize);
                this.slots[i] = { type: blockType, count: canAdd };
                count -= canAdd;
                this.updateSlotUI(i);
            }
        }
        
        return count <= 0;
    }

    removeItem(blockType, count = 1) {
        for (let i = 0; i < this.slots.length && count > 0; i++) {
            if (this.slots[i] && this.slots[i].type === blockType) {
                const slot = this.slots[i];
                const removeCount = Math.min(count, slot.count);
                slot.count -= removeCount;
                count -= removeCount;
                
                if (slot.count <= 0) {
                    this.slots[i] = null;
                }
                
                this.updateSlotUI(i);
            }
        }
        
        return count <= 0;
    }

    getItemCount(blockType) {
        let total = 0;
        for (const slot of this.slots) {
            if (slot && slot.type === blockType) {
                total += slot.count;
            }
        }
        return total;
    }

    getSelectedBlock() {
        const selectedSlot = this.slots[this.selectedSlot];
        return selectedSlot ? selectedSlot.type : BLOCK_TYPES.AIR;
    }

    selectSlot(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) return;
        
        // Eski slot'u işaretle
        const oldSlot = this.hotbar.querySelector(`[data-slot="${this.selectedSlot}"]`);
        if (oldSlot) {
            oldSlot.classList.remove('selected');
        }
        
        // Yeni slot'u seç
        this.selectedSlot = slotIndex;
        const newSlot = this.hotbar.querySelector(`[data-slot="${slotIndex}"]`);
        if (newSlot) {
            newSlot.classList.add('selected');
        }
        
        console.log(`Selected slot: ${slotIndex}, Block: ${this.getSelectedBlock()}`);
    }

    updateSlotUI(slotIndex) {
        const slot = this.slots[slotIndex];
        const slotElement = this.hotbar.querySelector(`[data-slot="${slotIndex}"]`);
        
        if (!slotElement) return;
        
        const iconElement = slotElement.querySelector('.slot-icon');
        const countElement = slotElement.querySelector('.slot-count');
        
        if (slot) {
            // İkon göster
            iconElement.innerHTML = this.getBlockIcon(slot.type);
            iconElement.style.display = 'block';
            
            // Sayı göster (sadece 1'den fazlaysa)
            if (slot.count > 1) {
                countElement.textContent = slot.count;
                countElement.style.display = 'block';
            } else {
                countElement.style.display = 'none';
            }
        } else {
            // Slot boş
            iconElement.innerHTML = '';
            iconElement.style.display = 'none';
            countElement.style.display = 'none';
        }
    }

    updateHotbarUI() {
        for (let i = 0; i < this.slots.length; i++) {
            this.updateSlotUI(i);
        }
        
        // Seçili slot'u vurgula
        this.selectSlot(this.selectedSlot);
    }

    getBlockIcon(blockType) {
        const icons = {
            [BLOCK_TYPES.AIR]: '',
            [BLOCK_TYPES.GRASS]: '🌱',
            [BLOCK_TYPES.DIRT]: '🟫',
            [BLOCK_TYPES.STONE]: '⬜',
            [BLOCK_TYPES.WOOD]: '🟫',
            [BLOCK_TYPES.LEAVES]: '🍃',
            [BLOCK_TYPES.WATER]: '💧',
            [BLOCK_TYPES.SAND]: '🟨'
        };
        
        return icons[blockType] || '❓';
    }

    toggleInventory() {
        this.inventoryOpen = !this.inventoryOpen;
        
        if (this.inventoryOpen) {
            this.inventoryUI.classList.remove('hidden');
            this.updateInventoryUI();
        } else {
            this.inventoryUI.classList.add('hidden');
        }
    }

    updateInventoryUI() {
        // Ana envanter UI'sini güncelle
        const inventoryGrid = document.getElementById('main-inventory');
        if (inventoryGrid) {
            inventoryGrid.innerHTML = '';
            
            // Tüm slotları göster (şimdilik hızlı erişim)
            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots[i];
                const slotElement = document.createElement('div');
                slotElement.className = 'inventory-slot';
                slotElement.innerHTML = `
                    <div class="slot-icon">${slot ? this.getBlockIcon(slot.type) : ''}</div>
                    <div class="slot-count">${slot && slot.count > 1 ? slot.count : ''}</div>
                `;
                inventoryGrid.appendChild(slotElement);
            }
        }
    }

    // Klavye kısayolları
    handleKeyPress(key) {
        // Sayı tuşları (1-9)
        const slotNumber = parseInt(key) - 1;
        if (slotNumber >= 0 && slotNumber < 9) {
            this.selectSlot(slotNumber);
            return true;
        }
        
        // Tab tuşu (sonraki slot)
        if (key === 'Tab') {
            const nextSlot = (this.selectedSlot + 1) % this.slots.length;
            this.selectSlot(nextSlot);
            return true;
        }
        
        return false;
    }

    update() {
        // UI güncellemeleri (eğer gerekirse)
    }

    // Debug fonksiyonları
    getInventoryState() {
        return {
            slots: this.slots.map(slot => slot ? { ...slot } : null),
            selectedSlot: this.selectedSlot,
            inventoryOpen: this.inventoryOpen
        };
    }

    debugAddAllBlocks() {
        Object.values(BLOCK_TYPES).forEach(blockType => {
            if (blockType !== BLOCK_TYPES.AIR) {
                this.addItem(blockType, 16);
            }
        });
        this.updateHotbarUI();
        console.log('Tüm blok tipleri eklendi');
    }
}