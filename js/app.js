// =============================================
//  Cornell Notes — app.js
//  The Complete Full-Stack Web Dev Bootcamp
//  Dr. Angela Yu / App Brewery
// =============================================

// ── Course sections ───────────────────────────
// Sections 1-6 confirmed from your Udemy sidebar.
// Remaining sections matched from course repo + Udemy description.
// If any name looks slightly off, just edit it here in this file!
const SECTIONS = [
  // ── Front-End ──
  "Section 1: Front-End Web Development",
  "Section 2: Introduction to HTML",
  "Section 3: Intermediate HTML",
  "Section 4: Multi-Page Websites",
  "Section 5: Introduction to CSS",
  "Section 6: CSS Properties",
  "Section 7: Intermediate CSS",
  "Section 8: Advanced CSS",
  "Section 9: Flexbox",
  "Section 10: Grid",
  "Section 11: Bootstrap",
  "Section 12: Web Design School — Capstone",
  // ── JavaScript ──
  "Section 13: Introduction to JavaScript ES6",
  "Section 14: Intermediate JavaScript",
  "Section 15: The Document Object Model (DOM)",
  "Section 16: Boss Level Challenge — The Dice Game",
  "Section 17: jQuery",
  // ── Back-End ──
  "Section 18: The Unix Command Line",
  "Section 19: Backend Web Development",
  "Section 20: Node.js",
  "Section 21: Express.js with Node.js",
  "Section 22: APIs — Application Programming Interfaces",
  "Section 23: Git, GitHub and Version Control",
  "Section 24: EJS",
  "Section 25: Boss Level Challenge — Blog Website",
  "Section 26: SQL",
  "Section 27: PostgreSQL",
  "Section 28: Authentication & Security",
  // ── React ──
  "Section 29: React.js",
  "Section 30: React Hooks",
  "Section 31: Deploying Your Web Application",
  "Section 32: Build Your Own API",
  // ── Web3 ──
  "Section 33: Web3 — Decentralised App Development",
  "Section 34: Blockchain Technology",
  "Section 35: Web3 Wallet Management",
  "Section 36: Capstone — Create Your Own Token",
  "Section 37: ICP Blockchain Development",
  "Section 38: Deploying to the ICP Blockchain",
  "Section 39: Building DeFi Projects",
  "Section 40: NFT Minting, Buying and Selling",
  "Section 41: Capstone — Build an NFT Marketplace",
];

// ── Note: the course currently has up to section ~41 on Udemy.
// If you see more sections in your sidebar, just add them above!

const STORAGE_KEY = 'appbrewery-cornell-notes';

let notes     = [];
let editingId = null;

// ── DOM refs ──────────────────────────────────
const viewList   = document.getElementById('view-list');
const viewEditor = document.getElementById('view-editor');
const notesList  = document.getElementById('notes-list');
const emptyState = document.getElementById('empty-state');
const searchInput   = document.getElementById('search');
const filterSection = document.getElementById('filter-section');
const sectionSelect = document.getElementById('section-select');
const btnNew    = document.getElementById('btn-new');
const btnList   = document.getElementById('btn-list');
const btnSave   = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const btnDelete = document.getElementById('btn-delete');
const topicInput   = document.getElementById('topic');
const dateInput    = document.getElementById('note-date');
const cuesInput    = document.getElementById('cues');
const notesInput   = document.getElementById('notes');
const summaryInput = document.getElementById('summary');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressPct  = document.getElementById('progress-pct');

// ── Init ──────────────────────────────────────
function init() {
  notes = loadNotes();
  populateSectionDropdowns();
  renderList();
  updateProgress();
  bindEvents();
}

// ── localStorage ──────────────────────────────
function loadNotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ── Dropdowns ─────────────────────────────────
function populateSectionDropdowns() {
  sectionSelect.innerHTML =
    `<option value="">— pick a section —</option>` +
    SECTIONS.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');

  const usedSections = [...new Set(notes.map(n => n.section).filter(Boolean))];
  filterSection.innerHTML =
    `<option value="">All sections</option>` +
    usedSections.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
}

// ── Progress ──────────────────────────────────
function updateProgress() {
  const noted = new Set(notes.map(n => n.section).filter(Boolean)).size;
  const total = SECTIONS.length;
  const pct = Math.round((noted / total) * 100);

  progressFill.style.width = pct + '%';
  progressText.textContent = `${noted} of ${total} sections noted`;
  progressPct.textContent  = pct + '%';
}

// ── List view ─────────────────────────────────
function renderList() {
  const query     = searchInput.value.trim().toLowerCase();
  const secFilter = filterSection.value;

  const filtered = notes
    .filter(note => {
      const matchSearch =
        note.topic.toLowerCase().includes(query)   ||
        note.notes.toLowerCase().includes(query)   ||
        note.cues.toLowerCase().includes(query)    ||
        note.section.toLowerCase().includes(query);
      const matchSection = !secFilter || note.section === secFilter;
      return matchSearch && matchSection;
    })
    .sort((a, b) => {
      const aNum = sectionNumber(a.section);
      const bNum = sectionNumber(b.section);
      return aNum !== bNum ? aNum - bNum : b.createdAt - a.createdAt;
    });

  notesList.innerHTML = filtered.map(note => `
    <div class="note-card" data-id="${note.id}" role="button" tabindex="0">
      <div class="note-card-body">
        <div class="note-card-title">${escapeHtml(note.topic || 'Untitled')}</div>
        <div class="note-card-meta">${escapeHtml(shortSection(note.section))} &nbsp;·&nbsp; ${formatDate(note.createdAt)}</div>
        <div class="note-card-preview">${escapeHtml(firstLine(note.notes))}</div>
      </div>
      <span class="badge">${escapeHtml(sectionNum(note.section))}</span>
    </div>
  `).join('');

  emptyState.style.display = filtered.length === 0 ? 'block' : 'none';

  notesList.querySelectorAll('.note-card').forEach(card => {
    card.addEventListener('click',   () => openEditor(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openEditor(card.dataset.id); });
  });

  populateSectionDropdowns();
  updateProgress();
}

// ── Editor ────────────────────────────────────
function openEditor(id = null) {
  editingId = id;

  if (id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    topicInput.value        = note.topic;
    sectionSelect.value     = note.section;
    dateInput.value         = note.dateLabel;
    cuesInput.value         = note.cues;
    notesInput.value        = note.notes;
    summaryInput.value      = note.summary;
    btnDelete.style.display = 'inline-block';
  } else {
    topicInput.value        = '';
    sectionSelect.value     = '';
    dateInput.value         = todayLabel();
    cuesInput.value         = '';
    notesInput.value        = '';
    summaryInput.value      = '';
    btnDelete.style.display = 'none';
  }

  showView('editor');
  topicInput.focus();
}

function saveNote() {
  const topic     = topicInput.value.trim();
  const section   = sectionSelect.value;
  const dateLabel = dateInput.value.trim();
  const cues      = cuesInput.value;
  const notesVal  = notesInput.value;
  const summary   = summaryInput.value;

  if (editingId) {
    const note = notes.find(n => n.id === editingId);
    if (note) Object.assign(note, { topic, section, dateLabel, cues, notes: notesVal, summary });
  } else {
    notes.push({
      id: crypto.randomUUID(),
      topic, section, dateLabel, cues,
      notes: notesVal, summary,
      createdAt: Date.now(),
    });
  }

  saveNotes();
  showView('list');
  renderList();
}

function deleteNote() {
  if (!editingId) return;
  if (!window.confirm('Delete this note? This cannot be undone.')) return;
  notes = notes.filter(n => n.id !== editingId);
  saveNotes();
  showView('list');
  renderList();
}

// ── View switching ────────────────────────────
function showView(name) {
  viewList.style.display   = name === 'list'   ? 'block' : 'none';
  viewEditor.style.display = name === 'editor' ? 'block' : 'none';
}

// ── Events ────────────────────────────────────
function bindEvents() {
  btnNew.addEventListener('click',    () => openEditor(null));
  btnList.addEventListener('click',   () => showView('list'));
  btnSave.addEventListener('click',   saveNote);
  btnCancel.addEventListener('click', () => showView('list'));
  btnDelete.addEventListener('click', deleteNote);
  searchInput.addEventListener('input',    renderList);
  filterSection.addEventListener('change', renderList);
}

// ── Utilities ─────────────────────────────────
function todayLabel() {
  return new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'short', year:'numeric' }).format(new Date());
}
function formatDate(ts) {
  return new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'short', year:'numeric' }).format(new Date(ts));
}
function firstLine(str) {
  return str.split('\n').find(l => l.trim()) || '';
}
function sectionNumber(s) {
  const m = s && s.match(/Section (\d+)/i);
  return m ? parseInt(m[1], 10) : 999;
}
function sectionNum(s) {
  const n = sectionNumber(s);
  return n < 999 ? '§' + n : '?';
}
function shortSection(s) {
  const m = s && s.match(/(Section \d+)/i);
  return m ? m[1] : (s || 'No section');
}
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

init();
