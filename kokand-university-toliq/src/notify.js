'use strict';
/**
 * Xabarnomalar — yangi ariza kelganda koordinatorga darhol yetkazadi.
 *
 * Ikki kanal (ixtiyoriy, env orqali yoqiladi):
 *   1) Telegram:  TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
 *   2) Webhook:   NOTIFY_WEBHOOK_URL  (istalgan xizmatga POST — email/CRM/Zapier)
 *
 * Ikkalasi ham o'rnatilmasa — modul jim turadi (sayt normal ishlaydi).
 * Har doim "fire-and-forget": javobni bloklamaydi, xato saytni sindirmaydi.
 */
const log = require('./logger');

function enabled() {
  return Boolean((process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) || process.env.NOTIFY_WEBHOOK_URL);
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`telegram ${res.status} ${t.slice(0, 150)}`);
  }
}

async function sendWebhook(payload) {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) return;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
}

/** Yangi yotoqxona arizasi haqida xabar (fire-and-forget). */
function notifyApplication(app) {
  if (!enabled()) return;
  const lines = [
    '🏠 <b>Yangi yotoqxona arizasi</b>',
    `👤 <b>Ism:</b> ${esc(app.name)}`,
    `📞 <b>Telefon:</b> ${esc(app.phone)}`,
    app.email ? `✉️ <b>Email:</b> ${esc(app.email)}` : '',
    app.faculty ? `🎓 <b>Fakultet:</b> ${esc(app.faculty)}` : '',
    app.course ? `📚 <b>Kurs:</b> ${esc(app.course)}` : '',
    app.city ? `📍 <b>Shahar:</b> ${esc(app.city)}` : '',
    app.residence ? `🏘 <b>Turar joy:</b> ${esc(app.residence)}` : '',
    app.duration ? `🗓 <b>Muddat:</b> ${esc(app.duration)}` : '',
    app.note ? `📝 <b>Izoh:</b> ${esc(app.note)}` : '',
    '',
    'ℹ️ Admin panel → Yotoqxona arizalari',
  ].filter(Boolean);
  const text = lines.join('\n');

  Promise.allSettled([
    sendTelegram(text),
    sendWebhook({ type: 'application', app, at: Date.now() }),
  ]).then((results) => {
    results.forEach((r) => { if (r.status === 'rejected') log.error('notify xato', { err: String(r.reason) }); });
  }).catch(() => { /* hech qachon saytni sindirmaydi */ });
}

module.exports = { notifyApplication, enabled };
