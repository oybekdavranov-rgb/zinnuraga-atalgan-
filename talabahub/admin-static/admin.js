const state = {
  session: null,
  role: 'editor',
  elements: [],
  files: [],
  selectedId: null,
  currentView: 'content',
  collections: { news: [], achievements: [], distinctions: [], interests: [], stories: [], gallery: [], residences: [], roommates: [], jobs: [], market: [], partners: [], castle_pages: [], applications: [] },
  selected: { news: null, achievements: null, distinctions: null, interests: null, stories: null, gallery: null, residences: null, roommates: null, jobs: null, market: null, partners: null, castle_pages: null, applications: null },
  users: [],
  settings: {},
};

const VIEW_TITLES = {
  content: 'Kontent boshqaruvi',
  news: 'Yangiliklar',
  achievements: 'Natijalar',
  distinctions: 'Ajralib turish bo‘limlari',
  interests: '“Sizni qiziqtirishi mumkin” kartalar',
  stories: 'Hikoyalar (Stories)',
  gallery: 'Galereya (binolar va ichki koʻrinish)',
  residences: 'Uy-joy (turar joylar)',
  roommates: 'Hamxona qidiruv',
  jobs: 'Ish e‘lonlari',
  market: 'Talabalar bozori',
  partners: 'Chegirma beruvchi sheriklar',
  castle_pages: 'Shaharcha sahifalari (modal oynalar)',
  applications: 'Arizalar / Leadlar',
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
    { key: 'featured', label: '⭐ TOP (pullik — tepada, nishon bilan)', type: 'checkbox' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  roommates: [
    { key: 'title', label: 'Sarlavha', type: 'text', required: true, placeholder: 'Markazdan hamxona izlayapman' },
    { key: 'gender', label: 'Jinsi', type: 'text', placeholder: 'Erkak / Ayol' },
    { key: 'faculty', label: 'Fakultet / yoʻnalish', type: 'text' },
    { key: 'course', label: 'Kurs', type: 'text' },
    { key: 'area', label: 'Hudud', type: 'text', placeholder: 'Qoʻqon — markaz' },
    { key: 'budget', label: 'Byudjet', type: 'text', placeholder: 'Oyiga 700–900 ming' },
    { key: 'about', label: 'Oʻzi haqida / talab', type: 'textarea', rows: 5 },
    { key: 'contact', label: 'Aloqa (telefon/telegram)', type: 'text' },
    { key: 'image', label: 'Rasm (ixtiyoriy)', type: 'image' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  jobs: [
    { key: 'title', label: 'Ish nomi', type: 'text', required: true },
    { key: 'company', label: 'Kompaniya / ish beruvchi', type: 'text' },
    { key: 'jobtype', label: 'Turi', type: 'text', placeholder: 'Part-time / Masofaviy / Dam olish kunlari' },
    { key: 'pay', label: 'Toʻlov', type: 'text', placeholder: 'Soatiga 25 000 soʻm' },
    { key: 'area', label: 'Hudud', type: 'text', placeholder: 'Qoʻqon — markaz' },
    { key: 'description', label: 'Tavsif', type: 'textarea', rows: 6 },
    { key: 'contact', label: 'Aloqa (telefon/telegram)', type: 'text' },
    { key: 'link', label: 'Havola (ixtiyoriy)', type: 'text' },
    { key: 'featured', label: '⭐ TOP (pullik — tepada, nishon bilan)', type: 'checkbox' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  market: [
    { key: 'title', label: 'Mahsulot nomi', type: 'text', required: true },
    { key: 'category', label: 'Turkum', type: 'text', placeholder: 'Mebel / Texnika / Kitob' },
    { key: 'price', label: 'Narx', type: 'text', placeholder: '350 000 soʻm' },
    { key: 'condition', label: 'Holati', type: 'text', placeholder: 'Yangi / Ishlatilgan' },
    { key: 'area', label: 'Hudud', type: 'text', placeholder: 'Qoʻqon — markaz' },
    { key: 'description', label: 'Tavsif', type: 'textarea', rows: 6 },
    { key: 'contact', label: 'Aloqa (telefon/telegram)', type: 'text' },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'featured', label: '⭐ TOP (pullik — tepada, nishon bilan)', type: 'checkbox' },
    { key: 'sort', label: 'Tartib', type: 'number' },
  ],
  partners: [
    { key: 'name', label: 'Biznes nomi', type: 'text', required: true },
    { key: 'category', label: 'Turkum', type: 'text', placeholder: 'Kafe / Sport / Ta’lim / Xizmat' },
    { key: 'discount', label: 'Chegirma', type: 'text', placeholder: '-30% talabalarga' },
    { key: 'area', label: 'Hudud / manzil', type: 'text', placeholder: 'Qoʻqon — markaz' },
    { key: 'description', label: 'Tavsif', type: 'textarea', rows: 6 },
    { key: 'image', label: 'Rasm', type: 'image' },
    { key: 'link', label: 'Havola (ixtiyoriy)', type: 'text' },
    { key: 'featured', label: '⭐ TOP (pullik — tepada, nishon bilan)', type: 'checkbox' },
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
  { key: 'brand_name', label: 'Brend nomi (sarlavha va logoda)' },
  { key: 'brand_tagline', label: 'Shior (tagline)' },
  { key: 'hero_title', label: 'Bosh sahifa katta sarlavhasi' },
  { key: 'hero_intro', label: 'Bosh sahifa kirish matni', type: 'textarea' },
  { key: 'contact_phone', label: 'Telefon raqami' },
  { key: 'contact_email', label: 'Email manzili' },
  { key: 'contact_telegram', label: 'Telegram (masalan: @talabahub)' },
  { key: 'advertise_note', label: 'Reklama / e‘lon joylash haqida eslatma', type: 'textarea' },
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
    'gallery', 'residences', 'roommates', 'jobs', 'market', 'partners',
    'castle_pages', 'applications', 'programmes'];
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
  maybeHideEmptyContent();
}

/**
 * "Kontent" (element override) boʻlimi faqat cms-manifest.json bor saytlarda kerak.
 * TalabaHub'da manifest yoʻq — boʻlim boʻsh boʻladi, shuning uchun uni yashirib,
 * admin panelni soddalashtiramiz (birinchi mavjud boʻlimga oʻtamiz).
 */
function maybeHideEmptyContent() {
  if (state.elements.length > 0) return;
  const contentBtn = document.querySelector('.nav-btn[data-view="content"]');
  const contentView = document.getElementById('view-content');
  if (contentBtn) contentBtn.remove();
  if (contentView) { contentView.classList.remove('active'); contentView.style.display = 'none'; }
  if (statsGrid) statsGrid.style.display = 'none'; // element statistikasi (0/0/0) — hub'da keraksiz
  if (state.currentView === 'content') {
    const firstBtn = document.querySelector('.sidebar-nav .nav-btn');
    if (firstBtn) firstBtn.click();
  }
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
    if (f.type === 'checkbox') return checkbox(f.label, `cf-${f.key}`, Number(val) === 1 || val === true);
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
    if (!el) return;
    if (f.type === 'number') payload[f.key] = Number(el.value || 0);
    else if (f.type === 'checkbox') payload[f.key] = el.checked ? 1 : 0;
    else payload[f.key] = el.value;
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

/* ============================ NAV ============================ */
navButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const view = button.dataset.view;
    state.currentView = view;
    navButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    views.forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
    viewTitle.textContent = VIEW_TITLES[view] || '';
    try {
      if (['news', 'achievements', 'distinctions', 'interests', 'stories', 'gallery', 'residences', 'roommates', 'jobs', 'market', 'partners', 'castle_pages', 'applications', 'programmes'].includes(view)) { await loadCollection(view); }
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
