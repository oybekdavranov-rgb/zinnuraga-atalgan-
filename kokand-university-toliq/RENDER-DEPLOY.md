# 🚀 Bepul deploy — Render.com + Neon (PostgreSQL)

Bu yo'l **bepul**, **karta talab qilmaydi** va **ma'lumot saqlanadi** (arizalar,
kontent yo'qolmaydi). Taxminan 15 daqiqa.

Nega ikkita xizmat?
- **Neon** — bepul PostgreSQL bazasi (ma'lumot shu yerda doimiy saqlanadi).
- **Render** — bepul web server (saytni ishga tushiradi).

---

## 0-qadam: Kodni GitHub'ga joylang

Render GitHub'dan deploy qiladi. Loyihani o'z GitHub reponthizga yuklang
(agar hali qilmagan bo'lsangiz):

1. https://github.com/new — yangi repo yarating (masalan `kokand-university`).
2. Loyiha papkasini o'sha repoga yuklang (GitHub Desktop yoki `git push`).

> Kod yordamchisi (Claude) shu ishni siz uchun qilib berishi ham mumkin — ayting.

---

## 1-qadam: Neon — bepul PostgreSQL (3 daqiqa)

1. https://neon.tech → **Sign up** (GitHub bilan kirish mumkin, karta kerak emas).
2. **Create Project** → nom bering (masalan `kokand`) → **Create**.
3. Ochilgan sahifada **Connection string** ni ko'chiring. U shunga o'xshaydi:
   ```
   postgresql://user:parol@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
   Shuni saqlab qo'ying — keyin kerak bo'ladi (bu = `DATABASE_URL`).

---

## 2-qadam: Render — web xizmat (7 daqiqa)

1. https://render.com → **Get Started** (GitHub bilan kiring, karta kerak emas).
2. **New +** → **Web Service** → GitHub reponthizni ulang va tanlang.
3. Sozlamalar (ko'pi avtomatik `render.yaml` dan o'qiladi):
   - **Runtime:** Node
   - **Build Command:** `npm install --omit=dev`
   - **Start Command:** `node server.js`
   - **Plan:** **Free**
4. **Environment** (Muhit o'zgaruvchilari) bo'limiga qo'shing:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `NODE_VERSION` | `22` |
   | `DATABASE_URL` | *(1-qadamdagi Neon satri)* |
   | `DEFAULT_STAFF_EMAIL` | `staff@kokandu.uz` |
   | `DEFAULT_STAFF_PASSWORD` | *(kuchli parol o'ylab toping)* |
   | `DEFAULT_EDITOR_EMAIL` | `admin@kokandu.uz` |
   | `DEFAULT_EDITOR_PASSWORD` | *(kuchli parol o'ylab toping)* |
5. **Create Web Service** → deploy boshlanadi. Birinchi ishga tushishda baza
   jadvallari va standart kontent avtomatik yaratiladi.
6. Tepada saytingiz manzili chiqadi: `https://kokand-university.onrender.com`
7. `/<manzil>/admin/login` → kiring → **Mening hisobim**dan parolni almashtiring
   va 2FA'ni yoqing.

---

## Xabarnoma (ixtiyoriy, tavsiya)

Yangi ariza kelganda Telegram'ga xabar kelishi uchun Render **Environment**ga
qo'shing:
```
TELEGRAM_BOT_TOKEN = <@BotFather'dan olingan token>
TELEGRAM_CHAT_ID   = <@userinfobot yoki kanal id>
```

---

## Bilib qo'ying (bepul rejaning cheklovi)

- **Uyqu rejimi:** Render bepul xizmat 15 daqiqa harakatsizlikdan keyin uxlaydi;
  keyingi ochilish ~30–60 soniya sekin bo'ladi. Ma'lumot **yo'qolmaydi** (u Neon'da).
- **Yuklangan fayllar:** admin paneldan yangi yuklangan rasm/fayllar Render diskida
  vaqtinchalik (uyqudan keyin o'chishi mumkin). Kontent va arizalar esa **Neon'da
  doimiy saqlanadi**. Ko'p rasm yuklamoqchi bo'lsangiz, keyinroq Cloudinary/R2
  (bepul) ulash mumkin — ayting, sozlab beraman.
- **Doimiy domen:** `.onrender.com` bepul; o'z domeningizni (masalan `kokanduni.uz`)
  Render **Custom Domain**dan bepul ulash mumkin.

---

## Muammo bo'lsa

- Sayt ishga tushmasa → Render **Logs** bo'limiga qarang. Ko'pincha `DATABASE_URL`
  yoki parollar to'ldirilmagan bo'ladi (server ataylab to'xtaydi — bu xavfsizlik).
- Baza ulanmasa → Neon satri to'liq (`?sslmode=require` bilan) ekaniga ishonch hosil qiling.
