const state = {
  session: null,
  role: 'editor',
  elements: [],
  files: [],
  selectedId: null,
  currentView: 'content',
  collections: { news: [], achievements: [], distinctions: [], interests: [], stories: [], gallery: [], residences: [], castle_pages: [], applications: [] },
  selected: { news: null, achievements: null, distinctions: null, interests: null, stories: null, gallery: null, residences: null, castle_pages: null, applications: null },
  users: [],
  settings: {},
};

const VIEW_TITLES = {
  imora: 'Kokand University Imora AI — Statistika',
  content: 'Kontent boshqaruvi',
  news: 'Yangiliklar',
  achievements: 'Natijalar',
  distinctions: 'Ajralib turish bo‘limlari',
  interests: '“Sizni qiziqtirishi mumkin” kartalar',
  stories: 'Hikoyalar (Stories)',
  gallery: 'Galereya (binolar va ichki koʻrinish)',
  residences: 'Talabalar shaharchasi (turar joylar)',
  castle_pages: 'Shaharcha sahifalari (modal oynalar)',
  applications: 'Yotoqxona arizalari',
  programmes: 'Dasturlar (Programmes)',
  files: 'Fayl kutubxonasi',
  sitesettings: 'Sayt sozlamalari',
  users: 'Adminlar boshqaruvi',
  account: 'Mening hisobim',
};

const COLLECTION_FIELDS = {
  news: [
    { key: 'title', label: 'Sarlavha', type: 'text', required: true },
    { key: 'date', label: 'Sana', type: 'text', placeholder: '23-may 2026' },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'excerpt', label: 'Qisqa matn (kartada)', type: 'textarea', rows: 3 },
    { key: 'body', label: "To'liq matn (batafsil sahifada)", type: 'textarea', rows: 8 },
    { key: 'link', label: 'Tashqi havola (ixtiyoriy)', type: 'text' },
    { key: 'sort', label: 'Tartib raqami', type: 'number' },
  ],
  achievements: [
    { key: 'name', label: 'Ism / nom', type: 'text', required: true },
    { key: 'subtitle', label: 'Yutuq (qatorcha)', type: 'text' },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'description', label: 'Tavsif', type: 'textarea', rows: 6 },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  distinctions: [
    { key: 'title', label: 'Sarlavha', type: 'text', required: true },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'summary', label: 'Qisqa izoh (karta ostida)', type: 'textarea', rows: 2 },
    { key: 'body', label: "To'liq matn (modal oynada)", type: 'textarea', rows: 8 },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  interests: [
    { key: 'title', label: 'Sarlavha', type: 'text', required: true },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'body', label: 'Matn (modal oynada)', type: 'textarea', rows: 6 },
    { key: 'link', label: 'Havola (ixtiyoriy)', type: 'text' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  stories: [
    { key: 'title', label: 'Sarlavha', type: 'text', required: true },
    { key: 'date', label: 'Sana', type: 'text', placeholder: '18-iyul 2026' },
    { key: 'category', label: 'Turkum (kategoriya)', type: 'text', placeholder: 'Talaba hayoti / Karyera / Yutuqlar' },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'excerpt', label: 'Qisqa matn (kartada)', type: 'textarea', rows: 3 },
    { key: 'body', label: "To'liq matn (modal oynada)", type: 'textarea', rows: 8 },
    { key: 'link', label: 'Tashqi havola (ixtiyoriy)', type: 'text' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  applications: [
    { key: 'name', label: 'Ism-familiya', type: 'text', required: true },
    { key: 'phone', label: 'Telefon', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'gender', label: 'Jinsi', type: 'text' },
    { key: 'faculty', label: 'Fakultet / yoʻnalish', type: 'text' },
    { key: 'course', label: 'Kurs', type: 'text' },
    { key: 'city', label: 'Shahar / tuman', type: 'text' },
    { key: 'residence', label: 'Turar joy varianti', type: 'text' },
    { key: 'duration', label: 'Muddat', type: 'text' },
    { key: 'note', label: 'Izoh', type: 'textarea', rows: 4 },
    { key: 'status', label: 'Holati (yangi / koʻrildi / tasdiqlandi / rad etildi)', type: 'text' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  castle_pages: [
    { key: 'title', label: 'Sahifa nomi', type: 'text', required: true },
    { key: 'slug', label: 'Kalit (slug)', type: 'text', placeholder: 'joylashuvlar / tarix / xalqaro' },
    { key: 'icon', label: 'Ikonka nomi', type: 'text', placeholder: 'map-pin / compass / hands / speech' },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'summary', label: 'Qisqa matn (kartada)', type: 'textarea', rows: 2 },
    { key: 'body', label: "To'liq matn (**qalin** ishlatish mumkin)", type: 'textarea', rows: 10 },
    { key: 'faq', label: 'Savol-javob ("Savol :: Javob" har qatorda)', type: 'textarea', rows: 8 },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  residences: [
    { key: 'name', label: 'Nomi', type: 'text', required: true },
    { key: 'city', label: 'Joylashuv', type: 'text', placeholder: 'Qoʻqon — markaz' },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'summary', label: 'Qisqa matn (kartada)', type: 'textarea', rows: 2 },
    { key: 'description', label: "To'liq matn (modal oynada)", type: 'textarea', rows: 8 },
    { key: 'amenities', label: 'Qulayliklar (har qatorda bittadan)', type: 'textarea', rows: 6 },
    { key: 'price', label: 'Narx yorligʻi', type: 'text', placeholder: 'Oyiga — qulay narx' },
    { key: 'link', label: 'Havola (ixtiyoriy)', type: 'text' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  gallery: [
    { key: 'title', label: 'Sarlavha', type: 'text', required: true },
    { key: 'category', label: 'Turkum', type: 'text', placeholder: 'Binolar / Ichki koʻrinish / Kampus hayoti' },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'description', label: "To'liq matn (modal oynada)", type: 'textarea', rows: 8 },
    { key: 'video', label: 'YouTube video havolasi (ixtiyoriy)', type: 'text', placeholder: 'https://www.youtube.com/watch?v=...' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  programmes: [
    { key: 'key', label: 'Kalit (menyu bilan bog‘lanish)', type: 'text', placeholder: 'bakalavr / tezlashtirilgan / qayta / tayyorlov' },
    { key: 'title', label: 'Dastur nomi', type: 'text', required: true },
    { key: 'subtitle', label: 'Qatorcha (subtitle)', type: 'text' },
    { key: 'image', label: 'Hero rasm', type: 'image' },
    { key: 'intro', label: 'Kirish matni', type: 'textarea', rows: 4 },
    { key: 'highlights', label: 'Afzalliklar (har qatorda bittadan)', type: 'textarea', rows: 6 },
    { key: 'faq', label: 'FAQ ("Savol :: Javob" har qatorda)', type: 'textarea', rows: 6 },
    { key: 'link', label: 'Ariza havolasi', type: 'text' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
};

const SETTINGS_FIELDS = [
  { key: 'news_title', label: 'Yangiliklar bo‘limi sarlavhasi' },
  { key: 'distinctions_title', label: 'Ajralib turish bo‘limi sarlavhasi' },
  { key: 'interests_title', label: '"Qiziqtirishi mumkin" sarlavhasi' },
  { key: 'results_title', label: 'Natijalar modal sarlavhasi' },
  { key: 'results_intro', label: 'Natijalar modal izohi', type: 'textarea' },
  { key: 'our_tutors_url', label: 'Our Tutors havolasi (eslatma)' },
  { key: 'stories_url', label: 'Stories havolasi (eslatma)' },
  { key: 'gallery_title', label: 'Galereya sarlavhasi' },
  { key: 'gallery_intro', label: 'Galereya izohi', type: 'textarea' },
  { key: 'gallery_video_url', label: 'Galereya orqa-fon YouTube video havolasi' },
  { key: 'castle_title', label: 'Shaharcha sarlavhasi' },
  { key: 'castle_intro', label: 'Shaharcha izohi', type: 'textarea' },
  { key: 'castle_phone', label: 'Shaharcha telefon raqami' },
  { key: 'castle_email', label: 'Shaharcha email manzili' },
  { key: 'university_url', label: 'Universitet sayti manzili (shaharcha alohida sayt bo‘lganda)' },
  // ——— Aloqa ma'lumotlari (footer va "Biz bilan bog‘lanish" modalida ko‘rinadi) ———
  { key: 'contact_email', label: '📧 Aloqa: Email' },
  { key: 'contact_phone', label: '📱 Aloqa: Telefon (masalan +998 90 123 45 67)' },
  { key: 'contact_telegram', label: '✈️ Aloqa: Telegram (@nom yoki https://t.me/nom)' },
  { key: 'contact_instagram', label: '📸 Aloqa: Instagram (@nom yoki havola)' },
  { key: 'contact_youtube', label: '▶️ Aloqa: YouTube (kanal havolasi)' },
  { key: 'contact_hours', label: '🕒 Aloqa: Ish vaqti' },
  { key: 'contact_address', label: '📍 Aloqa: Manzil' },
  { key: 'contact_website', label: '🌐 Aloqa: Veb-sayt' },
];

const viewTitle = document.getElementById('viewTitle');
const userInfo = document.getElementById('userInfo');
const roleBadge = document.getElementById('roleBadge');
const statsGrid = document.getElementById('statsGrid');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const elementList = document.getElementById('elementList');
const editorPane = document.getElementById('editorPane');
const selectedType = document.getElementById('selectedType');
const listCount = document.getElementById('listCount');
const fileList = document.getElementById('fileList');
const fileCount = document.getElementById('fileCount');
const uploadForm = document.getElementById('uploadForm');
const uploadInput = document.getElementById('uploadInput');
const uploadMessage = document.getElementById('uploadMessage');
const settingsForm = document.getElementById('settingsForm');
const settingsMessage = document.getElementById('settingsMessage');
const logoutBtn = document.getElementById('logoutBtn');

const navButtons = [...document.querySelectorAll('.nav-btn')];
const views = [...document.querySelectorAll('.view')];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setMessage(el, text, type = '') {
  if (!el) return;
  el.textContent = text;
  el.className = `form-message ${type}`.trim();
}

function getCookie(name) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop()) : '';
}

function withCsrf(options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    options.headers = Object.assign({}, options.headers, { 'X-CSRF-Token': getCookie('ku_csrf') });
  }
  return options;
}

async function api(url, options = {}) {
  const res = await fetch(url, withCsrf(options));
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'So‘rov bajarilmadi');
  }
  return data;
}

async function loadSession() {
  const data = await api('/api/admin/session');
  if (!data.authenticated) {
    window.location.href = '/admin/login';
    return;
  }
  state.session = data.user;
  state.role = data.user.role || 'editor';
  state.enabled = Array.isArray(data.collections) ? data.collections : null;
  userInfo.textContent = `Login: ${data.user.email}`;
  if (data.profileLabel) {
    document.title = `${data.profileLabel} — Admin`;
    const pill = document.getElementById('brandPill');
    if (pill) pill.textContent = `${data.profileLabel} CMS`;
  }
  applyProfile();
  applyRole();
}

/**
 * Bu saytda mavjud bo'lmagan to'plamlar uchun menyu tugmalarini olib tashlaymiz
 * (masalan, faqat Shaharcha sayti ishlayotganda "Yangiliklar" bo'limi keraksiz).
 */
function applyProfile() {
  if (!state.enabled) return;
  const known = ['news', 'achievements', 'distinctions', 'interests', 'stories',
    'gallery', 'residences', 'castle_pages', 'applications', 'programmes'];
  for (const btn of navButtons) {
    const view = btn.dataset.view;
    if (known.includes(view) && !state.enabled.includes(view)) btn.remove();
  }
}

function applyRole() {
  const isStaff = state.role === 'staff';
  roleBadge.textContent = isStaff ? 'Staff admin — to‘liq huquq' : 'Editor — matn/rasm/link';
  roleBadge.classList.toggle('staff', isStaff);
  document.querySelectorAll('.staff-only').forEach((el) => {
    el.style.display = isStaff ? '' : 'none';
  });
  if (!isStaff) {
    const videoOpt = typeFilter.querySelector('option[value="video"]');
    if (videoOpt) videoOpt.remove();
  }
}

/* ============================ KONTENT (elementlar) ============================ */
async function loadElements() {
  const data = await api('/api/admin/elements');
  state.elements = data.elements;
  renderStats(data.summary);
  if (!state.selectedId && state.elements.length) {
    state.selectedId = getFilteredElements()[0]?.id || null;
  }
  renderElementList();
  renderEditor();
}

async function loadFiles() {
  const data = await api('/api/admin/files');
  state.files = data.files;
  renderFiles();
}

function renderStats(summary) {
  const stats = [
    ['Jami', summary.total],
    ['Text', summary.text],
    ['Link', summary.links],
    ['Image', summary.images],
    ['Video', summary.videos],
    ['O‘zgargan', summary.overridden],
  ];
  statsGrid.innerHTML = stats.map(([label, value]) => `<span class="stat-pill">${label}: ${value}</span>`).join('');
}

function getFilteredElements() {
  const query = searchInput.value.trim().toLowerCase();
  const filter = typeFilter.value;
  return state.elements.filter((item) => {
    if (state.role !== 'staff' && item.type === 'video') return false;
    const matchesType = filter === 'all' || item.type === filter;
    const haystack = `${item.id} ${item.label} ${item.context} ${JSON.stringify(item.current)}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesType && matchesQuery;
  });
}

function renderElementList() {
  const filtered = getFilteredElements();
  listCount.textContent = `${filtered.length} ta`;
  if (!filtered.some((item) => item.id === state.selectedId)) {
    state.selectedId = filtered[0]?.id || null;
  }
  elementList.innerHTML = filtered.length
    ? filtered
        .map(
          (item) => `
            <article class="element-item ${item.id === state.selectedId ? 'active' : ''}" data-id="${item.id}">
              <h4>${escapeHtml(item.label || item.id)}</h4>
              <div class="muted small">${escapeHtml(item.context)}</div>
              <div class="meta-row">
                <span class="meta-chip">${item.type}</span>
                <span class="meta-chip">${item.tag}</span>
                ${item.hasOverride ? '<span class="meta-chip">override</span>' : ''}
              </div>
            </article>`
        )
        .join('')
    : '<div class="empty-state">Mos element topilmadi.</div>';

  [...elementList.querySelectorAll('.element-item')].forEach((item) => {
    item.addEventListener('click', () => {
      state.selectedId = item.dataset.id;
      renderElementList();
      renderEditor();
    });
  });
}

function fileOptions(accept = 'all') {
  const filtered = state.files.filter((file) => {
    if (accept === 'image') return file.mime_type.startsWith('image/');
    if (accept === 'video') return file.mime_type.startsWith('video/');
    return true;
  });
  const options = ['<option value="">Kutubxonadan tanlang</option>'];
  for (const file of filtered) {
    options.push(`<option value="${escapeHtml(file.public_path)}">${escapeHtml(file.original_name)}</option>`);
  }
  return options.join('');
}

function field(label, inputHtml, helper = '') {
  return `<label><span>${label}</span>${inputHtml}${helper ? `<div class="helper">${helper}</div>` : ''}</label>`;
}

function checkbox(label, id, checked) {
  return `<label class="checkbox-row"><input type="checkbox" id="${id}" ${checked ? 'checked' : ''}> <span>${label}</span></label>`;
}

function renderEditor() {
  const item = state.elements.find((entry) => entry.id === state.selectedId);
  if (!item) {
    editorPane.className = 'editor-pane empty-state';
    editorPane.textContent = 'Chap tomondan element tanlang.';
    selectedType.textContent = '';
    return;
  }
  selectedType.textContent = `${item.type} • ${item.id}`;
  editorPane.className = 'editor-pane';
  const current = item.current || {};
  const original = item.original || {};

  let specificFields = '';
  if (item.type === 'text') {
    specificFields = field('Text', `<textarea id="field-text" rows="8">${escapeHtml(current.text || '')}</textarea>`, 'Bu qiymat saytdagi matnni almashtiradi.');
  }
  if (item.type === 'link') {
    specificFields = `
      ${item.editableText ? field('Link text', `<input id="field-text" value="${escapeHtml(current.text || '')}">`) : ''}
      ${field('URL (havola)', `<input id="field-href" value="${escapeHtml(current.href || '')}">`, 'https://..., /ichki-yo‘l, #anchor, mailto:, tel: mumkin.')}
      ${field('Target', `<select id="field-target"><option value="_self" ${current.target === '_blank' ? '' : 'selected'}>Shu oynada</option><option value="_blank" ${current.target === '_blank' ? 'selected' : ''}>Yangi oynada</option></select>`)}`;
  }
  if (item.type === 'image') {
    specificFields = `
      ${field('Image URL', `<input id="field-src" value="${escapeHtml(current.src || '')}">`, 'Upload qilingan fayl URL yoki tashqi rasm linki.')}
      ${field('Kutubxonadan rasm', `<select id="file-picker">${fileOptions('image')}</select>`)}
      ${field('Alt text', `<input id="field-alt" value="${escapeHtml(current.alt || '')}">`)}
      ${field('Title', `<input id="field-title" value="${escapeHtml(current.title || '')}">`)}`;
  }
  if (item.type === 'video') {
    specificFields = `
      ${field('Video URL', `<input id="field-src" value="${escapeHtml(current.src || '')}">`, 'Upload qilingan MP4 yoki tashqi video URL.')}
      ${field('Kutubxonadan video', `<select id="file-picker">${fileOptions('video')}</select>`)}
      ${field('MIME type', `<input id="field-mimeType" value="${escapeHtml(current.mimeType || '')}" placeholder="video/mp4">`)}
      ${field('Poster URL', `<input id="field-poster" value="${escapeHtml(current.poster || '')}">`)}
      <div class="inline-actions">
        ${checkbox('Autoplay', 'field-autoplay', Boolean(current.autoplay))}
        ${checkbox('Controls', 'field-controls', Boolean(current.controls))}
        ${checkbox('Muted', 'field-muted', Boolean(current.muted))}
        ${checkbox('Loop', 'field-loop', Boolean(current.loop))}
      </div>`;
  }

  const linkExtras = item.type === 'link' ? '' : `
      ${field('Bosilganda ochiladigan link', `<input id="field-linkUrl" value="${escapeHtml(current.linkUrl || '')}">`, 'Istalgan text, image yoki video ustiga link bog‘lash mumkin.')}
      ${field('Link target', `<select id="field-linkTarget"><option value="_self" ${current.linkTarget === '_blank' ? '' : 'selected'}>Shu oynada</option><option value="_blank" ${current.linkTarget === '_blank' ? 'selected' : ''}>Yangi oynada</option></select>`)}`;

  editorPane.innerHTML = `
    <div class="editor-grid">
      <div class="preview-box"><strong>Context:</strong> ${escapeHtml(item.context)}<br><strong>Original:</strong> <code>${escapeHtml(JSON.stringify(original))}</code></div>
      <form id="elementForm" class="stack">
        ${specificFields}
        ${linkExtras}
        ${checkbox('Elementni yashirish', 'field-hide', Boolean(current.hide))}
        <div class="inline-actions">
          <button type="submit" class="primary-btn">Saqlash</button>
          <button type="button" id="resetBtn" class="secondary-btn">Original holatga qaytarish</button>
          <a href="/" target="_blank" rel="noreferrer" class="secondary-btn" style="text-decoration:none;display:inline-flex;align-items:center;">Saytni ko‘rish</a>
        </div>
      </form>
      <p id="editorMessage" class="form-message"></p>
    </div>`;

  const filePicker = document.getElementById('file-picker');
  if (filePicker) {
    filePicker.addEventListener('change', (event) => {
      if (!event.target.value) return;
      const srcField = document.getElementById('field-src');
      if (srcField) srcField.value = event.target.value;
    });
  }
  document.getElementById('elementForm').addEventListener('submit', saveCurrentElement);
  document.getElementById('resetBtn').addEventListener('click', resetCurrentElement);
}

async function saveCurrentElement(event) {
  event.preventDefault();
  const item = state.elements.find((entry) => entry.id === state.selectedId);
  if (!item) return;
  const messageEl = document.getElementById('editorMessage');
  const payload = { hide: document.getElementById('field-hide')?.checked || false };

  if (item.type === 'text') {
    payload.text = document.getElementById('field-text').value;
    payload.linkUrl = document.getElementById('field-linkUrl').value;
    payload.linkTarget = document.getElementById('field-linkTarget').value;
  }
  if (item.type === 'link') {
    if (item.editableText) payload.text = document.getElementById('field-text').value;
    payload.href = document.getElementById('field-href').value;
    payload.target = document.getElementById('field-target').value;
  }
  if (item.type === 'image') {
    payload.src = document.getElementById('field-src').value;
    payload.alt = document.getElementById('field-alt').value;
    payload.title = document.getElementById('field-title').value;
    payload.linkUrl = document.getElementById('field-linkUrl').value;
    payload.linkTarget = document.getElementById('field-linkTarget').value;
  }
  if (item.type === 'video') {
    payload.src = document.getElementById('field-src').value;
    payload.mimeType = document.getElementById('field-mimeType').value;
    payload.poster = document.getElementById('field-poster').value;
    payload.autoplay = document.getElementById('field-autoplay').checked;
    payload.controls = document.getElementById('field-controls').checked;
    payload.muted = document.getElementById('field-muted').checked;
    payload.loop = document.getElementById('field-loop').checked;
    payload.linkUrl = document.getElementById('field-linkUrl').value;
    payload.linkTarget = document.getElementById('field-linkTarget').value;
  }

  try {
    await api(`/api/admin/elements/${encodeURIComponent(item.id)}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    setMessage(messageEl, 'Saqlab qo‘yildi.', 'success');
    await loadElements();
  } catch (error) {
    setMessage(messageEl, error.message, 'error');
  }
}

async function resetCurrentElement() {
  const item = state.elements.find((entry) => entry.id === state.selectedId);
  if (!item) return;
  const messageEl = document.getElementById('editorMessage');
  try {
    await api(`/api/admin/elements/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
    setMessage(messageEl, 'Original holat tiklandi.', 'success');
    await loadElements();
  } catch (error) {
    setMessage(messageEl, error.message, 'error');
  }
}

/* ============================ FAYLLAR ============================ */
function renderFiles() {
  fileCount.textContent = `${state.files.length} ta`;
  fileList.innerHTML = state.files.length
    ? state.files
        .map(
          (file) => `
            <article class="file-item">
              <h4>${escapeHtml(file.original_name)}</h4>
              <div class="muted small">${escapeHtml(file.mime_type)} • ${(file.size_bytes / 1024 / 1024).toFixed(2)} MB</div>
              <a class="file-url" href="${escapeHtml(file.public_path)}" target="_blank" rel="noreferrer">${escapeHtml(file.public_path)}</a>
              <div class="file-actions">
                <button class="secondary-btn copy-btn" data-url="${escapeHtml(file.public_path)}">URL nusxalash</button>
                <button class="secondary-btn delete-file-btn" data-filename="${escapeHtml(file.filename)}">O‘chirish</button>
              </div>
            </article>`
        )
        .join('')
    : '<div class="empty-state">Hozircha fayl yo‘q.</div>';

  [...fileList.querySelectorAll('.copy-btn')].forEach((btn) => {
    btn.addEventListener('click', async () => { await navigator.clipboard.writeText(btn.dataset.url); alert('URL nusxalandi'); });
  });
  [...fileList.querySelectorAll('.delete-file-btn')].forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('Faylni o‘chirishni tasdiqlaysizmi?')) return;
      try { await api(`/api/admin/files/${encodeURIComponent(btn.dataset.filename)}`, { method: 'DELETE' }); await loadFiles(); }
      catch (error) { alert(error.message); }
    });
  });
}

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(uploadMessage, '');
  const file = uploadInput.files[0];
  if (!file) { setMessage(uploadMessage, 'Fayl tanlang.', 'error'); return; }
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch('/api/admin/files', withCsrf({ method: 'POST', body: formData }));
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Yuklashda xato');
    setMessage(uploadMessage, 'Fayl yuklandi.', 'success');
    uploadForm.reset();
    await loadFiles();
  } catch (error) { setMessage(uploadMessage, error.message, 'error'); }
});

/* ============================ UMUMIY CRUD (collections) ============================ */
async function loadCollection(name) {
  const data = await api(`/api/admin/${name}`);
  state.collections[name] = data.items || [];
  renderCollectionList(name);
  if (state.selected[name] == null) renderCollectionEmpty(name);
}

function fmtDate(ts) {
  const n = Number(ts);
  if (!n) return '';
  const d = new Date(n);
  const p = (x) => String(x).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function statusSlug(st) {
  const m = { 'yangi': 'new', 'ko\u2018rildi': 'seen', 'tasdiqlandi': 'ok', 'rad etildi': 'no' };
  return m[st] || 'new';
}

function titleKey(name) {
  const fields = COLLECTION_FIELDS[name];
  const preferred = fields.find((f) => f.key === 'title' || f.key === 'name');
  return preferred ? preferred.key : fields[0].key;
}

function renderCollectionList(name) {
  const items = state.collections[name];
  const listEl = document.getElementById(`${name}-list`);
  const countEl = document.getElementById(`${name}-count`);
  if (countEl) countEl.textContent = `${items.length} ta`;
  const isApp = name === 'applications';
  listEl.innerHTML = items.length
    ? items
        .map((it) => `
          <article class="collection-item ${state.selected[name] === it.id ? 'active' : ''}" data-id="${it.id}">
            <h4>${escapeHtml(it[titleKey(name)] || '(nomsiz)')}</h4>
            ${isApp ? `<div class="muted small">${escapeHtml(fmtDate(it.created_at))} &nbsp;·&nbsp; ${escapeHtml(it.phone || '')}</div>
            <div class="muted small">${escapeHtml([it.faculty, it.course, it.city].filter(Boolean).join(' · '))}</div>
            <div><span class="badge status-${statusSlug(it.status)}">${escapeHtml(it.status || 'yangi')}</span></div>`
            : `<div class="muted small">${escapeHtml(it.date || it.subtitle || it.summary || '')}</div>`}
            <div class="collection-item__actions">
              <button class="link-btn edit-btn" data-id="${it.id}">Tahrirlash</button>
              <button class="link-btn danger del-btn" data-id="${it.id}">O‘chirish</button>
            </div>
          </article>`)
        .join('')
    : '<div class="empty-state">Hozircha yozuv yo‘q.</div>';

  [...listEl.querySelectorAll('.edit-btn')].forEach((b) => b.addEventListener('click', () => {
    const item = items.find((x) => String(x.id) === b.dataset.id);
    state.selected[name] = item.id;
    renderCollectionList(name);
    renderCollectionForm(name, item);
  }));
  [...listEl.querySelectorAll('.del-btn')].forEach((b) => b.addEventListener('click', async () => {
    if (name === 'applications') {
      // Arizalar — qaytarilmas ma'lumot. Avval CSV zaxira olishni eslatamiz.
      const it = items.find((x) => String(x.id) === b.dataset.id);
      const who = it ? `${it.name} (${it.phone || 'telefonsiz'})` : 'bu ariza';
      if (!confirm(`DIQQAT: ${who} arizasi butunlay o‘chiriladi va qaytarilmaydi.\n\nAgar kerak bo‘lsa, avval "Excel (CSV) ga yuklab olish" tugmasi bilan zaxira oling.\n\nDavom etamizmi?`)) return;
    } else if (!confirm('O‘chirishni tasdiqlaysizmi?')) return;
    try {
      await api(`/api/admin/${name}/${b.dataset.id}`, { method: 'DELETE' });
      if (state.selected[name] === Number(b.dataset.id)) { state.selected[name] = null; renderCollectionEmpty(name); }
      await loadCollection(name);
    } catch (e) { alert(e.message); }
  }));
}

function renderCollectionEmpty(name) {
  const formEl = document.getElementById(`${name}-form`);
  formEl.className = 'collection-form empty-state';
  formEl.textContent = 'Chapdan tanlang yoki yangi qo‘shing.';
  const titleEl = document.getElementById(`${name}-form-title`);
  if (titleEl) titleEl.textContent = 'Tahrirlash';
}

function imageFieldHtml(key, label, value) {
  return `
    <label><span>${label}</span>
      <input id="cf-${key}" value="${escapeHtml(value || '')}" placeholder="/uploads/... yoki tashqi URL">
    </label>
    <div class="img-tools">
      <select class="cf-lib" data-target="cf-${key}">${fileOptions('image')}</select>
      <label class="upload-inline">Yuklash<input type="file" class="cf-upload" data-target="cf-${key}" accept="image/*" hidden></label>
      <span class="cf-preview" id="prev-${key}">${value ? `<img src="${escapeHtml(value)}" alt="">` : ''}</span>
    </div>`;
}

function renderCollectionForm(name, item) {
  const fields = COLLECTION_FIELDS[name];
  const formEl = document.getElementById(`${name}-form`);
  const titleEl = document.getElementById(`${name}-form-title`);
  const data = item || {};
  if (titleEl) titleEl.textContent = item ? 'Tahrirlash' : 'Yangi yozuv';
  formEl.className = 'collection-form';

  const fieldsHtml = fields.map((f) => {
    const val = data[f.key] != null ? data[f.key] : (f.type === 'number' ? 0 : '');
    if (f.type === 'image') return imageFieldHtml(f.key, f.label, val);
    if (f.type === 'textarea') return field(f.label, `<textarea id="cf-${f.key}" rows="${f.rows || 4}">${escapeHtml(val)}</textarea>`);
    if (f.type === 'number') return field(f.label, `<input id="cf-${f.key}" type="number" value="${escapeHtml(val)}">`);
    return field(f.label, `<input id="cf-${f.key}" value="${escapeHtml(val)}" placeholder="${escapeHtml(f.placeholder || '')}">`);
  }).join('');

  formEl.innerHTML = `
    <form id="cf-form-${name}" class="stack">
      ${fieldsHtml}
      <div class="inline-actions">
        <button type="submit" class="primary-btn">${item ? 'Saqlash' : 'Qo‘shish'}</button>
        <button type="button" class="secondary-btn" id="cf-cancel-${name}">Bekor qilish</button>
      </div>
      <p id="cf-msg-${name}" class="form-message"></p>
    </form>`;

  formEl.querySelectorAll('.cf-lib').forEach((sel) => sel.addEventListener('change', (e) => {
    const target = document.getElementById(e.target.dataset.target);
    if (e.target.value && target) { target.value = e.target.value; updatePreview(e.target.dataset.target); }
  }));
  formEl.querySelectorAll('.cf-upload').forEach((inp) => inp.addEventListener('change', async (e) => {
    const fileInput = e.target;
    if (!fileInput.files[0]) return;
    const fd = new FormData(); fd.append('file', fileInput.files[0]);
    try {
      const res = await fetch('/api/admin/files', withCsrf({ method: 'POST', body: fd }));
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Yuklashda xato');
      const target = document.getElementById(fileInput.dataset.target);
      if (target) { target.value = d.file.public_path; updatePreview(fileInput.dataset.target); }
      await loadFiles();
    } catch (err) { alert(err.message); }
  }));

  document.getElementById(`cf-cancel-${name}`).addEventListener('click', () => { state.selected[name] = null; renderCollectionList(name); renderCollectionEmpty(name); });
  document.getElementById(`cf-form-${name}`).addEventListener('submit', (e) => submitCollection(e, name, item));
}

function updatePreview(targetId) {
  const key = targetId.replace('cf-', '');
  const prev = document.getElementById(`prev-${key}`);
  const input = document.getElementById(targetId);
  if (prev && input) prev.innerHTML = input.value ? `<img src="${escapeHtml(input.value)}" alt="">` : '';
}

async function submitCollection(event, name, item) {
  event.preventDefault();
  const msg = document.getElementById(`cf-msg-${name}`);
  const payload = {};
  COLLECTION_FIELDS[name].forEach((f) => {
    const el = document.getElementById(`cf-${f.key}`);
    payload[f.key] = f.type === 'number' ? Number(el.value || 0) : el.value;
  });
  try {
    const url = item ? `/api/admin/${name}/${item.id}` : `/api/admin/${name}`;
    const method = item ? 'PUT' : 'POST';
    const data = await api(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setMessage(msg, 'Saqlandi.', 'success');
    state.selected[name] = data.item.id;
    await loadCollection(name);
    renderCollectionForm(name, data.item);
  } catch (error) { setMessage(msg, error.message, 'error'); }
}

document.querySelectorAll('[data-new]').forEach((btn) => btn.addEventListener('click', () => {
  const name = btn.dataset.new;
  state.selected[name] = null;
  renderCollectionList(name);
  renderCollectionForm(name, null);
}));

/* ============================ SAYT SOZLAMALARI (staff) ============================ */
async function loadSiteSettings() {
  const data = await api('/api/admin/settings');
  state.settings = data.settings || {};
  const form = document.getElementById('siteSettingsForm');
  form.innerHTML = SETTINGS_FIELDS.map((f) => {
    const val = state.settings[f.key] || '';
    if (f.type === 'textarea') return field(f.label, `<textarea id="ss-${f.key}" rows="3">${escapeHtml(val)}</textarea>`);
    return field(f.label, `<input id="ss-${f.key}" value="${escapeHtml(val)}">`);
  }).join('') + '<button type="submit" class="primary-btn">Saqlash</button>';
  form.onsubmit = async (e) => {
    e.preventDefault();
    const payload = {};
    SETTINGS_FIELDS.forEach((f) => { payload[f.key] = document.getElementById(`ss-${f.key}`).value; });
    try {
      await api('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setMessage(document.getElementById('siteSettingsMessage'), 'Sozlamalar saqlandi.', 'success');
    } catch (err) { setMessage(document.getElementById('siteSettingsMessage'), err.message, 'error'); }
  };
}

/* ============================ ADMINLAR (staff) ============================ */
async function loadUsers() {
  const data = await api('/api/admin/users');
  state.users = data.users || [];
  const listEl = document.getElementById('users-list');
  document.getElementById('users-count').textContent = `${state.users.length} ta`;
  listEl.innerHTML = state.users.map((u) => `
    <article class="collection-item" data-id="${u.id}">
      <h4>${escapeHtml(u.email)}</h4>
      <div class="muted small">Rol: <strong>${u.role === 'staff' ? 'Staff' : 'Editor'}</strong></div>
      <div class="collection-item__actions">
        <button class="link-btn edit-user" data-id="${u.id}">Tahrirlash</button>
        <button class="link-btn danger del-user" data-id="${u.id}">O‘chirish</button>
      </div>
    </article>`).join('');

  [...listEl.querySelectorAll('.edit-user')].forEach((b) => b.addEventListener('click', () => {
    const u = state.users.find((x) => String(x.id) === b.dataset.id);
    document.getElementById('user-form-title').textContent = 'Adminni tahrirlash';
    document.getElementById('user-id').value = u.id;
    document.getElementById('user-email').value = u.email;
    document.getElementById('user-password').value = '';
    document.getElementById('user-password').placeholder = 'Bo‘sh qoldirsangiz o‘zgarmaydi';
    document.getElementById('user-role').value = u.role;
  }));
  [...listEl.querySelectorAll('.del-user')].forEach((b) => b.addEventListener('click', async () => {
    if (!confirm('Bu adminni o‘chirishni tasdiqlaysizmi?')) return;
    try { await api(`/api/admin/users/${b.dataset.id}`, { method: 'DELETE' }); await loadUsers(); resetUserForm(); }
    catch (e) { alert(e.message); }
  }));
}

function resetUserForm() {
  document.getElementById('user-form-title').textContent = 'Yangi admin qo‘shish';
  document.getElementById('user-id').value = '';
  document.getElementById('user-email').value = '';
  document.getElementById('user-password').value = '';
  document.getElementById('user-password').placeholder = 'Yangi admin uchun parol';
  document.getElementById('user-role').value = 'editor';
  setMessage(document.getElementById('userMessage'), '');
}

const userForm = document.getElementById('userForm');
if (userForm) {
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('userMessage');
    const id = document.getElementById('user-id').value;
    const payload = {
      email: document.getElementById('user-email').value.trim(),
      password: document.getElementById('user-password').value,
      role: document.getElementById('user-role').value,
    };
    try {
      if (id) await api(`/api/admin/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      else await api('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setMessage(msg, 'Saqlandi.', 'success');
      resetUserForm();
      await loadUsers();
    } catch (error) { setMessage(msg, error.message, 'error'); }
  });
  document.getElementById('userResetBtn').addEventListener('click', resetUserForm);
}

/* ============================ HISOB (credentials) ============================ */
settingsForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(settingsMessage, '');
  try {
    const data = await api('/api/admin/change-credentials', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: document.getElementById('currentPassword').value,
        newEmail: document.getElementById('newEmail').value,
        newPassword: document.getElementById('newPassword').value,
      }),
    });
    setMessage(settingsMessage, 'Ma‘lumotlar yangilandi.', 'success');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    userInfo.textContent = `Login: ${data.user.email}`;
  } catch (error) { setMessage(settingsMessage, error.message, 'error'); }
});

logoutBtn.addEventListener('click', async () => {
  await api('/api/admin/logout', { method: 'POST' });
  window.location.href = '/admin/login';
});

searchInput.addEventListener('input', () => { renderElementList(); renderEditor(); });
typeFilter.addEventListener('change', () => { renderElementList(); renderEditor(); });

/* ============================ IMORA AI (statistika) ============================ */
function imoraEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
}
function imoraNum(n) { return (Number(n) || 0).toLocaleString('ru-RU'); }
function imoraDate(ts) {
  if (!ts) return '—';
  try { return new Date(Number(ts)).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch (e) { return '—'; }
}
function imoraPad(n) { return String(n).padStart(2, '0'); }

function imoraStat(label, value, sub) {
  return '<div class="imora-stat"><div class="imora-stat__v">' + imoraNum(value) + '</div>' +
    '<div class="imora-stat__l">' + imoraEsc(label) + '</div>' +
    (sub ? '<div class="imora-stat__s">' + imoraEsc(sub) + '</div>' : '') + '</div>';
}
function imoraBars(items, opts) {
  opts = opts || {};
  if (!items || !items.length) return '<p class="muted">Hozircha maʼlumot yoʻq.</p>';
  const max = Math.max(1, ...items.map((x) => Number(x.count != null ? x.count : x.hits) || 0));
  return '<ul class="imora-bars">' + items.map((x) => {
    const val = Number(x.count != null ? x.count : x.hits) || 0;
    const lbl = opts.hour ? (imoraPad(x.hour) + ':00') : (x.label || x.key || '—');
    const pct = Math.round((val / max) * 100);
    return '<li class="imora-bar"><span class="imora-bar__label" title="' + imoraEsc(lbl) + '">' + imoraEsc(lbl) + '</span>' +
      '<span class="imora-bar__track"><span class="imora-bar__fill" style="width:' + pct + '%"></span></span>' +
      '<span class="imora-bar__val">' + imoraNum(val) + '</span></li>';
  }).join('') + '</ul>';
}

async function loadImora() {
  const body = document.getElementById('imoraBody');
  if (body) body.innerHTML = '<p class="muted">Yuklanmoqda…</p>';
  let d;
  try { d = await api('/api/admin/metrics/summary'); }
  catch (e) { if (body) body.innerHTML = '<p class="form-message error">Statistikani yuklab boʻlmadi: ' + imoraEsc(e.message) + '</p>'; return; }

  const since = document.getElementById('imoraSince');
  if (since) since.textContent = 'Ishga tushgan sana: ' + imoraDate(d.launchDate) +
    ' · oxirgi yangilanish: ' + new Date(d.generatedAt || Date.now()).toLocaleTimeString('uz-UZ');

  const hours = d.byHourOfDay || [];
  const peak = hours.slice().sort((a, b) => b.hits - a.hits)[0];

  let html = '<div class="imora-stats">' +
    imoraStat('Jami tashrifchilar', d.totalVisitors, 'unikal qurilma') +
    imoraStat('Jami koʻrishlar', d.totalHits, 'sahifa ochilishi') +
    imoraStat('Bugun tashrif', d.todayVisitors, 'yangi tashrifchi') +
    imoraStat('Bugun koʻrish', d.todayHits, 'bugungi ochilish') +
    '</div>';

  html += '<div class="imora-cols">';
  html += '<div class="imora-panel"><h4>👁️ Eng koʻp koʻrilgan</h4>' + imoraBars(d.topViewed) + '</div>';
  html += '<div class="imora-panel"><h4>👆 Eng koʻp bosilgan</h4>' + imoraBars(d.topClicked) + '</div>';
  html += '<div class="imora-panel"><h4>🔎 Eng koʻp qidirilgan</h4>' + imoraBars(d.topSearched) + '</div>';
  html += '<div class="imora-panel"><h4>📄 Faol sahifalar</h4>' + imoraBars(d.topPaths) + '</div>';
  html += '<div class="imora-panel imora-panel--wide"><h4>🕐 Qaysi vaqtda koʻp kiriladi (soat · Toshkent)' +
    (peak && peak.hits ? ' — eng faol: ' + imoraPad(peak.hour) + ':00' : '') + '</h4>' +
    imoraBars(hours, { hour: true }) + '</div>';
  html += '</div>';

  if (body) body.innerHTML = html;
}

const imoraRefreshBtn = document.getElementById('imoraRefresh');
if (imoraRefreshBtn) imoraRefreshBtn.addEventListener('click', () => { loadImora().catch(() => {}); });

/* ============================ 2FA (account) ============================ */
function twofaMsg(text, type) {
  const el = document.getElementById('twofaMessage');
  if (el) { el.textContent = text; el.className = `form-message ${type || ''}`.trim(); }
}
async function load2fa() {
  const off = document.getElementById('twofaOff');
  const on = document.getElementById('twofaOn');
  const st = document.getElementById('twofaStatus');
  const setupArea = document.getElementById('twofaSetupArea');
  if (setupArea) setupArea.style.display = 'none';
  twofaMsg('', '');
  try {
    const d = await api('/api/admin/2fa/status');
    if (st) st.textContent = d.enabled ? 'Holat: yoqilgan ✅' : 'Holat: o‘chirilgan';
    if (off) off.style.display = d.enabled ? 'none' : 'block';
    if (on) on.style.display = d.enabled ? 'block' : 'none';
  } catch (e) { if (st) st.textContent = 'Holatni olishda xato: ' + e.message; }
}
(function wire2fa() {
  const setupBtn = document.getElementById('twofaSetupBtn');
  const enableBtn = document.getElementById('twofaEnableBtn');
  const disableBtn = document.getElementById('twofaDisableBtn');
  if (setupBtn) setupBtn.addEventListener('click', async () => {
    try {
      const d = await api('/api/admin/2fa/setup', { method: 'POST' });
      document.getElementById('twofaSecret').textContent = d.secret;
      document.getElementById('twofaOtpauth').textContent = d.otpauth;
      document.getElementById('twofaSetupArea').style.display = 'block';
      twofaMsg('', '');
    } catch (e) { twofaMsg(e.message, 'error'); }
  });
  if (enableBtn) enableBtn.addEventListener('click', async () => {
    const code = (document.getElementById('twofaCode').value || '').trim();
    try {
      await api('/api/admin/2fa/enable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
      twofaMsg('2FA yoqildi ✅ — keyingi kirishda kod so‘raladi.', 'success');
      await load2fa();
    } catch (e) { twofaMsg(e.message, 'error'); }
  });
  if (disableBtn) disableBtn.addEventListener('click', async () => {
    const password = document.getElementById('twofaDisablePw').value || '';
    try {
      await api('/api/admin/2fa/disable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      twofaMsg('2FA o‘chirildi.', 'success');
      document.getElementById('twofaDisablePw').value = '';
      await load2fa();
    } catch (e) { twofaMsg(e.message, 'error'); }
  });
})();

/* ============================ NAV ============================ */
navButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const view = button.dataset.view;
    state.currentView = view;
    navButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    views.forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
    viewTitle.textContent = VIEW_TITLES[view] || '';
    try {
      if (['news', 'achievements', 'distinctions', 'interests', 'stories', 'gallery', 'residences', 'castle_pages', 'applications', 'programmes'].includes(view)) { await loadCollection(view); }
      else if (view === 'imora') { await loadImora(); }
      else if (view === 'account') { await load2fa(); }
      else if (view === 'files') { await loadFiles(); }
      else if (view === 'sitesettings') { await loadSiteSettings(); }
      else if (view === 'users') { await loadUsers(); }
    } catch (error) { alert(error.message); }
  });
});

/* ============================ INIT ============================ */
(async function init() {
  try {
    await loadSession();
    await Promise.all([loadElements(), loadFiles()]);
  } catch (error) {
    alert(error.message);
  }
})();
