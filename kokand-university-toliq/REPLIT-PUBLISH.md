# Imora AI saytini Replit'da publish qilish

Loyihada `.replit` va `replit.nix` fayllari bor — Replit uni avtomatik taniydi.

## Variant A — GitHub'dan import (eng oson, tavsiya etiladi)

1. https://replit.com ga kiring (o'z hisobingiz bilan).
2. Yuqori o'ngdagi **"Create Repl"** → **"Import from GitHub"**.
3. Repozitoriy: `oybekdavranov-rgb/zinnuraga-atalgan-`
   - Branch (shox): `claude/zipdagi-website-publish-yqp7va`
   - Agar papka so'rasa: `kokand-university-toliq`
4. **"Import"** → keyin katta **"Run"** tugmasini bosing.
5. Bir-ikki daqiqada o'ngda **Webview** ochiladi — bu sizning jonli saytingiz.
   Yuqoridagi havola (`https://...replit.dev`) — internetда ulashish uchun manzil.

## Variant B — Zip yuklab (GitHub'siz)

1. Replit'da bo'sh **Node.js** Repl yarating.
2. Fayllar panelida (chapda) uch nuqta (⋮) → **"Upload folder"** yoki zip'ni ochib yuklang.
3. **"Run"** tugmasini bosing.

## Admin panel

- Manzil: `sizning-saytingiz.replit.dev/admin/login`
- Dastlabki (dev) login/parol `.env.example` da ko'rsatilgan.
- ⚠️ **Muhim:** jonli saytда admin parolini albatta o'zgartiring
  (Replit **Secrets** bo'limida `DEFAULT_STAFF_PASSWORD` va boshqalarni qo'ying).

## Ma'lumotlar bazasi

- Standart holatda **SQLite** (dev) ishlaydi — sayt darhol ishga tushadi.
  Lekin Replit fayl tizimi vaqtinchalik: Repl qayta ishga tushса, kiritilgan
  ma'lumotlar (yangi arizalar va h.k.) o'chishi mumkin.
- **Doimiy** baza uchun bepul **Neon PostgreSQL** ulang:
  Replit **Secrets** ga `DATABASE_URL = postgres://...` qo'shing (qarang: `RENDER-DEPLOY.md`).

## Muhit o'zgaruvchilari (Secrets) — tavsiya

Replit → **Tools → Secrets**:
- `DEFAULT_STAFF_PASSWORD` — kuchli parol
- `SESSION_SECRET` — uzun tasodifiy satr
- (ixtiyoriy) `DATABASE_URL` — Neon PostgreSQL

Batafsil: `PRODUCTION.md`, `RENDER-DEPLOY.md`.
