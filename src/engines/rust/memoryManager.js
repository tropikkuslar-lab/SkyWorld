/**
 * SkyWorld v2.0 - Rust Memory Manager Simulation
 * @author MiniMax Agent
 * 
 * Bu dosya Rust benzeri memory-safe yönetim sistemini simüle eder.
 * Ownership, borrowing ve lifetimes kavramlarını JavaScript ile implement eder.
 */

export class RustMemoryManager {
    constructor() {
        this.memoryPool = new Map();
        this.allocatedBlocks = new Set();
        this.deallocatedBlocks = new Set();
        this.references = new WeakMap();
        this.memoryTracker = {
            totalAllocated: 0,
            totalFreed: 0,
            peakUsage: 0
        };
    }

    // Rust benzeri memory allocation
    allocate(size, alignment = 8) {
        console.log(`Rust: Allocating ${size} bytes with alignment ${alignment}`);
        
        // Memory pool'dan blok al
        const block = this.getMemoryBlock(size, alignment);
        
        if (!block) {
            throw new Error(`Rust: Memory allocation failed - insufficient memory for ${size} bytes`);
        }

        // Tracking
        this.memoryTracker.totalAllocated += size;
        this.memoryTracker.peakUsage = Math.max(
            this.memoryTracker.peakUsage, 
            this.memoryTracker.totalAllocated - this.memoryTracker.totalFreed
        );

        // Ownership transfer (Rust concept)
        block.owner = this.generateOwnerId();
        block.borrowers = new Set();
        block.lifetime = this.generateLifetime();
        
        this.allocatedBlocks.add(block.id);
        
        console.log(`Rust: Successfully allocated block ${block.id} with owner ${block.owner}`);
        return block;
    }

    // Rust benzeri memory deallocation
    deallocate(block) {
        console.log(`Rust: Deallocating block ${block.id}`);
        
        // Borrow checker simulation
        if (block.borrowers && block.borrowers.size > 0) {
            throw new Error(`Rust: Cannot deallocate block ${block.id} - still borrowed by ${block.borrowers.size} references`);
        }

        // Check ownership
        if (block.owner !== this.getCurrentOwner()) {
            throw new Error(`Rust: Cannot deallocate block ${block.id} - ownership mismatch`);
        }

        // Check lifetime
        if (!this.isLifetimeValid(block.lifetime)) {
            throw new Error(`Rust: Cannot deallocate block ${block.id} - lifetime expired`);
        }

        // Free memory
        this.memoryTracker.totalFreed += block.size;
        this.allocatedBlocks.delete(block.id);
        this.deallocatedBlocks.add(block.id);
        
        // Return to pool
        this.returnMemoryBlock(block);
        
        console.log(`Rust: Successfully deallocated block ${block.id}`);
    }

    // Rust benzeri borrowing (immutable)
    borrow(block) {
        console.log(`Rust: Borrowing block ${block.id} (immutable)`);
        
        if (block.owner === this.getCurrentOwner()) {
            throw new Error(`Rust: Cannot borrow own block ${block.id} - already owned`);
        }

        // Only one mutable borrow OR multiple immutable borrows (Rust rule)
        if (block.borrowers && block.borrowers.size > 0) {
            // Check if any mutable borrow exists
            const hasMutableBorrow = Array.from(block.borrowers).some(id => id.startsWith('mut_'));
            if (hasMutableBorrow) {
                throw new Error(`Rust: Cannot borrow block ${block.id} - already mutably borrowed`);
            }
        }

        const borrowerId = this.generateBorrowerId('immutable');
        block.borrowers.add(borrowerId);
        
        console.log(`Rust: Successfully borrowed block ${block.id} by ${borrowerId}`);
        return { block, borrowerId };
    }

    // Rust benzeri mutable borrowing
    borrowMut(block) {
        console.log(`Rust: Mutably borrowing block ${block.id}`);
        
        if (block.owner === this.getCurrentOwner()) {
            throw new Error(`Rust: Cannot mutably borrow own block ${block.id} - already owned`);
        }

        // Only one mutable borrow allowed
        if (block.borrowers && block.borrowers.size > 0) {
            throw new Error(`Rust: Cannot mutably borrow block ${block.id} - already borrowed`);
        }

        const borrowerId = this.generateBorrowerId('mutable');
        block.borrowers.add(borrowerId);
        
        console.log(`Rust: Successfully mutably borrowed block ${block.id} by ${borrowerId}`);
        return { block, borrowerId };
    }

    // Rust benzeri borrow end
    endBorrow(block, borrowerId) {
        console.log(`Rust: Ending borrow of block ${block.id} by ${borrowerId}`);
        
        if (block.borrowers && block.borrowers.has(borrowerId)) {
            block.borrowers.delete(borrowerId);
            console.log(`Rust: Borrow ended for block ${block.id}`);
        } else {
            throw new Error(`Rust: Cannot end borrow - borrower ${borrowerId} not found for block ${block.id}`);
        }
    }

    // Rust benzeri reference counting (Arc simülasyonu)
    createSharedReference(data) {
        const refId = this.generateRefId();
        const refCount = new Map();
        refCount.set(refId, 1);
        
        const sharedRef = {
            id: refId,
            data: data,
            refCount: refCount,
            weakRefs: new Set()
        };
        
        this.references.set(refId, sharedRef);
        console.log(`Rust: Created shared reference ${refId} with count 1`);
        return sharedRef;
    }

    cloneSharedReference(ref) {
        const newId = this.generateRefId();
        ref.refCount.set(newId, 1);
        
        // Copy reference data (expensive but safe)
        const clonedRef = {
            id: newId,
            data: JSON.parse(JSON.stringify(ref.data)), // Deep clone
            refCount: ref.refCount,
            weakRefs: new Set()
        };
        
        this.references.set(newId, clonedRef);
        console.log(`Rust: Cloned shared reference to ${newId}`);
        return clonedRef;
    }

    dropSharedReference(ref) {
        console.log(`Rust: Dropping shared reference ${ref.id}`);
        
        if (ref.refCount.size <= 1) {
            // Last reference - actually drop
            this.references.delete(ref.id);
            console.log(`Rust: Shared reference ${ref.id} dropped completely`);
        } else {
            // Just decrement count
            const lastId = Array.from(ref.refCount.keys()).pop();
            ref.refCount.delete(lastId);
            console.log(`Rust: Shared reference ${ref.id} count decremented to ${ref.refCount.size}`);
        }
    }

    // Memory pool management
    getMemoryBlock(size, alignment) {
        const key = `${size}_${alignment}`;
        
        if (this.memoryPool.has(key)) {
            const block = this.memoryPool.get(key);
            this.memoryPool.delete(key);
            return block;
        }
        
        // Allocate new block
        return {
            id: this.generateBlockId(),
            size: size,
            alignment: alignment,
            data: new ArrayBuffer(size),
            owner: null,
            borrowers: null,
            lifetime: null,
            created: Date.now()
        };
    }

    returnMemoryBlock(block) {
        const key = `${block.size}_${block.alignment}`;
        this.memoryPool.set(key, block);
        console.log(`Rust: Returned block ${block.id} to memory pool`);
    }

    // Utility methods
    generateBlockId() {
        return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateOwnerId() {
        return `owner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateBorrowerId(type) {
        return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateRefId() {
        return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateLifetime() {
        return {
            created: Date.now(),
            expires: Date.now() + (5 * 60 * 1000), // 5 minutes
            valid: true
        };
    }

    getCurrentOwner() {
        return this.currentOwner || 'default_owner';
    }

    setCurrentOwner(ownerId) {
        this.currentOwner = ownerId;
    }

    isLifetimeValid(lifetime) {
        return lifetime && lifetime.valid && Date.now() < lifetime.expires;
    }

    // Memory leak detection
    checkForLeaks() {
        const activeBlocks = this.allocatedBlocks.size;
        const memoryUsage = this.memoryTracker.totalAllocated - this.memoryTracker.totalFreed;
        
        if (activeBlocks > 0 || memoryUsage > 0) {
            console.warn(`Rust: Potential memory leak detected!`);
            console.warn(`Rust: Active blocks: ${activeBlocks}`);
            console.warn(`Rust: Memory usage: ${memoryUsage} bytes`);
            return false;
        }
        
        console.log('Rust: No memory leaks detected ✅');
        return true;
    }

    // Memory statistics
    getMemoryStats() {
        return {
            ...this.memoryTracker,
            activeBlocks: this.allocatedBlocks.size,
            poolBlocks: this.memoryPool.size,
            sharedRefs: this.references.size
        };
    }

    // Cleanup
    cleanup() {
        console.log('Rust: Cleaning up memory manager...');
        
        // Force cleanup all blocks
        this.allocatedBlocks.forEach(blockId => {
            console.warn(`Rust: Forcing cleanup of block ${blockId}`);
        });
        
        this.memoryPool.clear();
        this.allocatedBlocks.clear();
        this.deallocatedBlocks.clear();
        this.references = new WeakMap();
        
        console.log('Rust: Memory manager cleaned up');
    }
}

// Rust-style smart pointers simulation
export class RustBox {
    constructor(data) {
        this.data = data;
        this.id = `box_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    deref() {
        return this.data;
    }

    clone() {
        return new RustBox(JSON.parse(JSON.stringify(this.data)));
    }
}

export class RustRc {
    constructor(data) {
        this.data = data;
        this.id = `rc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.count = 1;
    }

    clone() {
        this.count++;
        return this;
    }

    drop() {
        this.count--;
        return this.count === 0;
    }
}

export class RustRef {
    constructor(target) {
        this.target = target;
        this.id = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    deref() {
        return this.target;
    }
}

// Global Rust memory manager
if (typeof window !== 'undefined') {
    window.RustMemoryManager = RustMemoryManager;
}