/**
 * SkyWorld v9.0 - Inventory Manager
 * Handles advanced inventory system with stack management
 */

class InventoryManager {
    constructor() {
        // Inventory structure
        this.inventory = {
            slots: Array(25).fill(null), // 5x5 grid
            maxStackSize: 64,
            selectedSlot: 0
        };
        
        // Starting items
        this.startingItems = {
            grass: 20,
            stone: 15,
            wood: 10,
            iron: 5,
            diamond: 2,
            lava: 8
        };
        
        // UI elements
        this.inventoryContainer = null;
        this.slotElements = [];
        
        // Inventory statistics
        this.totalItems = 0;
        this.usedSlots = 0;
        this.emptySlots = 25;
        
        this.isInitialized = false;
    }
    
    initialize() {
        console.log('📦 Initializing Inventory System...');
        
        // Initialize with starting items
        this.setupStartingItems();
        
        // Setup UI
        this.setupInventoryUI();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.isInitialized = true;
        this.updateStats();
        console.log('✅ Inventory System initialized');
    }
    
    setupStartingItems() {
        Object.entries(this.startingItems).forEach(([blockType, count]) => {
            this.addItem(blockType, count);
        });
    }
    
    setupInventoryUI() {
        this.inventoryContainer = document.getElementById('advanced-inventory');
        if (!this.inventoryContainer) {
            console.error('❌ Inventory container not found');
            return;
        }
        
        // Clear existing slots
        this.inventoryContainer.innerHTML = '';
        this.slotElements = [];
        
        // Create 25 slots (5x5 grid)
        for (let i = 0; i < 25; i++) {
            const slot = this.createSlotElement(i);
            this.inventoryContainer.appendChild(slot);
            this.slotElements.push(slot);
        }
        
        // Select first slot
        this.selectSlot(0);
    }
    
    createSlotElement(index) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.dataset.slot = index;
        
        // Add click event
        slot.addEventListener('click', () => {
            this.selectSlot(index);
            if (window.AudioSystem) {
                window.AudioSystem.playClickSound();
            }
        });
        
        // Add hover events for tooltips
        slot.addEventListener('mouseenter', () => {
            this.showSlotTooltip(slot, index);
        });
        
        slot.addEventListener('mouseleave', () => {
            this.hideSlotTooltip();
        });
        
        return slot;
    }
    
    selectSlot(slotIndex) {
        // Remove selection from all slots
        this.slotElements.forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Select new slot
        if (this.slotElements[slotIndex]) {
            this.slotElements[slotIndex].classList.add('selected');
        }
        
        this.inventory.selectedSlot = slotIndex;
        
        // Update selected block type in UI panel
        this.updateBlockSelection();
        
        console.log(`📦 Selected slot ${slotIndex}`);
    }
    
    updateBlockSelection() {
        const selectedItem = this.inventory.slots[this.inventory.selectedSlot];
        
        if (selectedItem && window.BlockSystem) {
            // Update block selection in UI panel
            const blockButtons = document.querySelectorAll('.block-btn');
            blockButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            const activeBtn = document.querySelector(`[data-block="${selectedItem.type}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
            
            // Update global selected block type
            if (window.BlockSystem) {
                window.BlockSystem.setSelectedBlockType(selectedItem.type);
            }
        }
    }
    
    addItem(blockType, amount = 1) {
        let remainingAmount = amount;
        let addedToExisting = 0;
        let addedToNew = 0;
        
        // Try to stack with existing blocks first
        for (let i = 0; i < this.inventory.slots.length && remainingAmount > 0; i++) {
            const slot = this.inventory.slots[i];
            if (slot && slot.type === blockType && slot.count < this.inventory.maxStackSize) {
                const spaceLeft = this.inventory.maxStackSize - slot.count;
                const amountToAdd = Math.min(remainingAmount, spaceLeft);
                slot.count += amountToAdd;
                remainingAmount -= amountToAdd;
                addedToExisting += amountToAdd;
            }
        }
        
        // Add to empty slots if still have items
        if (remainingAmount > 0) {
            for (let i = 0; i < this.inventory.slots.length && remainingAmount > 0; i++) {
                if (!this.inventory.slots[i]) {
                    const amountToAdd = Math.min(remainingAmount, this.inventory.maxStackSize);
                    this.inventory.slots[i] = { type: blockType, count: amountToAdd };
                    remainingAmount -= amountToAdd;
                    addedToNew += amountToAdd;
                }
            }
        }
        
        // Update UI and stats
        this.updateInventoryDisplay();
        this.updateStats();
        
        const totalAdded = addedToExisting + addedToNew;
        console.log(`📦 Added ${totalAdded} ${blockType} blocks (${addedToExisting} stacked, ${addedToNew} new slots)`);
        
        if (remainingAmount > 0) {
            console.warn(`⚠️ Could not add ${remainingAmount} ${blockType} blocks (inventory full)`);
            if (window.AudioSystem) {
                window.AudioSystem.playErrorSound();
            }
            return false;
        }
        
        if (window.AudioSystem) {
            window.AudioSystem.playSuccessSound();
        }
        
        return true;
    }
    
    removeItem(blockType, amount = 1) {
        let remainingAmount = amount;
        let removed = 0;
        
        for (let i = 0; i < this.inventory.slots.length && remainingAmount > 0; i++) {
            const slot = this.inventory.slots[i];
            if (slot && slot.type === blockType) {
                const toRemove = Math.min(remainingAmount, slot.count);
                slot.count -= toRemove;
                remainingAmount -= toRemove;
                removed += toRemove;
                
                if (slot.count <= 0) {
                    this.inventory.slots[i] = null;
                }
            }
        }
        
        // Update UI and stats
        this.updateInventoryDisplay();
        this.updateStats();
        
        console.log(`📤 Removed ${removed} ${blockType} blocks`);
        
        if (window.AudioSystem && removed > 0) {
            window.AudioSystem.playClickSound(0.7);
        }
        
        return removed;
    }
    
    canPlaceBlock(blockType, amount = 1) {
        // Check if we have enough items
        let availableCount = 0;
        
        this.inventory.slots.forEach(slot => {
            if (slot && slot.type === blockType) {
                availableCount += slot.count;
            }
        });
        
        return availableCount >= amount;
    }
    
    updateInventoryDisplay() {
        this.slotElements.forEach((slotElement, index) => {
            // Clear slot
            slotElement.innerHTML = '';
            slotElement.classList.remove('filled', 'empty');
            
            const slot = this.inventory.slots[index];
            
            if (slot) {
                // Create slot content
                const content = this.createSlotContent(slot);
                slotElement.appendChild(content);
                slotElement.classList.add('filled');
            } else {
                slotElement.classList.add('empty');
            }
        });
    }
    
    createSlotContent(slot) {
        const content = document.createElement('div');
        content.className = 'slot-content';
        content.style.background = this.getBlockColor(slot.type);
        content.textContent = slot.type.charAt(0).toUpperCase();
        
        // Add class for block type styling
        content.classList.add(`slot-${slot.type}`);
        
        // Create count badge
        const count = document.createElement('div');
        count.className = 'slot-count';
        count.textContent = slot.count;
        
        // Style count based on amount
        if (slot.count >= this.inventory.maxStackSize) {
            count.classList.add('max');
        } else if (slot.count >= this.inventory.maxStackSize * 0.8) {
            count.classList.add('high');
        }
        
        content.appendChild(count);
        
        return content;
    }
    
    getBlockColor(blockType) {
        const colors = {
            grass: 'linear-gradient(135deg, #228B22, #32CD32)',
            stone: 'linear-gradient(135deg, #696969, #A9A9A9)',
            wood: 'linear-gradient(135deg, #8B4513, #A0522D)',
            iron: 'linear-gradient(135deg, #C0C0C0, #E6E6FA)',
            diamond: 'linear-gradient(135deg, #00FFFF, #87CEEB)',
            lava: 'linear-gradient(135deg, #FF4500, #FF6347)'
        };
        return colors[blockType] || '#666';
    }
    
    updateStats() {
        this.totalItems = 0;
        this.usedSlots = 0;
        this.emptySlots = 0;
        
        this.inventory.slots.forEach(slot => {
            if (slot) {
                this.totalItems += slot.count;
                this.usedSlots++;
            } else {
                this.emptySlots++;
            }
        });
    }
    
    getInventoryStats() {
        return {
            totalItems: this.totalItems,
            usedSlots: this.usedSlots,
            emptySlots: this.emptySlots,
            utilizationRate: ((this.usedSlots / 25) * 100).toFixed(1) + '%'
        };
    }
    
    getSelectedItem() {
        return this.inventory.slots[this.inventory.selectedSlot];
    }
    
    getItemCount(blockType) {
        let count = 0;
        this.inventory.slots.forEach(slot => {
            if (slot && slot.type === blockType) {
                count += slot.count;
            }
        });
        return count;
    }
    
    showSlotTooltip(slotElement, index) {
        const slot = this.inventory.slots[index];
        if (!slot) return;
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'slot-tooltip';
        tooltip.innerHTML = `
            <strong>${slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}</strong><br>
            Amount: ${slot.count}<br>
            Slot: ${index + 1}
        `;
        
        // Position tooltip
        const rect = slotElement.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - 50) + 'px';
        
        document.body.appendChild(tooltip);
        
        // Remove after delay
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 3000);
    }
    
    hideSlotTooltip() {
        const tooltip = document.querySelector('.slot-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) return; // Ignore when Ctrl/Cmd is pressed
            
            const key = event.key.toLowerCase();
            
            // Number keys 1-5 for quick slot selection
            if (key >= '1' && key <= '5') {
                const slotIndex = parseInt(key) - 1;
                if (slotIndex < this.slotElements.length) {
                    this.selectSlot(slotIndex);
                    event.preventDefault();
                }
            }
            
            // Arrow keys for navigation
            if (key === 'arrowleft' || key === 'arrowright' || 
                key === 'arrowup' || key === 'arrowdown') {
                this.navigateSlots(key);
                event.preventDefault();
            }
        });
    }
    
    navigateSlots(direction) {
        let newIndex = this.inventory.selectedSlot;
        const row = Math.floor(newIndex / 5);
        const col = newIndex % 5;
        
        switch (direction) {
            case 'arrowleft':
                if (col > 0) newIndex--;
                break;
            case 'arrowright':
                if (col < 4) newIndex++;
                break;
            case 'arrowup':
                if (row > 0) newIndex -= 5;
                break;
            case 'arrowdown':
                if (row < 4) newIndex += 5;
                break;
        }
        
        if (newIndex !== this.inventory.selectedSlot) {
            this.selectSlot(newIndex);
        }
    }
    
    // Debug methods
    addAllItems() {
        Object.entries(this.startingItems).forEach(([blockType, count]) => {
            this.addItem(blockType, count);
        });
    }
    
    clearInventory() {
        this.inventory.slots.fill(null);
        this.updateInventoryDisplay();
        this.updateStats();
        console.log('🧹 Inventory cleared');
    }
    
    getDebugInfo() {
        return {
            inventory: this.inventory,
            stats: this.getInventoryStats(),
            selectedItem: this.getSelectedItem(),
            isInitialized: this.isInitialized
        };
    }
}

// Make inventory manager available globally
window.InventoryManager = InventoryManager;