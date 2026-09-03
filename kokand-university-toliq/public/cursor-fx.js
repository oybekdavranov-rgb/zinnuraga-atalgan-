/* ============================================================
   Imora AI — maxsus kursor (UI/UX) + scroll animatsiyali effekt
   - Aniq nuqta (dot) + silliq quvib yuruvchi halqa (ring, lerp)
   - Havola/tugma/karta ustida halqa kattalashadi (interaktiv)
   - Scroll qilganда halqa aylanadi va yo'nalish ko'rsatadi
   - Faqat sichqonчали qurilmalarда (pointer: fine); touch va
     "reduced motion" rejimi hurmat qilinadi (o'chib turadi).
   ============================================================ */
(function () {
  'use strict';
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return; // sensorli ekran / reduced-motion — o'chiq

  var dot, ring, rx = -100, ry = -100, mx = -100, my = -100, raf = null;
  var hovering = false, scrollTimer = null, dir = 1;

  function build() {
    dot = document.createElement('div'); dot.className = 'imora-cur imora-cur--dot';
    ring = document.createElement('div'); ring.className = 'imora-cur imora-cur--ring';
    ring.innerHTML = '<svg viewBox="0 0 44 44" class="imora-cur__svg"><circle cx="22" cy="22" r="20"></circle></svg>';
    document.body.appendChild(ring); document.body.appendChild(dot);
    document.documentElement.classList.add('imora-cursor-on');
  }

  var HOVER_SEL = 'a, button, input, textarea, select, label, summary, [role="button"], '
    + '.greenes-page, .greenes-post, .ku-more-btn, [data-ku-programme], [data-ku-modal], '
    + '.who_we_are-icons__list li, .content_sections-image, .imora-intro, .nav-btn, '
    + '.ku-language-switcher button, [data-video-toggle]';

  function onMove(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    if (dot.style.opacity !== '1') { dot.style.opacity = '1'; ring.style.opacity = '1'; }
  }
  function onOver(e) {
    var t = e.target;
    var h = t && t.closest ? t.closest(HOVER_SEL) : null;
    if (!!h !== hovering) { hovering = !!h; ring.classList.toggle('is-hover', hovering); dot.classList.toggle('is-hover', hovering); }
  }
  function onDown() { ring.classList.add('is-down'); }
  function onUp() { ring.classList.remove('is-down'); }
  function onLeave() { dot.style.opacity = '0'; ring.style.opacity = '0'; }

  var lastScrollY = window.pageYOffset;
  function onScroll() {
    var y = window.pageYOffset;
    dir = y >= lastScrollY ? 1 : -1; lastScrollY = y;
    ring.classList.add('is-scrolling');
    ring.classList.toggle('is-down-dir', dir === 1);
    ring.classList.toggle('is-up-dir', dir === -1);
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () { ring.classList.remove('is-scrolling'); }, 550);
  }

  function loop() {
    // silliq quvib yurish (lerp)
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    raf = requestAnimationFrame(loop);
  }

  function init() {
    build();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    window.addEventListener('mouseout', function (e) { if (!e.relatedTarget && !e.toElement) onLeave(); }, { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    loop();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
