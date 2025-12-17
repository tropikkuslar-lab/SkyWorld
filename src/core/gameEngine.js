/**
 * SkyWorld - Ana Oyun Motoru
 * @author MiniMax Agent
 * @version 2.0
 */

import * as THREE from 'three';
import { BlockSystem } from '../systems/blockSystem.js';
import { PhysicsSystem } from '../systems/physicsSystem.js';
import { AudioSystem } from '../systems/audioSystem.js';
import { InventorySystem } from '../systems/inventorySystem.js';
import { DayNightSystem } from '../systems/dayNightSystem.js';
import { MobileControls } from '../components/MobileControls.js';

export class GameEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        // Sistemleri başlat
        this.blockSystem = new BlockSystem();
        this.physicsSystem = new PhysicsSystem();
        this.audioSystem = new AudioSystem();
        this.inventorySystem = new InventorySystem();
        this.dayNightSystem = new DayNightSystem();
        this.mobileControls = null;
        
        // Oyun durumu
        this.isPlaying = false;
        this.isPaused = false;
        this.player = null;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupSystems();
        this.setupEventListeners();
        this.createPlayer();
        this.generateWorld();
        
        console.log('SkyWorld Engine v2.0 initialized');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 1000);
        
        // Aydınlatma
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
        this.camera.position.set(0, 50, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB);
        this.container.appendChild(this.renderer.domElement);
    }

    setupControls() {
        if (this.isMobile()) {
            this.mobileControls = new MobileControls(this.camera, this.player);
        }
    }

    setupSystems() {
        this.blockSystem.init(this.scene);
        this.physicsSystem.init();
        this.audioSystem.init();
        this.inventorySystem.init();
        this.dayNightSystem.init(this.scene, this.camera);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        this.renderer.domElement.addEventListener('click', () => this.onClick());
    }

    createPlayer() {
        // Basit oyuncu modeli
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        this.player = new THREE.Mesh(geometry, material);
        this.player.position.set(0, 60, 0);
        this.player.castShadow = true;
        this.scene.add(this.player);
        
        // Oyuncu kamerası
        this.player.add(this.camera);
        this.camera.position.set(0, 1, 0);
    }

    generateWorld() {
        // Temel dünya oluştur
        this.blockSystem.generateTerrain();
        
        // Blokları sahneye ekle
        this.scene.add(this.blockSystem.chunkManager.getMeshGroup());
    }

    update() {
        if (!this.isPlaying || this.isPaused) return;

        const deltaTime = this.clock.getDelta();
        
        // Sistemleri güncelle
        this.physicsSystem.update(deltaTime, this.player);
        this.dayNightSystem.update(deltaTime);
        this.blockSystem.update();
        this.inventorySystem.update();
        
        // Oyuncu kontrolleri
        this.updatePlayerControls(deltaTime);
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }

    updatePlayerControls(deltaTime) {
        const speed = 10;
        const moveSpeed = speed * deltaTime;
        
        if (this.mobileControls) {
            // Mobil kontroller
            const movement = this.mobileControls.getMovement();
            if (movement.forward) this.player.position.z -= moveSpeed;
            if (movement.backward) this.player.position.z += moveSpeed;
            if (movement.left) this.player.position.x -= moveSpeed;
            if (movement.right) this.player.position.x += moveSpeed;
            if (movement.jump) this.player.position.y += moveSpeed;
        } else {
            // Klavye kontrolleri
            if (this.keys.w) this.player.position.z -= moveSpeed;
            if (this.keys.s) this.player.position.z += moveSpeed;
            if (this.keys.a) this.player.position.x -= moveSpeed;
            if (this.keys.d) this.player.position.x += moveSpeed;
            if (this.keys.space) this.player.position.y += moveSpeed;
        }
        
        // Yerçekimi
        this.player.position.y -= 9.8 * deltaTime;
        
        // Zemin kontrolü
        if (this.player.position.y < 30) {
            this.player.position.y = 30;
        }
    }

    onKeyDown(event) {
        this.keys[event.key.toLowerCase()] = true;
        
        // Oyun kontrolleri
        switch(event.key.toLowerCase()) {
            case 'escape':
                this.togglePause();
                break;
            case 'i':
                this.inventorySystem.toggleInventory();
                break;
        }
    }

    onKeyUp(event) {
        this.keys[event.key.toLowerCase()] = false;
    }

    onClick() {
        // Blok yerleştirme/kırma
        const mouse = new THREE.Vector2();
        mouse.x = 0; // Ekranın merkezi
        mouse.y = 0;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            const clickedObject = intersects[0];
            this.blockSystem.handleBlockClick(clickedObject, this.inventorySystem);
        }
    }

    onWindowResize() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    start() {
        this.isPlaying = true;
        this.gameLoop();
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    stop() {
        this.isPlaying = false;
    }

    gameLoop() {
        if (this.isPlaying) {
            this.update();
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    destroy() {
        this.stop();
        
        // Temizlik
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        
        if (this.mobileControls) {
            this.mobileControls.destroy();
        }
    }
}