/**
 * SkyWorld - Gündüz/Gece Sistemi
 * @author MiniMax Agent
 * @version 2.0
 */

export class DayNightSystem {
    constructor() {
        this.time = 0; // 0-1 arası (0 = gece, 0.5 = öğle, 1 = tekrar gece)
        this.dayLength = 240; // 4 dakika (saniye cinsinden)
        this.isDay = true;
        this.lightIntensity = 1.0;
        this.skyColor = new THREE.Color();
        this.sunLight = null;
        this.ambientLight = null;
    }

    init(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.setupLights();
        this.updateSky();
        console.log('Day/Night System initialized');
    }

    setupLights() {
        // Mevcut ışıkları bul
        this.scene.traverse((child) => {
            if (child instanceof THREE.DirectionalLight) {
                this.sunLight = child;
            }
            if (child instanceof THREE.AmbientLight) {
                this.ambientLight = child;
            }
        });
        
        // Eğer bulunamadıysa oluştur
        if (!this.sunLight) {
            this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
            this.sunLight.position.set(50, 100, 50);
            this.sunLight.castShadow = true;
            this.scene.add(this.sunLight);
        }
        
        if (!this.ambientLight) {
            this.ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            this.scene.add(this.ambientLight);
        }
    }

    update(deltaTime) {
        // Zamanı ilerlet
        this.time += deltaTime / this.dayLength;
        
        // 0-1 aralığında tut
        if (this.time >= 1) {
            this.time = 0;
        }
        
        // Gündüz mü gece mi?
        this.isDay = this.time < 0.75; // %75'i gündüz
        
        // Işıkları güncelle
        this.updateLighting();
        this.updateSky();
    }

    updateLighting() {
        // Güneş pozisyonu ve açısı
        const sunAngle = this.time * Math.PI * 2;
        const sunHeight = Math.sin(sunAngle);
        const sunDistance = 100;
        
        this.sunLight.position.x = Math.cos(sunAngle) * sunDistance;
        this.sunLight.position.y = Math.max(sunHeight, 0) * sunDistance;
        this.sunLight.position.z = Math.sin(sunAngle) * sunDistance;
        
        // Işık yoğunluğu
        if (this.isDay) {
            this.sunLight.intensity = 0.8 + sunHeight * 0.2;
            this.ambientLight.intensity = 0.4 + sunHeight * 0.2;
        } else {
            this.sunLight.intensity = 0.1;
            this.ambientLight.intensity = 0.2;
        }
        
        // Gece yıldız ışığı
        if (!this.isDay) {
            this.createMoonLight();
        }
    }

    createMoonLight() {
        // Ay ışığı ekle
        if (!this.moonLight) {
            this.moonLight = new THREE.DirectionalLight(0x4444ff, 0.2);
            this.scene.add(this.moonLight);
        }
        
        const moonAngle = this.time * Math.PI * 2 + Math.PI;
        this.moonLight.position.x = Math.cos(moonAngle) * 100;
        this.moonLight.position.y = Math.sin(moonAngle) * 100;
        this.moonLight.position.z = Math.sin(moonAngle) * 100;
    }

    updateSky() {
        const skyColors = this.getSkyColors();
        
        // Gökyüzü rengi
        this.skyColor.lerpColors(
            skyColors.night,
            skyColors.day,
            this.getDayNightTransition()
        );
        
        this.scene.background = this.skyColor;
        
        // Fog rengini de güncelle
        if (this.scene.fog) {
            this.scene.fog.color.copy(this.skyColor);
        }
    }

    getSkyColors() {
        return {
            night: new THREE.Color(0x001122),
            dawn: new THREE.Color(0xff6b35),
            day: new THREE.Color(0x87CEEB),
            dusk: new THREE.Color(0xff4500)
        };
    }

    getDayNightTransition() {
        // 0-1 arası geçiş değeri (0 = gece, 1 = gündüz)
        const transitionStart = 0.25; // Şafak başlangıcı
        const transitionEnd = 0.75;   // Alacakaranlık bitişi
        
        if (this.time < transitionStart || this.time > transitionEnd) {
            return 0; // Gece
        } else if (this.time < transitionStart + 0.1) {
            return (this.time - transitionStart) / 0.1; // Şafak
        } else if (this.time > transitionEnd - 0.1) {
            return 1 - (this.time - (transitionEnd - 0.1)) / 0.1; // Alacakaranlık
        } else {
            return 1; // Gündüz
        }
    }

    isCurrentlyDay() {
        return this.isDay;
    }

    getCurrentTime() {
        return this.time;
    }

    getTimeOfDay() {
        const hours = Math.floor(this.time * 24);
        const minutes = Math.floor((this.time * 24 - hours) * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    setTime(time) {
        // Belirli bir zamana geç (0-1 arası)
        this.time = Math.max(0, Math.min(1, time));
        this.updateLighting();
        this.updateSky();
    }

    setDayLength(seconds) {
        this.dayLength = Math.max(10, seconds); // Minimum 10 saniye
    }

    // Efektler
    createDayNightEffect() {
        // Gündüz/gece geçiş efekti
        const effect = {
            duration: 5, // 5 saniye
            startTime: this.time,
            targetDay: !this.isDay
        };
        
        return effect;
    }

    applyDayNightEffect(effect, deltaTime) {
        // Efekt uygulama (ileride kullanım için)
        if (effect) {
            // Geçiş efekti burada uygulanacak
        }
    }

    // Istatistikler
    getStats() {
        return {
            time: this.time,
            isDay: this.isDay,
            timeOfDay: this.getTimeOfDay(),
            dayLength: this.dayLength,
            sunIntensity: this.sunLight ? this.sunLight.intensity : 0,
            ambientIntensity: this.ambientLight ? this.ambientLight.intensity : 0
        };
    }

    // Debug fonksiyonları
    forceDay() {
        this.setTime(0.5); // Öğle vakti
    }

    forceNight() {
        this.setTime(0.0); // Gece yarısı
    }

    pauseTime() {
        this.timePaused = true;
    }

    resumeTime() {
        this.timePaused = false;
    }

    update(deltaTime) {
        if (this.timePaused) return;
        
        // Normal güncelleme
        this.time += deltaTime / this.dayLength;
        
        if (this.time >= 1) {
            this.time = 0;
        }
        
        this.isDay = this.time < 0.75;
        this.updateLighting();
        this.updateSky();
    }
}