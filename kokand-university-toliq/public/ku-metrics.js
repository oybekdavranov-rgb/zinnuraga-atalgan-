/* ============================================================
   KOKAND UNIVERSITY — IMORA AI (frontend jonli hisoblagich)
   - Har karta / reklama / bo'lim necha kishi ko'rganini saytda ko'rsatadi
   - Bosishlar, qidiruvlar va tashriflarni serverга yuboradi
   - Ma'lumot manbai: POST /api/metrics/collect , GET /api/metrics/counts
   Hech qanday shaxsiy ma'lumot yuborilmaydi — faqat tasodifiy "vid".
   ============================================================ */
(function () {
  'use strict';

  var VID_KEY = 'ku_vid';
  var SEEN_KEY = 'ku_seen_views_v1';

  function uid() {
    try {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    } catch (e) { /* ignore */ }
    return 'v-' + Date.now().toString(36) + '-' + Math.random().toString(16).slice(2);
  }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  var VID = load(VID_KEY);
  if (!VID) { VID = uid(); store(VID_KEY, VID); }

  var seen = {};
  try { seen = JSON.parse(load(SEEN_KEY) || '{}') || {}; } catch (e) { seen = {}; }
  function markSeen(id) { seen[id] = 1; store(SEEN_KEY, JSON.stringify(seen)); }

  /* ---------------- hodisa navbati (batching) ---------------- */
  var queue = [];
  var flushTimer = null;
  function scheduleFlush() { if (!flushTimer) flushTimer = setTimeout(flush, 1500); }
  function enqueue(ev) { queue.push(ev); scheduleFlush(); }

  function flush() {
    flushTimer = null;
    if (!queue.length) return;
    var batch = queue.splice(0, 40);
    fetch('/api/metrics/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vid: VID, events: batch }),
      keepalive: true,
      credentials: 'same-origin'
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.counts) {
          Object.keys(d.counts).forEach(function (id) { updateBadge(id, d.counts[id]); });
        }
      })
      .catch(function () { /* statistika saytni sindirmaydi */ });
    if (queue.length) scheduleFlush();
  }

  /* ---------------- son formati (1.2k, 3.4M) ---------------- */
  function fmt(n) {
    n = Number(n) || 0;
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  /* ---------------- badge (ko'rishlar soni) ---------------- */
  var badges = {}; // id -> <span>
  function ensureBadge(el, id) {
    if (badges[id]) return badges[id];
    try {
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    } catch (e) { /* ignore */ }
    var b = document.createElement('span');
    b.className = 'ku-view-badge';
    b.setAttribute('title', 'Bu bo‘limni necha kishi ko‘rgani (jonli)');
    b.innerHTML = '<span class="ku-view-badge__eye" aria-hidden="true">👁️</span>' +
      '<span class="ku-view-badge__n">0</span>';
    el.appendChild(b);
    badges[id] = b;
    return b;
  }
  function updateBadge(id, n) {
    var b = badges[id];
    if (!b) return;
    var nEl = b.querySelector('.ku-view-badge__n');
    if (!nEl) return;
    var next = fmt(n);
    if (nEl.textContent === next) return;
    nEl.textContent = next;
    b.classList.add('is-live');
    setTimeout(function () { b.classList.remove('is-live'); }, 700);
  }

  /* ---------------- kuzatiladigan elementlar ---------------- */
  var tracked = {};   // id -> true
  var trackedIds = [];

  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var id = el.getAttribute('data-track-id');
      io.unobserve(el);
      if (id && !seen[id]) {
        markSeen(id);
        enqueue({ type: 'view', id: id, label: el.getAttribute('data-track-label') || '' });
      }
    });
  }, { threshold: 0.5 }) : null;

  // Badge FAQAT kontent kartalarida ko'rinsin — navigatsiya menyusi, sarlavha,
  // dropdown havolalarida EMAS (ular baribir kuzatiladi, lekin badge chiqmaydi).
  var BADGE_SKIP = 'nav, header, .menu, .menu-item, .sub-menu, .navbar, .dropdown, .submenu,'
    + ' [role="navigation"], .hd,'
    // Modal / popup / overlay oynalari — ichidagi kartalarga badge qo'ymaymiz
    + ' .ku-modal, .ku-modal-overlay, .modal, .modal-overlay, .modal-backdrop, .modal-dialog,'
    + ' .modal-content, .overlay, .popup, .popupbar-overlay, .dlg, .g-dlg, .lightbox,'
    + ' [role="dialog"], [aria-modal="true"]';
  function shouldShowBadge(el) {
    try {
      if (el.closest(BADGE_SKIP)) return false;
    } catch (e) { /* ignore */ }
    var w = el.offsetWidth, h = el.offsetHeight;
    if (w && h && (w < 140 || h < 80)) return false; // juda kichik / inline element
    return true;
  }

  function register(el, id, label) {
    if (!id || tracked[id]) return;
    if (el.getAttribute('data-track-id') !== id) el.setAttribute('data-track-id', id);
    if (label && !el.getAttribute('data-track-label')) el.setAttribute('data-track-label', label);
    tracked[id] = true;
    trackedIds.push(id);
    if (shouldShowBadge(el)) ensureBadge(el, id);
    if (io) io.observe(el); else if (!seen[id]) { markSeen(id); enqueue({ type: 'view', id: id, label: label || '' }); }
  }

  /* --- 1) Aniq belgilangan elementlar (data-track-id qo'yilgan) --- */
  function scanExplicit() {
    var els = document.querySelectorAll('[data-track-id]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.__kuTracked) continue;
      el.__kuTracked = true;
      register(el, el.getAttribute('data-track-id'), el.getAttribute('data-track-label') || '');
    }
  }

  /* --- 2) Avto-belgilash: kartalar/reklama/bo'limlar --- */
  var AUTO_SELECTORS = [
    '.pcard', '.g-card', '.ku-story-card', '.ku-ach-card',
    '.greenes-post-container', '.greenes-page',
    '.feat', '.step',
    '.residence-card', '.sh-card', '.info-card', '.tj-card',
    '.cta', '.banner', '[data-track-auto]'
  ];
  function labelOf(el) {
    var h = el.querySelector('h1,h2,h3,h4,h5,.title,[class*="title"]');
    var t = (h && h.textContent ? h.textContent : (el.getAttribute('aria-label') || el.title || '')).trim();
    return t.replace(/\s+/g, ' ').slice(0, 90);
  }
  function autoScan() {
    var page = location.pathname.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home';
    AUTO_SELECTORS.forEach(function (sel) {
      var els;
      try { els = document.querySelectorAll(sel); } catch (e) { return; }
      var idx = 0;
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.__kuAuto || el.__kuTracked) { idx++; continue; }
        // juda kichik elementlarga badge qo'ymaymiz
        var w = el.offsetWidth, hgt = el.offsetHeight;
        if (w < 120 || hgt < 70) { el.__kuAuto = true; continue; }
        // ichki (nested) kartani ikki marta sanamaymiz
        if (el.closest('[data-track-id]') && el.closest('[data-track-id]') !== el) { el.__kuAuto = true; continue; }
        el.__kuAuto = true;
        var cleanSel = sel.replace(/[^a-z0-9]+/gi, '');
        register(el, 'auto:' + page + ':' + cleanSel + ':' + idx, labelOf(el));
        idx++;
      }
    });
  }

  /* ---------------- bosishlar (clicks) ---------------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest ? ev.target.closest('[data-track-id]') : null;
    if (t) {
      enqueue({ type: 'click', id: t.getAttribute('data-track-id'), label: t.getAttribute('data-track-label') || '' });
    }
  }, true);

  /* ---------------- qidiruvlar (search) ---------------- */
  function hookSearch() {
    var inputs = document.querySelectorAll('input[type="search"], form[role="search"] input, [data-ku-search] input, input[name="s"]');
    for (var i = 0; i < inputs.length; i++) {
      var inp = inputs[i];
      if (inp.__kuSearch) continue;
      inp.__kuSearch = true;
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var q = (e.target.value || '').trim();
          if (q) enqueue({ type: 'search', query: q });
        }
      });
    }
  }
  // Qidiruvni qo'lda ham chaqirish mumkin: kuTrackSearch('so'z')
  window.kuTrackSearch = function (q) {
    q = String(q || '').trim();
    if (q) enqueue({ type: 'search', query: q });
  };

  /* ---------------- jonli yangilanish (poll) ---------------- */
  function pollCounts() {
    if (!trackedIds.length) return;
    var ids = trackedIds.slice(0, 150).join(',');
    fetch('/api/metrics/counts?ids=' + encodeURIComponent(ids), { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.counts) Object.keys(d.counts).forEach(function (id) { updateBadge(id, d.counts[id]); });
      })
      .catch(function () { /* ignore */ });
  }

  /* ---------------- ishga tushirish ---------------- */
  function scanAll() { scanExplicit(); autoScan(); hookSearch(); }

  function init() {
    enqueue({ type: 'pageview', path: location.pathname });
    scanAll();
    // Kartalar API'dan keyin (site-features.js) qo'shiladi — bir necha marta qayta skanlaymiz
    var rescans = 0;
    var timer = setInterval(function () {
      scanAll();
      if (trackedIds.length) pollCounts();
      if (++rescans >= 15) clearInterval(timer);
    }, 800);
    setTimeout(pollCounts, 1200);
    setInterval(pollCounts, 12000);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') flush();
    });
    window.addEventListener('pagehide', flush);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
