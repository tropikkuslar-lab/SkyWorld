# Contributing to SkyWorld

Bu doküman, SkyWorld projesine nasıl katkıda bulunabileceğiniz konusunda rehberlik sağlar.

## 🎯 Katkıda Bulunma Yolları

### 🐛 Hata Raporlama
- GitHub Issues kullanarak hataları bildirin
- Açık ve net açıklamalar yapın
- Tekrar üretme adımlarını belirtin
- Sistem bilgilerinizi (tarayıcı, işletim sistemi) ekleyin

### 💡 Özellik Önerileri
- Yeni özellik taleplerinizi GitHub Issues'da açıkça belirtin
- Mevcut özelliklerin nasıl geliştirilebileceğini açıklayın
- Topluluk geri bildirimlerini göz önünde bulundurun

### 🔧 Kod Katkısı
- Fork edin ve feature branch oluşturun
- Kod standartlarımızı takip edin
- Test yazın ve mevcut testleri geçirin
- Pull Request açın

## 🏗️ Geliştirme Kurulumu

### Gereksinimler
- Node.js 14+
- Modern web tarayıcı
- Git

### Kurulum
```bash
# Repository'yi fork edin ve klonlayın
git clone https://github.com/tropikkuslar-lab/SkyWorld.git
cd SkyWorld

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## 📝 Kod Standartları

### JavaScript
- ES6+ modüller kullanın
- `const` ve `let` tercih edin, `var` kullanmayın
- Açıklayıcı değişken isimleri kullanın
- JSDoc yorumları ekleyin

```javascript
/**
 * Blok tipini al
 * @param {string} blockId - Blok kimliği
 * @returns {Object} Blok objesi
 */
function getBlockType(blockId) {
    return BLOCK_TYPES[blockId] || BLOCK_TYPES.AIR;
}
```

### CSS
- BEM metodolojisini takip edin
- Responsive design prensiplerini uygulayın
- CSS değişkenleri kullanın

```css
.block-system {
    --primary-color: #4a90e2;
}

.block-system__element {
    color: var(--primary-color);
}
```

### Dosya Yapısı
- Dosya isimleri kebab-case kullanın
- Her dosya tek bir sorumluluğa sahip olmalı
- Class isimleri PascalCase kullanın

## 🧪 Test Etme

### Manuel Test
- Tüm tarayıcılarda test edin
- Mobil cihazlarda kontrol edin
- Performansı izleyin

### Otomatik Test (Gelecek)
```bash
# Test çalıştır
npm test

# Coverage raporu
npm run test:coverage
```

## 📋 Pull Request Süreci

### 1. Branch Oluşturun
```bash
git checkout -b feature/amazing-feature
```

### 2. Değişikliklerinizi Yapın
- Kod standartlarımızı takip edin
- Yeni özellikler için test yazın
- Dokümantasyonu güncelleyin

### 3. Commit Yapın
```bash
git add .
git commit -m "feat: amazing feature eklendi"
```

### 4. Push Edin ve PR Açın
```bash
git push origin feature/amazing-feature
```

### Commit Mesaj Formatı
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon
- `style`: Kod formatı (CSS, vs.)
- `refactor`: Kod refactoring
- `test`: Test ekleme/düzenleme
- `chore`: Build process, dependencies

**Examples:**
```
feat(block): yeni blok tipi eklendi
fix(physics): yerçekimi hatası düzeltildi
docs(api): API dokümantasyonu güncellendi
```

## 🎮 Özellik Geliştirme Rehberi

### Yeni Sistem Ekleme
1. `src/systems/` klasörüne yeni dosya oluşturun
2. Class-based yapı kullanın
3. GameEngine'e entegre edin
4. Dokümantasyon yazın

```javascript
// src/systems/newSystem.js
export class NewSystem {
    constructor() {
        this.name = 'NewSystem';
    }
    
    init(gameEngine) {
        this.gameEngine = gameEngine;
        console.log('NewSystem initialized');
    }
    
    update(deltaTime) {
        // Sistem güncelleme logic
    }
}
```

### Yeni Blok Tipi
1. `src/constants/blocks.js` dosyasını güncelleyin
2. Yeni blok özelliklerini tanımlayın
3. Gerekirse yeni texture ekleyin

```javascript
export const BLOCK_TYPES = {
    // ... mevcut bloklar
    NEW_BLOCK: {
        id: 'new_block',
        name: 'Yeni Blok',
        color: 0xff0000,
        transparent: false,
        hardness: 1.0,
        drops: 'new_block'
    }
};
```

## 🔍 Code Review Süreci

### Reviewer Kontrol Listesi
- [ ] Kod standartlarına uygun mu?
- [ ] Performans açısından optimize edilmiş mi?
- [ ] Dokümantasyon güncel mi?
- [ ] Testler yazılmış mı?
- [ ] Breaking changes var mı?

### Author Kontrol Listesi
- [ ] Tüm testler geçiyor mu?
- [ ] Dokümantasyon güncellenmiş mi?
- [ ] Changelog yazılmış mı?
- [ ] Performans test edilmiş mi?

## 🐛 Hata Raporlama

### Hata Raporu Şablonu
```markdown
**Hata Açıklaması**
Blok yerleştirme çalışmıyor.

**Tekrar Üretme Adımları**
1. Oyunu başlat
2. Sol tık yap
3. Blok yerleştirilmemiş

**Beklenen Davranış**
Blok yerleştirilmeli

**Ekran Görüntüleri**
[Varsa ekran görüntüsü ekleyin]

**Sistem Bilgileri**
- Tarayıcı: Chrome 91
- İşletim Sistemi: Windows 10
- Çözünürlük: 1920x1080
```

## 💬 Topluluk

### İletişim
- **GitHub Issues**: Teknik sorunlar için
- **GitHub Discussions**: Genel tartışmalar için
- **Email**: Yaratıcı geri bildirimler için

### Davranış Kuralları
- Saygılı olun
- Yapıcı geri bildirim verin
- Diğer katkıda bulunanlara destek olun
- Açık kaynak ruhunu benimseyin

## 🎯 Öncelikli Alanlar

### Yüksek Öncelik
- [ ] Performans optimizasyonu
- [ ] Mobil deneyim iyileştirmesi
- [ ] Test coverage artırma
- [ ] Dokümantasyon tamamlama

### Orta Öncelik
- [ ] Yeni blok tipleri
- [ ] Gelişmiş UI bileşenleri
- [ ] Ses efektleri genişletme
- [ ] Aydınlatma sistemi iyileştirmesi

### Düşük Öncelik
- [ ] Çok oyunculu destek
- [ ] Texture paketleri
- [ ] Mod sistemi
- [ ] VR desteği

## 📄 Lisans

Bu projeye yaptığınız katkılar MIT lisansı altında lisanslanacaktır.

## 🙏 Teşekkürler

SkyWorld'e katkıda bulunan herkese teşekkürlerimizi sunarız. Sizin katkılarınız projenin gelişimini mümkün kılar!

---

**Not**: Bu doküman yaşayan bir dokümandır. Sorularınız veya önerileriniz için GitHub Issues kullanabilirsiniz.