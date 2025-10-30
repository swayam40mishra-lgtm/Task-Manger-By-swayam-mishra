/* script.js — Task Manager (vanilla JS)
   By: (implicitly) me. For: Swayam Mishra.
   Paste as `script.js` and keep it deferred in index.html.
*/

/* ============================
   CONFIG & STORAGE
   ============================ */
const DB_KEY = 'tm_db_v1';
const HISTORY_DAYS_FOR_SUGGEST = 21; // how many past days to analyze
const STREAK_LOOKBACK = 30; // days to compute streaks

// helpers for dates
const todayStr = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};
const dayBefore = (dateStr, days = 1) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};

// init DB structure
function defaultDB() {
  return {
    lastLocalDate: todayStr(),
    tasksByDate: {
      // "2025-10-28": [ {id, text, category, time, done, createdAt, completedAt} ]
    },
    // metadata for analytics
    meta: {
      // optional: future settings
    }
  };
}
/* study-planner.js
   Vanilla JS for Study Planner (Mission 99 style)
   - Works with the HTML block provided earlier (IDs and data-day-* attributes)
   - Persists to localStorage under key: "ss_study_planner_v1"
   - Author: your obedient code monkey
*/

/* ============================
   Config & DB
   ============================ */
const DB_KEY = 'ss_study_planner_v1';

const defaultDB = () => ({
  config: {
    missionName: 'Mission 99 :75 HARD DAYS',
    studyTarget: 4,      // hours expected per day
    breakLen: 0.5,       // hours between breaks
    wakeTime: '',
    sleepTime: '',
    schoolEnabled: false,
    schoolFrom: '',
    schoolTo: ''
  },
  weekly: {
    monday:  { subjects: '', primary: '', suggest: '' },
    tuesday: { subjects: '', primary: '', suggest: '' },
    wednesday:{ subjects: '', primary: '', suggest: '' },
    thursday:{ subjects: '', primary: '', suggest: '' },
    friday:  { subjects: '', primary: '', suggest: '' },
    saturday:{ subjects: '', primary: '', suggest: '' },
    sunday:  { subjects: '', primary: '', suggest: '' }
  },
  savedPlans: [],  // {id, name, dateSaved, snapshot}
  quotes: Array(20).fill(''), // 20 slots
  history: { dailyStudyHours: {} } // { "2025-10-29": 3.5, ... }
});

let DB = null;

/* ============================
   Utilities
   ============================ */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const todayStr = (d = new Date()) => d.toISOString().slice(0,10); // YYYY-MM-DD
const dayBefore = (dateStr, n=1) => {
  const dt = new Date(dateStr + 'T00:00:00');
  dt.setDate(dt.getDate() - n);
  return dt.toISOString().slice(0,10);
};
const uid = (prefix='id_') => prefix + Math.random().toString(36).slice(2,9);
const safeNum = v => (isNaN(Number(v)) ? 0 : Number(v));

/* ============================
   Load / Save DB
   ============================ */
function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    DB = raw ? JSON.parse(raw) : defaultDB();
  } catch (e) {
    console.warn('Planner DB parse error, resetting', e);
    DB = defaultDB();
  }
  // ensure shape
  if (!DB.config) DB.config = defaultDB().config;
  if (!DB.weekly) DB.weekly = defaultDB().weekly;
  if (!DB.quotes || !Array.isArray(DB.quotes)) DB.quotes = defaultDB().quotes;
  if (!DB.history) DB.history = defaultDB().history;
  if (!DB.savedPlans) DB.savedPlans = [];
  saveDB();
}

function saveDB() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(DB));
  } catch(e) {
    console.error('Failed saving DB', e);
  }
}

/* ============================
   DOM Sync: render DB into inputs
   ============================ */
function renderConfigToUI() {
  $('#missionInput').value = DB.config.missionName || '';
  $('#studyTarget').value = DB.config.studyTarget ?? 4;
  $('#breakLen').value = DB.config.breakLen ?? 0.5;
  $('#wakeTime').value = DB.config.wakeTime || '';
  $('#sleepTime').value = DB.config.sleepTime || '';
  $('#schoolToggle').checked = !!DB.config.schoolEnabled;
  $('#schoolFrom').value = DB.config.schoolFrom || '';
  $('#schoolTo').value = DB.config.schoolTo || '';
  $('#missionName').textContent = DB.config.missionName || 'Mission';
}

function readUIToConfig() {
  DB.config.missionName = $('#missionInput').value.trim() || 'Mission 99 :75 HARD DAYS';
  DB.config.studyTarget = safeNum($('#studyTarget').value) || 0;
  DB.config.breakLen = safeNum($('#breakLen').value) || 0.5;
  DB.config.wakeTime = $('#wakeTime').value || '';
  DB.config.sleepTime = $('#sleepTime').value || '';
  DB.config.schoolEnabled = !!$('#schoolToggle').checked;
  DB.config.schoolFrom = $('#schoolFrom').value || '';
  DB.config.schoolTo = $('#schoolTo').value || '';
  saveDB();
  renderConfigToUI();
}

/* Weekly inputs */
function renderWeeklyToUI() {
  $$('[data-day-subjects]').forEach(input => {
    const day = input.getAttribute('data-day-subjects');
    if (DB.weekly[day]) input.value = DB.weekly[day].subjects || '';
  });
  $$('[data-day-primary]').forEach(input => {
    const day = input.getAttribute('data-day-primary');
    if (DB.weekly[day]) input.value = DB.weekly[day].primary || '';
  });
  $$('[data-day-suggest]').forEach(input => {
    const day = input.getAttribute('data-day-suggest');
    if (DB.weekly[day]) input.value = DB.weekly[day].suggest || '';
  });
}

function readUIToWeekly() {
  $$('[data-day-subjects]').forEach(input => {
    const day = input.getAttribute('data-day-subjects');
    DB.weekly[day] = DB.weekly[day] || {};
    DB.weekly[day].subjects = input.value.trim();
  });
  $$('[data-day-primary]').forEach(input => {
    const day = input.getAttribute('data-day-primary');
    DB.weekly[day] = DB.weekly[day] || {};
    DB.weekly[day].primary = input.value.trim();
  });
  $$('[data-day-suggest]').forEach(input => {
    const day = input.getAttribute('data-day-suggest');
    DB.weekly[day] = DB.weekly[day] || {};
    DB.weekly[day].suggest = input.value.trim();
  });
  saveDB();
}

/* ============================
   Quotes
   ============================ */
function loadQuotesToUI() {
  const inputs = $$('.quote-input');
  inputs.forEach(inp => {
    const idx = Number(inp.getAttribute('data-quote-index'));
    inp.value = DB.quotes[idx] || '';
  });
}

function saveQuotesFromUI() {
  const inputs = $$('.quote-input');
  inputs.forEach(inp => {
    const idx = Number(inp.getAttribute('data-quote-index'));
    DB.quotes[idx] = inp.value.trim();
  });
  saveDB();
  alert('Quotes saved.');
}

function showTodaysQuote() {
  const qEl = $('#quoteDisplay');
  if (!qEl) return;
  const qs = DB.quotes.filter(s => s && s.trim().length);
  if (!qs.length) {
    qEl.innerHTML = '<p class="muted">No quotes saved yet. Add a few in Manage stored quotes.</p>';
    return;
  }
  // rotate deterministically by date: dayNumber % qs.length
  const d = new Date();
  const dayNum = Math.floor(d.getTime() / (1000*60*60*24));
  const idx = dayNum % qs.length;
  qEl.innerHTML = `<blockquote style="margin:0">${escapeHTML(qs[idx])}</blockquote>`;
}

/* ============================
   Estimate durations from target strings
   - very heuristic, documented assumptions below
   ============================ */
/*
  Assumptions used by estimateDurationFromTarget(target):
  - If target contains "page" or "pages": assume 12 minutes per page (0.2 hr)
  - If target contains "question" or "qs" or numeric followed by "q": assume 6 minutes per question (0.1 hr)
  - If target contains "chapter" => assume 1.5 hours per chapter
  - If target contains "test" or "mock" => assume 2 hours
  - If target contains "hour" or "hrs" numeric => use directly
  - If target empty or unknown => fallback to equal-splitting of studyTarget across tasks
*/
function estimateDurationFromTarget(targetStr) {
  if (!targetStr) return 0;
  const s = targetStr.toLowerCase();
  // direct hours mention
  const hrMatch = s.match(/(\d+(\.\d+)?)\s*(h|hr|hrs|hour|hours)/);
  if (hrMatch) return Number(hrMatch[1]);

  // pages
  const pagesMatch = s.match(/(\d+)\s*(page|pages|pgs)/);
  if (pagesMatch) {
    const pages = Number(pagesMatch[1]);
    return +(pages * 0.2).toFixed(2); // 12 minutes/page
  }

  // questions
  const qsMatch = s.match(/(\d+)\s*(q|qs|questions|ques)/);
  if (qsMatch) {
    const q = Number(qsMatch[1]);
    return +(q * 0.1).toFixed(2); // 6 minutes/question
  }

  // "15 RD Questions" pattern with numeric somewhere
  const genericNum = s.match(/(\d+)\b/);
  if (genericNum && /question|q|qs/.test(s)) {
    const q = Number(genericNum[1]);
    return +(q * 0.1).toFixed(2);
  }

  if (s.includes('chapter')) return 1.5;
  if (s.includes('test') || s.includes('mock')) return 2;
  if (s.includes('practice')) return 1; // fallback
  // fallback: 0 (will later be evenly distributed)
  return 0;
}

/* ============================
   Generate Today's Plan
   - creates task rows in #daily-task-list
   - computes scheduledHours, breaksCount
   - uses DB.config.studyTarget if tasks don't specify durations
   ============================ */
function clearDailyTaskListUI() {
  const parent = $('#daily-task-list');
  if (parent) parent.innerHTML = '';
}

function generateTodayPlan(forDate = todayStr()) {
  // refresh UI config + weekly from inputs
  readUIToConfig();
  readUIToWeekly();

  const weekday = (new Date(forDate)).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const w = DB.weekly[weekday] || { subjects: '', primary: '', suggest: '' };

  // build tasks: prefer explicit weekly.primary list (split by newline or / or ; or comma)
  let tasks = [];
  if (w.primary && w.primary.trim()) {
    // split by newline or ' / ' or ' , ' or ';'
    const parts = w.primary.split(/\r?\n|\/|;|,/).map(s => s.trim()).filter(Boolean);
    tasks = parts.map(p => ({ subjectGuess: extractSubjectFromText(p), desc: p, duration: estimateDurationFromTarget(p) }));
  } else if (w.subjects && w.subjects.trim()) {
    // split subjects and create placeholder tasks
    const subs = w.subjects.split(',').map(s => s.trim()).filter(Boolean);
    tasks = subs.map(s => ({ subjectGuess: s, desc: `Study ${s}`, duration: 0 }));
  } else {
    // fallback: create one task for "Study"
    tasks = [{ subjectGuess: 'Study', desc: 'General study', duration: 0 }];
  }

  // If none of the tasks have durations, we will split studyTarget evenly
  let totalSpecifiedHours = tasks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const targetHours = safeNum(DB.config.studyTarget);
  if (totalSpecifiedHours === 0 && targetHours > 0) {
    const each = +(targetHours / tasks.length).toFixed(2);
    tasks = tasks.map(t => ({ ...t, duration: each }));
    totalSpecifiedHours = each * tasks.length;
  } else if (totalSpecifiedHours < targetHours && targetHours > 0) {
    // distribute remaining proportionally among 0-duration tasks
    const remaining = Math.max(0, targetHours - totalSpecifiedHours);
    const zeroCount = tasks.filter(t => !t.duration).length;
    if (zeroCount > 0) {
      const addPer = +(remaining / zeroCount).toFixed(2);
      tasks = tasks.map(t => t.duration ? t : ({ ...t, duration: addPer }));
      totalSpecifiedHours = tasks.reduce((acc, t) => acc + (t.duration || 0), 0);
    }
  }

  // compute breaks: use breakLen field
  const breakLen = safeNum(DB.config.breakLen) || 0.5;
  const breaksCount = Math.floor((totalSpecifiedHours / breakLen) || 0);

  // now render tasks into DOM
  clearDailyTaskListUI();
  const parent = $('#daily-task-list');
  tasks.forEach((t, idx) => {
    const node = document.createElement('div');
    node.className = 'task-row';
    node.innerHTML = `
      <label>Subject</label>
      <input class="task-subject" value="${escapeHTML(t.subjectGuess || '')}" />
      <input class="task-desc" value="${escapeHTML(t.desc || '')}" />
      <select class="task-type">
        <option value="chapter">Complete chapter</option>
        <option value="pages">Pages</option>
        <option value="questions">Questions practice</option>
        <option value="other">Other</option>
      </select>
      <input class="task-target" value="${t.duration ? t.duration + ' hr' : ''}" />
      <button class="btn tiny ghost remove-task" data-idx="${idx}">Remove</button>
    `;
    parent.appendChild(node);
  });

  // wire remove buttons
  parent.querySelectorAll('.remove-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.task-row').remove();
      // recompute summary after a short breath
      setTimeout(renderPlanSummary, 80);
    });
  });

  // final summary render
  renderPlanSummary();
  // Save today's scheduled hours to history
  DB.history.dailyStudyHours[forDate] = +(totalSpecifiedHours.toFixed(2));
  saveDB();
  renderSavedPlansList();
}

/* helper to extract subject from a primary string */
function extractSubjectFromText(text) {
  if (!text) return '';
  const s = text.toLowerCase();
  if (s.includes('math')) return 'Maths';
  if (s.includes('sci') || s.includes('chem') || s.includes('bio') || s.includes('science')) return 'Science';
  if (s.includes('sst') || s.includes('soc') || s.includes('history') || s.includes('geo')) return 'SST';
  if (s.includes('hindi')) return 'Hindi';
  if (s.includes('english')) return 'English';
  return text.split(/[-:–—\|]/)[0].slice(0, 20); // fallback short label
}

/* ============================
   Render plan summary (uses daily-task-list to compute total)
   ============================ */
function renderPlanSummary(forDate = todayStr()) {
  // compute scheduled hours by summing durations in generated task rows (task-target may contain "X hr" or numeric)
  const parent = $('#daily-task-list');
  let total = 0;
  if (parent) {
    parent.querySelectorAll('.task-row').forEach(row => {
      const target = row.querySelector('.task-target')?.value || '';
      // try to parse hr pattern
      let n = 0;
      const hrMatch = target.match(/(\d+(\.\d+)?)\s*(h|hr|hrs|hour|hours)/);
      if (hrMatch) n = Number(hrMatch[1]);
      else {
        // try simple number
        const num = target.match(/(\d+(\.\d+)?)/);
        if (num) n = Number(num[1]);
      }
      total += n;
    });
  }

  // fallback to config studyTarget if total 0
  if (total === 0) total = safeNum(DB.config.studyTarget) || 0;

  // breaks
  const breakLen = safeNum(DB.config.breakLen) || 0.5;
  const breaksCount = Math.floor(total / breakLen);

  // previous day and last week avg
  const prev = DB.history.dailyStudyHours[dayBefore(forDate,1)] ?? 0;
  // compute last 7 days average
  let sum7 = 0, cnt7 = 0;
  for (let i=1;i<=7;i++) {
    const d = dayBefore(forDate, i);
    if (DB.history.dailyStudyHours[d] !== undefined) {
      sum7 += Number(DB.history.dailyStudyHours[d]);
      cnt7++;
    }
  }
  const lastWeekAvg = cnt7 ? +(sum7 / cnt7).toFixed(2) : 0;

  // render into outputs
  $('#scheduledHours').textContent = total.toFixed(2);
  $('#previousDayHours').textContent = (prev ?? 0).toFixed(2);
  $('#lastWeekAvg').textContent = (lastWeekAvg ?? 0).toFixed(2);

  $('#statTodayTotal')?.textContent = total.toFixed(2);
  $('#statBreaks')?.textContent = breaksCount;
  $('#statPrevDay')?.textContent = (prev ?? 0).toFixed(2);
  $('#stat7DayAvg')?.textContent = (lastWeekAvg ?? 0).toFixed(2);

  // update history record for today to match total (keeps analytics consistent)
  DB.history.dailyStudyHours[forDate] = +(total.toFixed(2));
  saveDB();
}

/* ============================
   Saved Plans UI
   ============================ */
function renderSavedPlansList() {
  const container = $('#savedPlansList');
  if (!container) return;
  container.innerHTML = '';
  if (!DB.savedPlans || DB.savedPlans.length === 0) {
    container.textContent = 'No saved plans yet.';
    return;
  }
  DB.savedPlans.slice().reverse().forEach(p => {
    const el = document.createElement('div');
    el.style.display = 'flex';
    el.style.gap = '8px';
    el.style.alignItems = 'center';
    el.style.marginBottom = '6px';
    el.innerHTML = `<strong style="min-width:180px">${escapeHTML(p.name)}</strong>
      <span class="muted">${p.dateSaved}</span>
      <div style="margin-left:auto;display:flex;gap:6px">
        <button class="btn ghost load-plan" data-id="${p.id}">Load</button>
        <button class="btn tiny export-plan" data-id="${p.id}">Export</button>
        <button class="btn tiny ghost delete-plan" data-id="${p.id}">Delete</button>
      </div>`;
    container.appendChild(el);
  });
  // wire buttons
  container.querySelectorAll('.load-plan').forEach(b => b.addEventListener('click', (e) =>{
    const id = b.getAttribute('data-id');
    const rec = DB.savedPlans.find(x => x.id === id);
    if (!rec) return alert('Plan not found');
    // restore snapshot into DB and UI
    DB = { ...DB, ...rec.snapshot }; // careful but fine for this demo
    saveDB();
    renderAll();
  }));
  container.querySelectorAll('.export-plan').forEach(b => b.addEventListener('click', (e) => {
    const id = b.getAttribute('data-id');
    const rec = DB.savedPlans.find(x => x.id === id);
    if (!rec) return alert('Plan not found');
    const blob = new Blob([JSON.stringify(rec.snapshot, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `planner-${rec.name.replace(/\s+/g,'_')}.json`; a.click();
  }));
  container.querySelectorAll('.delete-plan').forEach(b => b.addEventListener('click', (e) => {
    const id = b.getAttribute('data-id');
    if (!confirm('Delete this saved plan?')) return;
    DB.savedPlans = DB.savedPlans.filter(x => x.id !== id);
    saveDB();
    renderSavedPlansList();
  }));
}

/* ============================
   Buttons / Actions
   ============================ */
function saveCurrentPlanAsSnapshot() {
  // read UI inputs into DB first
  readUIToConfig();
  readUIToWeekly();
  const snapshot = JSON.parse(JSON.stringify(DB));
  const name = prompt('Name for saved plan (e.g., 29 Oct Mission)', DB.config.missionName || 'Plan');
  if (!name) return;
  const rec = { id: uid('plan_'), name: name.slice(0,60), dateSaved: todayStr(), snapshot };
  DB.savedPlans.push(rec);
  saveDB();
  renderSavedPlansList();
  alert('Plan saved locally.');
}

function loadPlannerFromLocal() {
  if (!confirm('This will overwrite current inputs with saved DB content. Continue?')) return;
  loadDB();
  renderAll();
  alert('Planner loaded from local storage.');
}

function clearPlannerLocal() {
  if (!confirm('Clear saved planner data (this clears local DB)?')) return;
  DB = defaultDB();
  saveDB();
  renderAll();
  alert('Planner cleared.');
}

function exportPlannerDB() {
  const payload = JSON.stringify(DB, null, 2);
  const blob = new Blob([payload], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `study-planner-backup-${todayStr()}.json`;
  a.click();
}

function importPlannerFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || typeof parsed !== 'object') throw new Error('Invalid file');
      if (!confirm('Importing will override current planner data. Continue?')) return;
      DB = parsed;
      saveDB();
      renderAll();
      alert('Import complete.');
    } catch (err) {
      alert('Failed to import file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

/* ============================
   Helpers: escapeHTML
   ============================ */
function escapeHTML(s) {
  if (!s && s !== 0) return '';
  return String(s).replace(/[&<>"]/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[ch]));
}

/* ============================
   Render everything (UI)
   ============================ */
function renderAll() {
  renderConfigToUI();
  renderWeeklyToUI();
  loadQuotesToUI();
  renderSavedPlansList();
  generateTodayPlan(todayStr());
  showTodaysQuote();
}

/* ============================
   Wire up event listeners
   ============================ */
function wireEvents() {
  // config inputs -> live save
  $('#missionInput')?.addEventListener('change', () => { readUIToConfig(); });
  $('#studyTarget')?.addEventListener('change', () => { readUIToConfig(); generateTodayPlan(); });
  $('#breakLen')?.addEventListener('change', () => { readUIToConfig(); renderPlanSummary(); });
  $('#wakeTime')?.addEventListener('change', () => { readUIToConfig(); });
  $('#sleepTime')?.addEventListener('change', () => { readUIToConfig(); });

  // weekly fields auto-save on blur
  $$('[data-day-subjects],[data-day-primary],[data-day-suggest]').forEach(inp => {
    inp.addEventListener('blur', () => { readUIToWeekly(); });
  });

  // save/load/clear/export/import buttons
  $('#savePlannerBtn')?.addEventListener('click', saveCurrentPlanAsSnapshot);
  $('#loadPlannerBtn')?.addEventListener('click', loadPlannerFromLocal);
  $('#clearPlannerBtn')?.addEventListener('click', clearPlannerLocal);
  $('#exportPlannerBtn')?.addEventListener('click', exportPlannerDB);
  $('#importPlannerFile')?.addEventListener('change', (e) => {
    const f = e.target.files[0];
    importPlannerFile(f);
  });

  // quotes
  $('#saveQuotesBtn')?.addEventListener('click', saveQuotesFromUI);
  $('#randomQuoteBtn')?.addEventListener('click', showTodaysQuote);

  // quote quick show on page load already called in renderAll

  // Save mission as local snapshot
  $('#savePlannerBtn')?.addEventListener('dblclick', saveCurrentPlanAsSnapshot); // convenience

  // preview & actions if present
  $('#previewMissionBtn')?.addEventListener('click', () => generateTodayPlan());
  $('#saveAsTodayBtn')?.addEventListener('click', () => {
    readUIToConfig();
    readUIToWeekly();
    // store today snapshot under savedPlans with name "Today - mission"
    const name = `Today - ${DB.config.missionName || 'Plan'} - ${todayStr()}`;
    DB.savedPlans.push({ id: uid('plan_'), name, dateSaved: todayStr(), snapshot: JSON.parse(JSON.stringify(DB)) });
    saveDB();
    alert('Saved plan as a saved-plan for quick load.');
    renderSavedPlansList();
  });

  // edit / export mission buttons in mission card if exist (IDs in mission.html)
  $('#editMissionBtn')?.addEventListener('click', () => {
    // scroll to editor section if exists
    const editor = $('#missionForm') || $('#study-planner');
    if (editor) editor.scrollIntoView({behavior:'smooth'});
  });
  $('#exportMissionBtn')?.addEventListener('click', exportPlannerDB);

  $('#activateMissionBtn')?.addEventListener('click', () => {
    // subtle animation or confirmation
    alert('Mission activated for today — stay focused. Good luck, Swayam.');
  });

  // initial mission name update
  $('#missionInput')?.addEventListener('input', () => { $('#missionName').textContent = $('#missionInput').value || 'Mission'; });
}

/* ============================
   Boot
   ============================ */
document.addEventListener('DOMContentLoaded', () => {
  loadDB();
  wireEvents();
  renderAll();
});
/* ============================
   UTILITIES
   ============================ */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const escapeHTML = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

const uid = (prefix = '') => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function downloadJSON(filename, obj) {
  const data = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 2));
  const a = document.createElement('a');
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ============================
   DB LOAD/SAVE + ROLLOVER
   ============================ */
let DB = null;

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    DB = raw ? JSON.parse(raw) : defaultDB();
  } catch (e) {
    console.warn('DB parse error, resetting DB.', e);
    DB = defaultDB();
  }
  // ensure keys
  if (!DB.tasksByDate) DB.tasksByDate = {};
  if (!DB.lastLocalDate) DB.lastLocalDate = todayStr();
  dailyRolloverIfNeeded();
}

function saveDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(DB));
}

/* If the saved DB's lastLocalDate is older than todayStr(),
   carry over unfinished tasks and mark lastLocalDate = today.
*/
function dailyRolloverIfNeeded() {
  const savedDate = DB.lastLocalDate;
  const t = todayStr();
  if (savedDate === t) return;

  // For all dates between savedDate (exclusive) and today (inclusive) we could run scheduled jobs.
  // For now: carry unfinished tasks from savedDate to today.
  const prevTasks = DB.tasksByDate[savedDate] || [];
  const unfinished = prevTasks.filter(tsk => !tsk.done);

  // ensure today's array
  DB.tasksByDate[t] = DB.tasksByDate[t] || [];

  // add unfinished tasks to today if not duplicate (same text, same category)
  unfinished.forEach(u => {
    const exists = DB.tasksByDate[t].some(existing =>
      existing.text === u.text && existing.category === u.category && !existing.done
    );
    if (!exists) {
      // create new copy with new id and createdAt
      const copy = { ...u, id: uid('t_'), createdAt: Date.now() };
      delete copy.completedAt; // not completed yet
      DB.tasksByDate[t].push(copy);
    }
  });

  // update lastLocalDate
