# Kokand University + Shaharcha

Bu — BIRLASHGAN variant: universitet sayti ham, talabalar shaharchasi ham
bitta serverda ishlaydi va bitta admin paneldan boshqariladi.

## Ishga tushirish

1. Node.js 22 yoki undan yangisi o'rnatilgan bo'lsin (https://nodejs.org).
2. Windows: `ISHGA-TUSHIRISH.bat` faylini ikki marta bosing.
   Mac/Linux: terminalda `./ishga-tushirish.sh`.
3. Brauzerda oching: http://localhost:3000
4. Admin panel: http://localhost:3000/admin

`npm install` SHART EMAS — baza (SQLite) Node.js ichida keladi.

## Login va parol

Birinchi ishga tushirishda parol berilmagan bo'lsa, konsolga tasodifiy parol
chiqadi — uni saqlab qo'ying. O'zingiz belgilamoqchi bo'lsangiz, `.env.example`
faylini `.env` deb nusxalang va parollarni yozing.

| Rol | Email | Nima qila oladi |
|---|---|---|
| staff | staff@kokandu.uz | Hammasi: sozlamalar, adminlar, rasm/video, arizalar |
| editor | admin@kokandu.uz | Faqat matn, rasm va havolalarni tahrirlash |

## Ma'lumotlar qayerda saqlanadi

Barcha kontent `data/app.db` faylida (SQLite). **Zaxira nusxa olayotganda
`data/` papkasini butunlay nusxalang** — `app.db-wal` va `app.db-shm` fayllari
ham kerak.

Railway/VPS'ga qo'yganda diskingiz doimiy bo'lmasa ma'lumot yo'qoladi —
PostgreSQL'ga o'tish yo'riqnomasi: `MIGRATION-POSTGRES.md`.

## Bu loyihada nima bor

**Universitet sayti**

- Bosh sahifa (`/`)
- Galereya (`/galereya.html`) — binolar, ichki ko'rinish, video fon
- Hikoyalar (`/stories.html`) va Yangiliklar (`/news.html`)

**Talabalar shaharchasi**

- `/shaharcha.html` — yuqoridagi menyudagi "Shaharcha" tugmasi orqali ochiladi
- Turar joylar, qulayliklar, 4 bosqichli jarayon
- 11 ta ma'lumot sahifasi — to'liq ekranli modal oynalarda
- **"Yotoq xonaga qo'shilish"** ariza formasi

**Admin panel** — hammasi bitta joyda: Kontent, Yangiliklar, Natijalar,
Ajralib turish, Qiziqishlar, Hikoyalar, Galereya, Shaharcha, Shaharcha
sahifalari, Yotoqxona arizalari, Dasturlar, Fayllar, Sozlamalar, Adminlar.

### Arizalar

Yuborilgan arizalar bazada saqlanadi va **Yotoqxona arizalari** bo'limida
ko'rinadi. Ularni faqat `staff` roli ko'ra oladi — `editor` uchun bu bo'lim
umuman ochilmaydi. CSV tugmasi orqali Excel uchun yuklab olish mumkin.

### Keyinchalik ikkiga ajratmoqchi bo'lsangiz

Loyiha `SITE_PROFILE` bilan boshqariladi. Hozir u `all` — ikkalasi birga.
Ikkita alohida saytga ajratish uchun: `node tools/build-sites.js` —
natijada `dist-sites/` papkasida uchala variant tayyor bo'ladi.

## Yangi imkoniyatlar (dizayn + Imora AI)

**1. Shisha (glass) kartalar** — barcha kartalar 90% shaffof va dumaloq burchakli.
Sozlash: `public/css/ku-theme.css` ichida bitta joydan o'zgartiriladi:
`--ku-card-alpha` (shaffoflik), `--ku-card-radius` (burchak), `--ku-card-blur` (xiralik).

**2. 5 ta shrift** — Syne · TAN-MERMAID · Northwell · Comfortaa · Brittany Signature.
Syne va Comfortaa Google Fonts orqali avtomatik keladi. Qolgan 3 tasi premium —
fayllarini `public/fonts/` ichiga qo'ying (`public/fonts/README-SHRIFTLAR.txt` ga qarang).
Fayl bo'lmasa sayt buzilmaydi, zaxira shrift ishlatiladi.

**3. Kokand University Imora AI — jonli statistika**

- **Saytda:** har bir karta / reklama / bo'limning ustida uni **necha kishi ko'rgani**
  jonli ko'rinadi (👁 badge, real vaqtda yangilanadi).
- **Admin panelda** (`📊 Imora AI — Statistika` bo'limi): sayt ishga tushgan kundan beri
  jami **tashrifchilar**, **qaysi vaqtda** ko'p kirilgani (soatlik grafik, Toshkent vaqti),
  **eng ko'p ko'rilgan / bosilgan / qidirilgan** narsalar va **faol sahifalar** —
  hammasi avtomatik yig'iladi va jadval/grafiklarda ko'rinadi.
- **Aniqlik:** har bir tashrifchi bitta elementni faqat **bir marta** sanaydi (server
  tomonda takror-himoya) — shuning uchun "ko'rishlar" = unikal odamlar soni, qayta-yuklash
  bilan sonni shishirib bo'lmaydi.
- **Maxfiylik:** hech qanday shaxsiy ma'lumot saqlanmaydi — faqat brauzer o'zi yaratgan
  tasodifiy `vid`. IP saqlanmaydi. Statistikani har qanday admin (staff/editor) ko'ra oladi.
- **Avtomatik tozalash:** eski yordamchi ma'lumot vaqti-vaqti bilan o'chiriladi (jadvallar
  cheksiz o'smaydi). Sozlash (ixtiyoriy): `METRICS_SEEN_RETENTION_DAYS` (default 180),
  `METRICS_HOURLY_RETENTION_DAYS` (default 730). Unikal tashrifchilar ro'yxati o'chirilmaydi.
- Statistika jadvallari bazada avtomatik yaratiladi (`metrics_*`) — SQLite va PostgreSQL'da bir xil.

## Xavfsizlik, SEO va production imkoniyatlari

- **SEO:** `robots.txt`, `sitemap.xml`, har sahifada `description`/`og:`/canonical teglari,
  o'zbekcha `og:locale`. (Domeningizni `public/sitemap.xml` va sahifalardagi
  `https://www.kokanduni.uz` manzilidan almashtiring.)
- **Ariza xabarnomasi:** yangi ariza kelganda **Telegram** yoki **webhook**ga darhol
  xabar (env: `TELEGRAM_BOT_TOKEN`+`TELEGRAM_CHAT_ID` yoki `NOTIFY_WEBHOOK_URL`).
- **Ikki bosqichli kirish (2FA):** admin panel → *Mening hisobim* → yoqiladi
  (Google Authenticator). Ixtiyoriy — yoqmaguncha oddiy login o'zgarmaydi.
- **Avtomatik zaxira (SQLite):** `data/backups/` ichiga har 24 soatda, oxirgi 14 tasi
  saqlanadi (`BACKUP_INTERVAL_HOURS`, `BACKUP_KEEP`). Postgres'da managed backup ishlatiladi.
- **Parolni unutish (break-glass):** `ADMIN_RESET="email:yangiparol"` bilan qayta ishga
  tushiring, keyin o'zgaruvchini olib tashlang.
- **Tezlik:** statik fayllarga (rasm/shrift/css/js) kesh sarlavhalari qo'yiladi.
- **Accessibility:** klaviatura fokus ko'rinishi, yuqori kontrast va reduced-motion rejimlari.
- **CI:** `.github/workflows/ci.yml` — har push/PR'da lint + testlar avtomatik ishlaydi.

Barcha sozlamalar `.env.example`da izohlangan.

## Port

Bu loyiha odatda **3000**-portda ishlaydi.
