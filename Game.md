# Lithos: Antik Heykel Atölyesi - Oyun Kuralları

## 📜 Oyun Hakkında
**Lithos**, antik çağda geçen bir heykel atölyesi yönetim simülasyonudur. Amacınız, sıradan bir çamur toplayıcısı olarak başladığınız kariyerinizde itibar kazanarak yükselmek ve "Tanrıların Eli" rütbesine ulaşmaktır.

---

## 🏛️ Temel Kaynaklar

### 1. Drachma (Para) 💰
Atölyenizin finansal gücüdür.
*   **Kazanma:** Siparişleri tamamlayarak veya stoktaki ürünleri satarak.
*   **Harсama:** Hammadde alımı, alet satın alımı, işçi maaşları, danışman ücretleri ve araştırmalar.

### 2. İtibar (Reputation) 👑
Sanat dünyasındaki saygınlığınızdır.
*   **Kazanma:** Zorlu siparişleri başarıyla tamamlayarak.
*   **Önemi:** Yeni rütbelere ulaşmak ve özel danışmanları işe almak için gereklidir.

---

## ⚒️ Üretim Mekanikleri

Üretim süreci, hammaddeyi işleyerek sanat eserine dönüştürme sürecidir. Bu süreçte iki temel faktör vardır: **Süre** ve **Risk**.

### 1. Süre Hesaplaması ⏳
Bir ürünün ne kadar sürede tamamlanacağı şu formülle hesaplanır:

> **Süre (dk)** = (Malzeme Sertliği × 60) / Toplam Üretim Gücü

*   **Malzeme Sertliği:** Her malzemenin doğuştan gelen bir sertlik değeri vardır (Örn: Kil = 1, Mermer = 5).
*   **Toplam Üretim Gücü:** Atölyedeki işçilerin toplam gücüdür.
    *   *İşçi Gücü* = 1 (Taban) + (Yetenek × 0.1) + Alet Bonusları + Rütbe Bonusu

### 2. Risk Hesaplaması ⚠️
Üretimin başarısız olma ihtimalidir. Başarısızlık durumunda hammadde ziyan olur.

> **Risk (%)** = Malzeme Kırılganlığı - (Ortalama Risk Azaltma)

*   **Minimum Risk:** %5 (Ne kadar usta olursanız olun, her zaman küçük bir hata payı vardır).
*   **Risk Azaltma:** İşçilerin yetenekleri ve kullandıkları aletler riski düşürür.
    *   *İşçi Risk Azaltma* = (Yetenek × 0.01) + Alet Bonusları

---

## 👷 İşçi Sistemi

İşçiler atölyenizin kalbidir. Üç temel sınıfa ayrılırlar:

### İşçi Tipleri
| Tip | Maaş | Özellikler |
| :--- | :--- | :--- |
| **Köle (Slave)** | Düşük | Sadece kaba kuvvet. Risk azaltma yeteneği düşüktür. |
| **Çırak (Apprentice)** | Orta | Gelişime açıktır. Dengeli bir performans sergiler. |
| **Usta (Master)** | Yüksek | Yüksek yetenek ve risk azaltma. Pahalıdır ama kusursuz iş çıkarır. |

### İşçi İstatistikleri
*   **Yetenek (Skill):** Üretim hızını artırır ve riski azaltır. Çalıştıkça gelişir.
*   **Seviye (Level):** Her seviye atladığında yetenek puanı artar. (Gereken XP: Seviye × 100).
*   **Sadakat (Loyalty):** %0-100 arasıdır. Düşük sadakat işçinin ayrılmasına neden olabilir.
    *   *Düşüş:* Maaş ödenmezse veya zam talebi reddedilirse.
    *   *Artış:* Düzenli maaş ödemesi ve zam yapılması.

---

## 📈 İlerleme ve Rütbeler

İtibar kazandıkça rütbeniz artar. Her rütbe yeni olanaklar sağlar.

**Örnek Rütbeler:**
1.  **Çamur Toplayıcı:** Başlangıç seviyesi. Sadece Kil işleyebilir.
2.  **Acemi Yontucu:** Kireç Taşı ve daha fazla işçi kapasitesi açılır.
...
7.  **Agora Zanaatkarı:** Pentelik Mermer ve Pazar indirimleri.
12. **İmparatorluk Sanatçısı:** Bazalt ve Granit işleme yetkisi.
15. **Tanrıların Eli:** Oyunun zirvesi.

---

## 💰 Ekonomi ve Pazar

### Siparişler
*   Rastgele zamanlarda gelir.
*   Belirli bir malzemeden belirli bir ürün (Örn: Mermer Büst) istenir.
*   **Ödül:** Para + İtibar.
*   Süresi içinde tamamlanmazsa iptal olur.

### Giderler
*   **Maaşlar:** Her oyun ayında (30 gün) bir kez otomatik ödenir.
*   **Vergiler:** Rütbenize göre belirlenen oranda kesilir.

---

## 🛠️ Envanter ve Aletler

İşçilerinize alet vererek performanslarını artırabilirsiniz.

*   **Bronz Keski:** Hız +%10.
*   **Demir Çekiç:** Hız +%25.
*   **Çelik Set:** Hız +%40, Risk -%10.
*   **Cila Bezi:** Kalite/Prestij +%20.

---

## 🧠 Danışmanlar

Yüksek rütbelerde işe alabileceğiniz özel karakterlerdir. Üretim yapmazlar ancak pasif bonuslar sağlarlar.

*   **Tüccar:** Hammadde fiyatlarını düşürür.
*   **Filozof:** Günlük itibar kazandırır.
*   **Mimar:** Genel üretim hızını artırır.
*   **Tedarikçi:** Otomatik hammadde alımı yapar.

---

## 🎓 Akademi ve Öğrenciler (YENİ!)

Atölyenizin geleceğini garanti altına almak için öğrenci yetiştirebilirsiniz.

### Öğrenci Sistemi
*   **Alım:** Her zaman 1 öğrenci kontenjanınız vardır.
*   **Eğitim:** Öğrenciler üretim yapmaz, sadece izler ve öğrenir.
*   **Mezuniyet:** %100 eğitime ulaştıklarında mezun olurlar.
    *   %20 Şans: **Usta (Master)** olarak katılır.
    *   %80 Şans: **Çırak (Apprentice)** olarak katılır.
*   **Ayrılma:** Mezun olduklarında işe alınmazlarsa atölyeyi terk ederler.

---

## 🖥️ UI ve Kontroller

### İşçi Seçimi
Kalabalık ekipleri yönetmek için gelişmiş seçim araçları mevcuttur:
*   **Filtreleme:** Tümü, Usta, Çırak veya Köle olarak filtreleme.
*   **Sıralama:** Tecrübeye göre (En yetenekli veya en çaylak) sıralama.
*   **Çoklu Seçim (Shift+Click):** Bir işçiye tıklayıp, Shift'e basılı tutarak başka bir işçiye tıkladığınızda aradaki herkes seçilir.

### Görselleştirme
*   **Malzemeler:** Envanterdeki her malzeme gerçek dokusuyla (Kil, Mermer, Bazalt vb.) gösterilir.
*   **Detaylı Bilgi:** Kutuların üzerine gelindiğinde (Hover) detaylı bilgi kartı açılır (Hacim, Fiyat, Sertlik vb.).

---

## ⏳ Gelişmiş Zaman Yönetimi ve Mevsimler

Oyun artık sürekli bir akış yerine döngüsel bir zaman diliminde ilerler.
*   **Zaman Akışı:** 1 Gerçek Saniye = 12 Oyun Dakikası.

### Günlük Döngü
*   **Mesai Saatleri:** 06:00 - 20:00.
*   **Uyku Modu:** 20:00'dan sonra işçiler dinlenir ve üretim durur. Atölye kararır.
*   **Hızlı Gece:** Gece olduğunda zaman 5 kat hızlı akar.

### Mevsimler
Yıl 4 mevsime ayrılır (Her mevsim 10 oyun günü).
*   **❄️ Kış:** Taş fiyatları +%30 (Yollar kapalı), İşçi hızı -%10 (Soğuk).
*   **☀️ Yaz:** İşçiler daha hızlı yorulur (Stamina kaybı artar).
*   **🌸 Bahar / 🍂 Güz:** Standart verimlilik.

---

## 🏭 Çok Aşamalı Üretim (Pipeline)

Üretim artık tek bir ilerleme çubuğu değil, 3 aşamalı bir süreçtir. Her aşama farklı işçi türleri gerektirir ve opsiyoneldir.

### 1. Kaba İnşaat (Roughing) - %0-33
*   **Sorumlular:** Köleler ve Çıraklar.
*   **Hız Faktörü:** İşçi Gücü (Strength) ve Skill.
*   **Zorunlu:** Evet - Bu aşama atlanamaz.

### 2. Detaylandırma (Detailing) - %33-66
*   **Sorumlular:** Çıraklar ve Ustalar.
*   **Hız Faktörü:** İşçi Yeteneği (Skill).
*   **Opsiyonel:** Eğer Çırak/Usta yoksa bu aşama **otomatik atlanır** ve direkt Kalite Kontrol'e geçilir.
*   **Risk:** Atlandığında inspection başarı şansı düşer.

### 3. Kalite Kontrol (Inspection) - %66-100
Ürün tamamlandığında **otomatik** kalite kontrolü yapılır. Başarı şansı şu faktörlere bağlıdır:

**Başarı Formülü:**
```
Başarı = (Materyal Kolaylığı + Skill + İtibar + Tool) × (1 - Task Risk × Ceza)
```

#### Materyal Kolaylığı
*   🟤 **Kil / Moloz**: %85 base (kolay işlenir)
*   ⚪ **Kireçtaşı**: %80 base
*   🔵 **Mermer / Bazalt**: %70 base (hassas malzeme)

#### İtibar Bonusu
*   Her **100 itibar** = +%2 başarı şansı
*   Maksimum: +%20 (1000 itibar'da)
*   **Mantık:** Yüksek itibar = daha iyi atölye standartları

#### Ekip Bonusu (YENİ!)
*   **Formül:** (Ortalama Skill × %1) + (İşçi Sayısı × %2)
*   **Maksimum:** +%10
*   **Örnek:** 3 işçi, ortalama 5 skill = %5 + %6 = **+%10** bonus
*   **Mantık:** Daha fazla göz = daha az hata

#### Task Risk Etkisi
*   Üretim sırasında hesaplanan **risk değeri** başarıyı düşürür
*   Düşük skill, kötü tool, zor materyal = yüksek risk = düşük başarı

---

#### Usta ile Kontrol (En İyi)
*   **Base:** Materyal kolaylığı (%70-85)
*   **Skill Bonusu:** Skill × %5
*   **İtibar Bonusu:** İtibar/100 × %2 (max %20)
*   **Quality Tool:** Cila bezi vb. ekstra bonus
*   **Risk Cezası:** × (1 - Risk × 0.5)
*   **Sonuçlar:**
    *   ✅ **Başarılı:** Ürün teslim edilir
    *   ⚠️ **Kusurlu (%15):** Detaylandırmanın %60'ına geri dön
    *   ❌ **Hata:** Moloza dönüş

#### Çırak ile Kontrol (Riskli)
*   **Base:** Materyal kolaylığı - %25 (%40-60)
*   **Skill Bonusu:** Skill × %2
*   **İtibar Bonusu:** İtibar/100 × %2
*   **Risk Cezası:** × (1 - Risk × 0.6)
*   **Sonuç:** Başarılı veya moloz

#### Sadece Köle (Çok Riskli)
*   **Base:** Materyal kolaylığı - %35 (%20-50)
*   **İtibar Bonusu:** İtibar/100 × %2
*   **Risk Cezası:** × (1 - Risk × 0.8) - **Çok ağır ceza!**
*   **Sonuç:** Başarılı veya moloz
*   **Not:** Kil ile köle = ~%40-50 şans, Mermer ile = ~%10-15 şans

---

## 🎭 Organik İşçiler (Günlük Durumlar)

İşçiler her sabah (06:00) rastgele bir ruh hali veya fiziksel durumla uyanır.

**Örnek Durumlar:**
*   🤕 **Eklemler Ağrıyor:** Hız -%15.
*   🤢 **Kötü Yemek:** Risk +%10.
*   💡 **İlham Geldi:** Kalite +%20, Hız +%10.
*   😐 **Normal:** Standart performans.

**Aşırı Çalışma (Overwork):** Şikayet eden bir işçi o gün çok çalıştırılırsa kalıcı sadakat kaybı yaşar.

---

## 📝 Geliştirme Kuralları

1.  **Dokümantasyon:** Oyuna eklenen her yeni kural, mekanik veya mantıksal değişiklik, anında bu dosyaya (`Game.md`) işlenmelidir. `Game.md` her zaman oyunun güncel durumunu yansıtmalıdır.
2.  **Çoklu Dil Desteği (i18n):** Eklenen her yeni özellik, metin, bildirim veya arayüz öğesi mutlaka çoklu dil desteğine (Türkçe ve İngilizce) uygun olarak geliştirilmelidir. Kod içinde "hardcoded" metin kullanımı yasaktır; tüm metinler `locales` dosyalarından çekilmelidir.
