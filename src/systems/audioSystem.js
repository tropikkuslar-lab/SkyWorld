/**
 * SkyWorld - Ses Sistemi
 * @author MiniMax Agent
 * @version 2.0
 */

import { AUDIO_CONSTANTS } from '../constants/audio.js';

export class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.masterVolume = 0.5;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.isMuted = false;
        this.currentMusic = null;
    }

    async init() {
        try {
            // AudioContext başlat
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Ses dosyalarını yükle
            await this.loadSounds();
            
            console.log('Audio System initialized');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    async loadSounds() {
        const soundFiles = {
            click: '/assets/audio/click.mp3',
            place: '/assets/audio/place.mp3',
            break: '/assets/audio/break.mp3',
            step: '/assets/audio/step.mp3',
            jump: '/assets/audio/jump.mp3',
            music: '/assets/audio/ambient.mp3'
        };

        for (const [name, path] of Object.entries(soundFiles)) {
            try {
                const audio = await this.loadAudioFile(path);
                this.sounds.set(name, audio);
            } catch (error) {
                console.warn(`Failed to load sound ${name}:`, error);
                // Ses yüklenemezse alternatif oluştur
                this.createAlternativeSound(name);
            }
        }
    }

    async loadAudioFile(path) {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    createAlternativeSound(name) {
        // Web Audio API ile basit ses efektleri oluştur
        const sampleRate = this.audioContext.sampleRate;
        const duration = 0.1; // 100ms
        
        switch (name) {
            case 'click':
                this.createClickSound(sampleRate, duration);
                break;
            case 'place':
                this.createPlaceSound(sampleRate, duration);
                break;
            case 'break':
                this.createBreakSound(sampleRate, duration);
                break;
            case 'step':
                this.createStepSound(sampleRate, duration);
                break;
            case 'jump':
                this.createJumpSound(sampleRate, duration);
                break;
            case 'music':
                this.createMusicLoop(sampleRate, duration);
                break;
        }
    }

    createClickSound(sampleRate, duration) {
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.sin(2 * Math.PI * 800 * i / sampleRate) * Math.exp(-i / (sampleRate * 0.01));
        }
        
        this.sounds.set('click', buffer);
    }

    createPlaceSound(sampleRate, duration) {
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.05));
        }
        
        this.sounds.set('place', buffer);
    }

    createBreakSound(sampleRate, duration) {
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.03));
        }
        
        this.sounds.set('break', buffer);
    }

    createStepSound(sampleRate, duration) {
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.sin(2 * Math.PI * 100 * i / sampleRate) * Math.exp(-i / (sampleRate * 0.02));
        }
        
        this.sounds.set('step', buffer);
    }

    createJumpSound(sampleRate, duration) {
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * (200 + t * 300) * t) * Math.exp(-t * 5);
        }
        
        this.sounds.set('jump', buffer);
    }

    createMusicLoop(sampleRate, duration) {
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            data[i] = (
                Math.sin(2 * Math.PI * 220 * t) * 0.3 +
                Math.sin(2 * Math.PI * 330 * t) * 0.2 +
                Math.sin(2 * Math.PI * 440 * t) * 0.1
            ) * 0.1;
        }
        
        this.sounds.set('music', buffer);
    }

    playSound(soundName, volume = 1.0, loop = false) {
        if (this.isMuted || !this.audioContext) return;
        
        const buffer = this.sounds.get(soundName);
        if (!buffer) return;
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        source.loop = loop;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Ses seviyesi ayarı
        const finalVolume = volume * this.masterVolume * this.sfxVolume;
        gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
        
        source.start();
        
        return { source, gainNode };
    }

    playMusic(soundName, volume = 1.0) {
        if (this.currentMusic) {
            this.stopMusic();
        }
        
        this.currentMusic = this.playSound(soundName, volume, true);
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.source.stop();
            this.currentMusic = null;
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    mute() {
        this.isMuted = true;
    }

    unmute() {
        this.isMuted = false;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
    }

    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Oyun olayları için ses fonksiyonları
    onBlockPlaced() {
        this.playSound('place', 0.5);
    }

    onBlockBroken() {
        this.playSound('break', 0.5);
    }

    onPlayerJump() {
        this.playSound('jump', 0.3);
    }

    onPlayerStep() {
        this.playSound('step', 0.2);
    }

    onButtonClick() {
        this.playSound('click', 0.3);
    }

    startAmbientMusic() {
        this.playMusic('music', 0.3);
    }

    stopAmbientMusic() {
        this.stopMusic();
    }
}