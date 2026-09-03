/* ============================================================
   Imora AI — kirish ovozi (inglizcha ovozli tanishtiruv)
   1) Saytga kirganda: "Welcome to Imora AI" (inglizcha)
   2) So'ng: Imora AI nima ekanligi haqida qisqa inglizcha izoh
   Manba: agar /media/intro-welcome.mp3 va /media/intro-about.mp3 bo'lsa —
   o'shalar ijro etiladi; aks holda brauzerning o'z inglizcha ovozi
   (Web Speech API) matnni o'qiydi. Matnlar admin paneldan tahrirlanadi.
   Brauzerlar avtoplay ovozini bloklagani uchun ovoz FOYDALANUVCHINING
   birinchi harakati (bosish/tegish/tugma) bilan boshlanadi.
   ============================================================ */
(function () {
  'use strict';
  var PLAY_KEY = 'imora_intro_played_v1'; // bir sessiyada bir marta
  var settings = {};
  var started = false, done = false, speaking = false;
  var audioEl = null, pill = null, gestureBound = false;

  function playedThisSession() { try { return sessionStorage.getItem(PLAY_KEY) === '1'; } catch (e) { return false; } }
  function markPlayed() { try { sessionStorage.setItem(PLAY_KEY, '1'); } catch (e) { /* ignore */ } }

  /* ---------- Web Speech (fallback) ---------- */
  function pickVoice() {
    if (!('speechSynthesis' in window)) return null;
    var vs = speechSynthesis.getVoices() || [];
    var en = vs.filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
    var pref = en.filter(function (v) { return /google|natural|samantha|aria|jenny|libby|microsoft|daniel|emma/i.test(v.name); });
    return pref[0] || en[0] || null;
  }
  function speak(text, cb) {
    if (!('speechSynthesis' in window) || !text) { if (cb) cb(); return; }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.98; u.pitch = 1.0; u.volume = 1.0;
    var v = pickVoice(); if (v) u.voice = v;
    u.onend = function () { if (cb) cb(); };
    u.onerror = function () { if (cb) cb(); };
    speechSynthesis.speak(u);
  }
  function speechFlow(welcome, about) {
    speaking = true; setPill('playing');
    var go = function () {
      speak(welcome, function () {
        speak(about, function () { speaking = false; finish(); });
      });
    };
    // Ovozlar asinxron yuklanadi — kerak bo'lsa kutamiz
    if ('speechSynthesis' in window && speechSynthesis.getVoices().length === 0) {
      var ran = false;
      speechSynthesis.onvoiceschanged = function () { if (ran) return; ran = true; go(); };
      setTimeout(function () { if (!ran) { ran = true; go(); } }, 500);
    } else { go(); }
  }

  /* ---------- MP3 fayllari (agar mavjud bo'lsa) ---------- */
  function fileExists(url, cb) {
    try {
      fetch(url, { method: 'HEAD' }).then(function (r) { cb(r.ok); }).catch(function () { cb(false); });
    } catch (e) { cb(false); }
  }
  function playFiles(welcomeUrl, aboutUrl) {
    speaking = true; setPill('playing');
    audioEl = new Audio(welcomeUrl);
    audioEl.addEventListener('ended', function () {
      audioEl = new Audio(aboutUrl);
      audioEl.addEventListener('ended', function () { speaking = false; finish(); });
      audioEl.play().catch(function () { speaking = false; finish(); });
    });
    audioEl.play().catch(function () { /* bloklansa — Web Speech'ga o'tamiz */ speechFlow(currentTexts.w, currentTexts.a); });
  }

  /* ---------- boshqaruv ---------- */
  var currentTexts = { w: '', a: '' };
  function start() {
    if (started) return; started = true; markPlayed();
    var welcome = settings.intro_welcome_text || 'Welcome to Imora AI.';
    var about = settings.intro_about_text || 'Imora AI is a human-centered, privacy-first live analytics platform.';
    currentTexts = { w: welcome, a: about };
    // 'mp3' rejimida — /media/ ichidagi tayyor fayllardan foydalanamiz;
    // aks holda (default 'on') brauzer ovozi matnni o'qiydi (fayl kerak emas).
    var mode = String(settings.intro_audio == null ? 'on' : settings.intro_audio).toLowerCase();
    if (mode === 'mp3') {
      fileExists('/media/intro-welcome.mp3', function (ok) {
        if (ok) playFiles('/media/intro-welcome.mp3', '/media/intro-about.mp3');
        else speechFlow(welcome, about);
      });
    } else {
      speechFlow(welcome, about);
    }
  }
  function stopAll() {
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    if (audioEl) { try { audioEl.pause(); } catch (e) { /* ignore */ } audioEl = null; }
    speaking = false;
  }
  function replay() { stopAll(); started = false; done = false; start(); }
  function finish() { done = true; setPill('done'); }

  /* ---------- floating control (pill) ---------- */
  function setPill(state) {
    if (!pill) return;
    var icon = pill.querySelector('.imora-intro__ico');
    var label = pill.querySelector('.imora-intro__label');
    if (state === 'playing') { icon.textContent = '🔊'; label.textContent = 'Ovozli tanishtiruv…'; pill.classList.add('is-playing'); }
    else if (state === 'done') { icon.textContent = '🔁'; label.textContent = 'Qayta eshitish'; pill.classList.remove('is-playing'); }
    else { icon.textContent = '🔊'; label.textContent = 'Ovozli tanishtiruv'; pill.classList.remove('is-playing'); }
  }
  function buildPill() {
    pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'imora-intro';
    pill.setAttribute('aria-label', 'Imora AI ovozli tanishtiruv');
    pill.innerHTML = '<span class="imora-intro__ico">🔊</span><span class="imora-intro__label">Ovozli tanishtiruv</span>';
    pill.addEventListener('click', function (e) {
      e.stopPropagation();
      if (speaking) { stopAll(); setPill('done'); done = true; }
      else if (done) { replay(); }
      else { start(); }
    });
    document.body.appendChild(pill);
    setPill('idle');
  }

  /* ---------- birinchi harakatda avtomatik boshlash ---------- */
  function bindFirstGesture() {
    if (gestureBound) return; gestureBound = true;
    var handler = function () {
      remove();
      if (!started) start();
    };
    var remove = function () {
      ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) {
        window.removeEventListener(ev, handler, { passive: true });
      });
    };
    ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) {
      window.addEventListener(ev, handler, { passive: true, once: true });
    });
  }

  function init() {
    fetch('/api/public/site').then(function (r) { return r.json(); }).then(function (data) {
      settings = (data && data.settings) || {};
      var on = String(settings.intro_audio == null ? 'on' : settings.intro_audio).toLowerCase();
      if (on === 'off' || on === '0' || on === 'no' || on === 'yoq') return; // o'chirilgan
      buildPill();
      if (!playedThisSession()) bindFirstGesture(); // birinchi harakatда avtomatik
      else setPill('done'); // sessiyada allaqachon eshitgan — faqat qayta eshitish tugmasi
    }).catch(function () { /* settings olinmasa — jim qolamiz */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
