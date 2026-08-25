# TalabaHub

**Talabalar uchun yagona platforma** — Qo‘qon talabalari hayotiga kerak bo‘lgan
xizmatlarni bitta saytda jamlaydi:

- 🏠 **Uy-joy** — universitetga yaqin turar joylar
- 🤝 **Hamxona** — ijara xarajatini bo‘lishadigan hamxona qidiruv
- 💼 **Ish** — dars jadvaliga mos part-time ish va stajirovka
- 🛒 **Bozor** — arzon jihoz, mebel, texnika, kitob (talabadan talabaga)
- 🎟️ **Chegirmalar** — sherik bizneslardan talabalarga maxsus chegirmalar

Bu — mustaqil, o‘ziga yetarli loyiha. `npm install` **shart emas** — baza
(SQLite) Node.js ichida keladi.

## Ishga tushirish

1. Node.js **22** yoki undan yangisi o‘rnatilgan bo‘lsin (https://nodejs.org).
2. Windows: `ISHGA-TUSHIRISH.bat` ni ikki marta bosing.
   Mac/Linux: terminalda `./ishga-tushirish.sh`.
3. Brauzerda oching: http://localhost:3100
4. Admin panel: http://localhost:3100/admin

## Login va parol

Birinchi ishga tushirishda parol berilmagan bo‘lsa, konsolga tasodifiy parol
chiqadi — uni saqlab qo‘ying. O‘zingiz belgilamoqchi bo‘lsangiz, `.env.example`
faylini `.env` deb nusxalang va parollarni yozing.

| Rol | Email | Nima qila oladi |
|---|---|---|
| staff | staff@talabahub.uz | Hammasi: xizmatlar, arizalar, sozlamalar, adminlar |
| editor | admin@talabahub.uz | Faqat kontent (e‘lonlar, matn, rasm) — arizalarni ko‘ra olmaydi |

## Daromad (monetizatsiya)

Har bir e‘lon (uy-joy, ish, bozor, sherik biznes) admin panelda **⭐ TOP**
(featured) bayrog‘iga ega. TOP yoqilgan e‘lon ro‘yxat tepasida, alohida nishon
bilan ko‘rinadi — bu **pullik joylashtirish** uchun. Uy egasi / ish beruvchi /
sherik biznes to‘lovni amalga oshirgach (Payme / Click / naqd), admin shu
e‘lonning TOP bayrog‘ini yoqadi.

Saytdagi **"E‘lon joylash / reklama"** formasi orqali kelgan so‘rovlar admin
panelning **Arizalar / Leadlar** bo‘limiga tushadi (CSV eksport bilan).

## Admin bo‘limlari

Kontent to‘liq bazadan keladi — admin panel faqat kerakli bo‘limlardan iborat:
Uy-joy · Hamxona · Ish · Bozor · Chegirmalar · Arizalar/Leadlar · Fayllar ·
Sayt sozlamalari · Adminlar · Mening hisobim.

**Brend nomi, shior, hero matni va aloqa ma‘lumotlari** — Admin →
**Sayt sozlamalari** bo‘limidan o‘zgartiriladi (kodga tegmasdan).

## Ma‘lumotlar qayerda saqlanadi

Barcha kontent `data/app.db` faylida (SQLite). Zaxira nusxa olayotganda
`data/` papkasini butunlay nusxalang — `app.db-wal` va `app.db-shm` fayllari
ham kerak.

Railway/VPS‘ga qo‘yganda diskingiz doimiy bo‘lmasa ma‘lumot yo‘qoladi —
PostgreSQL‘ga o‘tish yo‘riqnomasi: `MIGRATION-POSTGRES.md`.

## Texnik ma‘lumot

- Sof Node.js (built-in `http`), tashqi framework yo‘q. Yagona ishlab
  chiqarish bog‘liqligi — `pg` (PostgreSQL, production uchun ixtiyoriy).
- Sayt profillari (`SITE_PROFILE`): `hub` (standart, TalabaHub), shuningdek
  eski `university` / `castle` / `all` profillari saqlangan.
- `npm test` — testlar, `npm run lint` — linter.

## Portlar

Bu loyiha odatda **3100**-portda ishlaydi (`PORT` bilan o‘zgartiriladi).
