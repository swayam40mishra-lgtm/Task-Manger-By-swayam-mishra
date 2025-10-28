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
