# SkyWorld v2.0

**Modern 3D Voxel Oyunu**

SkyWorld, Three.js kullanılarak geliştirilmiş modern bir 3D voxel oyunudur. Blokları kır, yerleştir ve kendi dünyanı oluştur!

## 🚀 Özellikler

### 🧱 Blok Sistemi
- 8 farklı blok tipi (Çimen, Toprak, Taş, Ahşap, Yapraklar, Su, Kum, Hava)
- Gerçek zamanlı blok kırma/yerleştirme
- Chunk tabanlı dünya yönetimi
- Verimli mesh oluşturma

### 🎮 Oyun Mekaniği
- Fizik sistemi (yerçekimi, sürtünme, çarpışma)
- Oyuncu hareketi (yürüme, koşma, zıplama)
- Envanter sistemi (9 slotlu hızlı erişim)
- Mobil dokunma kontrolleri

### 🌅 Gündüz/Gece Döngüsü
- Gerçek zamanlı gündüz/gece değişimi
- Dinamik ışıklandırma sistemi
- Gökyüzü rengi geçişleri
- Ay ışığı (gece)

### 🔊 Ses Sistemi
- Web Audio API ile ses efektleri
- Blok yerleştirme/kırma sesleri
- Oyuncu hareket sesleri
- Ortam müziği

### 📱 Çoklu Platform
- Masaüstü tarayıcı desteği
- Mobil cihaz uyumlu
- Dokunma kontrolleri
- Responsive tasarım

### 🎨 Görsel Efektler
- Gölge sistemi
- Partikül efektleri
- UI animasyonları
- Smooth kamera geçişleri

## 🏗️ Mimari

### Modüler Yapı
```
organized/
├── src/
│   ├── core/          # Ana oyun motoru
│   │   └── gameEngine.js
│   ├── systems/       # Oyun sistemleri
│   │   ├── blockSystem.js
│   │   ├── physicsSystem.js
│   │   ├── audioSystem.js
│   │   ├── inventorySystem.js
│   │   └── dayNightSystem.js
│   ├── components/    # Oyun bileşenleri
│   │   └── MobileControls.js
│   ├── ui/           # Kullanıcı arayüzü
│   │   └── UIManager.js
│   └── constants/    # Oyun sabitleri
│       ├── blocks.js
│       ├── audio.js
│       ├── physics.js
│       ├── colors.js
│       └── world.js
├── assets/           # Medya dosyaları
│   └── styles.css
├── docs/            # Dokümantasyon
│   ├── README.md
│   ├── FEATURES.md
│   ├── ARCHITECTURE.md
│   └── API.md
└── index.html       # Ana HTML dosyası
```

### Teknoloji Stack
- **Three.js** - 3D grafik rendering
- **Web Audio API** - Ses sistemi
- **ES6 Modules** - Modüler JavaScript
- **CSS3** - Modern UI stilleri
- **WebGL** - GPU hızlandırmalı grafik

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 14+
- Modern web tarayıcı
- WebGL desteği

### Kurulum
```bash
# Repository'yi klonla
git clone https://github.com/tropikkuslar-lab/SkyWorld.git
cd SkyWorld

# Bağımlılıkları yükle
npm install

# Yerel sunucuyu başlat
npm run dev
```

### GitHub Pages ile Çalıştırma
```bash
# GitHub Pages'e deploy et
npm run deploy
```

## 🎮 Kullanım

### Masaüstü Kontrolleri
- **WASD** - Hareket
- **Space** - Zıplama
- **Mouse** - Kamera kontrolü
- **Sol Tık** - Blok kırma
- **Sağ Tık** - Blok yerleştirme
- **1-9** - Envanter seçimi
- **E** - Envanter açma
- **ESC** - Menü

### Mobil Kontroller
- **Dokunma** - Kamera kontrolü
- **Yön butonları** - Hareket
- **Jump butonu** - Zıplama
- **Interact butonu** - Blok etkileşimi

## 🔧 Geliştirme

### Kod Katkısı
1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

### Kod Yapısı
- **ES6 Modules** kullanılır
- **Class-based** mimari
- **Event-driven** sistem
- **Modüler** tasarım

### Performans Optimizasyonları
- Chunk tabanlı dünya yükleme
- Mesh instancing kullanımı
- LOD (Level of Detail) sistemi
- Frustum culling

## 📚 Dokümantasyon

Detaylı dokümantasyon için:
- [Özellikler](docs/FEATURES.md) - Tüm oyun özellikleri
- [Mimari](docs/ARCHITECTURE.md) - Teknik mimari detayları
- [API Referansı](docs/API.md) - JavaScript API dokümantasyonu

## 🌟 Gelecek Özellikler

- [ ] Çok oyunculu destek
- [ ] Daha fazla blok tipi
- [ ] Yapı inşa araçları
- [ ] Canavar sistemi
- [ ] Hava durumu sistemi
- [ ] Texture paket sistemi
- [ ] Mod desteği
- [ ] VR desteği

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Katkıda Bulunanlar

- **MiniMax Agent** - Ana geliştirici

## 📞 İletişim

- **GitHub**: [@tropikkuslar-lab](https://github.com/tropikkuslar-lab)
- **Proje**: [SkyWorld Repository](https://github.com/tropikkuslar-lab/SkyWorld)

## 📊 İstatistikler

- **Son Güncelleme**: 17 Aralık 2025
- **Versiyon**: v2.0.0
- **Dil**: JavaScript (ES6+)
- **Platform**: Web (Cross-platform)

---

**SkyWorld** - Hayal gücünüzün sınırı olmadığı bir dünya! 🌍✨