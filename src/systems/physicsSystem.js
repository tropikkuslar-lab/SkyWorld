/**
 * SkyWorld - Fizik Sistemi
 * @author MiniMax Agent
 * @version 2.0
 */

import { PHYSICS_CONSTANTS } from '../constants/physics.js';

export class PhysicsSystem {
    constructor() {
        this.gravity = PHYSICS_CONSTANTS.GRAVITY;
        this.friction = PHYSICS_CONSTANTS.FRICTION;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.acceleration = { x: 0, y: 0, z: 0 };
        this.maxSpeed = PHYSICS_CONSTANTS.MAX_SPEED;
        this.jumpForce = PHYSICS_CONSTANTS.JUMP_FORCE;
        this.onGround = false;
    }

    init() {
        console.log('Physics System initialized');
    }

    update(deltaTime, player) {
        // Yerçekimi uygula
        this.applyGravity(deltaTime);
        
        // Hız güncellemesi
        this.updateVelocity(deltaTime);
        
        // Sürtünme uygula
        this.applyFriction(deltaTime);
        
        // Pozisyon güncellemesi
        this.updatePosition(player, deltaTime);
        
        // Çarpışma kontrolü
        this.checkCollisions(player);
    }

    applyGravity(deltaTime) {
        this.velocity.y -= this.gravity * deltaTime;
    }

    updateVelocity(deltaTime) {
        // İvme ekle
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.velocity.z += this.acceleration.z * deltaTime;
        
        // Maksimum hızı sınırla
        const speed = Math.sqrt(
            this.velocity.x * this.velocity.x + 
            this.velocity.z * this.velocity.z
        );
        
        if (speed > this.maxSpeed) {
            const factor = this.maxSpeed / speed;
            this.velocity.x *= factor;
            this.velocity.z *= factor;
        }
    }

    applyFriction(deltaTime) {
        // Yatay sürtünme
        this.velocity.x *= (1 - this.friction * deltaTime);
        this.velocity.z *= (1 - this.friction * deltaTime);
    }

    updatePosition(player, deltaTime) {
        player.position.x += this.velocity.x * deltaTime;
        player.position.y += this.velocity.y * deltaTime;
        player.position.z += this.velocity.z * deltaTime;
    }

    checkCollisions(player) {
        // Basit zemin kontrolü
        const groundLevel = 30;
        
        if (player.position.y <= groundLevel) {
            player.position.y = groundLevel;
            this.velocity.y = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
    }

    jump() {
        if (this.onGround) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
        }
    }

    move(direction, force) {
        switch(direction) {
            case 'forward':
                this.acceleration.z = -force;
                break;
            case 'backward':
                this.acceleration.z = force;
                break;
            case 'left':
                this.acceleration.x = -force;
                break;
            case 'right':
                this.acceleration.x = force;
                break;
            case 'up':
                this.jump();
                break;
        }
    }

    stop(direction) {
        switch(direction) {
            case 'forward':
            case 'backward':
                this.acceleration.z = 0;
                break;
            case 'left':
            case 'right':
                this.acceleration.x = 0;
                break;
        }
    }

    getVelocity() {
        return { ...this.velocity };
    }

    getOnGround() {
        return this.onGround;
    }

    reset() {
        this.velocity = { x: 0, y: 0, z: 0 };
        this.acceleration = { x: 0, y: 0, z: 0 };
        this.onGround = false;
    }
}