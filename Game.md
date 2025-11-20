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

## ⏳ Gelişmiş Zaman Yönetimi ve Mevsimler

Oyun artık sürekli bir akış yerine döngüsel bir zaman diliminde ilerler.

### Günlük Döngü
*   **Mesai Saatleri:** 06:00 - 20:00.
*   **Uyku Modu:** 20:00'dan sonra işçiler dinlenir ve üretim durur. Atölye kararır.

### Mevsimler
Yıl 4 mevsime ayrılır (Her mevsim 10 oyun günü).
*   **❄️ Kış:** Taş fiyatları +%30 (Yollar kapalı), İşçi hızı -%10 (Soğuk).
*   **☀️ Yaz:** İşçiler daha hızlı yorulur (Stamina kaybı artar).
*   **🌸 Bahar / 🍂 Güz:** Standart verimlilik.

---

## 🏭 Çok Aşamalı Üretim (Pipeline)

Üretim artık tek bir ilerleme çubuğu değil, 3 aşamalı bir süreçtir.

### 1. Kaba İnşaat (Roughing)
*   **Sorumlular:** Köleler ve Çıraklar.
*   **Hız Faktörü:** İşçi Gücü (Strength).

### 2. Detaylandırma (Detailing)
*   **Sorumlular:** Çıraklar ve Ustalar.
*   **Hız Faktörü:** İşçi Yeteneği (Skill).

### 3. Kalite Kontrol (Inspection)
*   Ürün %100 olduğunda bir **Usta** tarafından kontrol edilmelidir.
*   **Sonuçlar:**
    *   ✅ **Başarılı:** Ürün teslim edilir.
    *   ⚠️ **Kusurlu (Minor Flaw):** Ürün %80'e geri döner. Tekrar detaylandırılmalıdır. (Deadline riski!)
    *   ❌ **Kritik Hata (Fail):** Ürün kırılır ve Moloza (Rubble) dönüşür.

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
