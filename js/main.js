/* Think-C Community Portal — main.js */

// ── NAV scroll effect ─────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ══════════════════════════════════════════════════════
// DROPDOWN NAV
// ══════════════════════════════════════════════════════
document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
  const trigger = item.querySelector('.nav-link');
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('open');
    // close all others
    document.querySelectorAll('.nav-item.has-dropdown.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
// close dropdown on outside click
document.addEventListener('click', () => {
  document.querySelectorAll('.nav-item.has-dropdown.open').forEach(o => o.classList.remove('open'));
});

// ── Mobile nav toggle ────────────────────────────────
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ══════════════════════════════════════════════════════
// SPA ROUTER — semua konten dalam satu halaman
// ══════════════════════════════════════════════════════
const sections = {
  home:    document.getElementById('sec-home'),
  feature: document.getElementById('sec-feature'),
  guide:   document.getElementById('sec-guide'),
  download:document.getElementById('sec-download'),
};

function showSection(id) {
  // hide all
  Object.values(sections).forEach(s => { if (s) s.classList.remove('active'); });
  // show target
  const target = sections[id];
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // update nav active states
  document.querySelectorAll('[data-section]').forEach(el => {
    el.classList.toggle('active', el.dataset.section === id);
  });
  // close all dropdowns
  document.querySelectorAll('.nav-item.has-dropdown.open').forEach(o => o.classList.remove('open'));
  // close mobile menu
  if (navLinks) navLinks.classList.remove('open');
  // update hash
  history.pushState(null, '', id === 'home' ? '#' : '#' + id);
  // re-run fade-in for new section
  runFadeIn(target);
}
window.showSection = showSection;

// route on load from hash
function routeHash() {
  const hash = location.hash.replace('#', '') || 'home';
  const valid = ['home','feature','guide','download'];
  showSection(valid.includes(hash) ? hash : 'home');
}
window.addEventListener('popstate', routeHash);
routeHash();

// ── Animated stat counters ────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;
  const duration = 1600;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      }
    });
  }, { threshold: 0.5 }).observe(statsEl);
}

// ── Terminal simulation ───────────────────────────────
const termBody = document.getElementById('termBody');
if (termBody) {
  const events = [
    { delay: 300,   type: 'info',  text: 'Patriot Ultra Blocker v1.0.3 starting...' },
    { delay: 700,   type: 'info',  text: 'WMI connection pool initialized' },
    { delay: 1100,  type: 'info',  text: 'Loading IOC database... Apps=2841 Ransom=14829 Net=38204' },
    { delay: 1600,  type: 'info',  text: 'Geo+Time module: 2 rule(s) active · Allow: ID' },
    { delay: 2000,  type: 'info',  text: 'Honeypot: 18 file(s) active (max 20/folder)' },
    { delay: 2500,  type: 'info',  text: '[SHIELD ACTIVE] Monitoring engine started' },
    { delay: 3400,  type: 'block', text: 'BLOCK · mimikatz.exe · EDR Killer (SHA256)' },
    { delay: 4200,  type: 'warn',  text: 'ALERT · 185.220.101.42:3389 · CN → RDP · Weekend Rule' },
    { delay: 5100,  type: 'block', text: 'BLOCK · massren.exe · Rename burst 912 files/4s' },
    { delay: 6000,  type: 'allow', text: 'RESTORED · report_q4.docx · AutoRollback · 1 file' },
    { delay: 7000,  type: 'info',  text: 'URLhaus sync: +284 hosts · DB v2026.03.28' },
    { delay: 8200,  type: 'warn',  text: 'ALERT · certutil.exe · LOLBin download · score+12' },
    { delay: 9400,  type: 'block', text: 'BLOCK · cobalt_s4.exe · C2 Beacon DGA · score 34' },
    { delay: 10600, type: 'info',  text: 'HashCache: 4821 entries · scan cycle 14/20' },
  ];
  let lines = [];
  const MAX_LINES = 14;
  function addLine(type, text, ts) {
    const line = document.createElement('div');
    line.className = 't-line';
    const timeSpan = document.createElement('span');
    timeSpan.className = 't-time'; timeSpan.textContent = ts;
    const typeSpan = document.createElement('span');
    const msg = document.createElement('span');
    if (type === 'block') { typeSpan.className = 't-block'; typeSpan.textContent = '✗'; msg.className = 't-proc'; }
    else if (type === 'allow') { typeSpan.className = 't-allow'; typeSpan.textContent = '✓'; msg.className = 't-proc'; }
    else if (type === 'warn') { typeSpan.className = 't-warn'; typeSpan.textContent = '!'; msg.className = 't-proc'; }
    else { typeSpan.className = 't-info'; typeSpan.textContent = '·'; msg.className = 't-info'; }
    msg.textContent = ' ' + text;
    line.append(timeSpan, typeSpan, msg);
    const prev = termBody.querySelector('.t-cursor');
    if (prev) prev.remove();
    lines.push(line);
    if (lines.length > MAX_LINES) { lines[0].remove(); lines.shift(); }
    termBody.appendChild(line);
    const cursor = document.createElement('span');
    cursor.className = 't-cursor'; line.appendChild(cursor);
    termBody.scrollTop = termBody.scrollHeight;
  }
  function getTS() {
    const n = new Date();
    return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
  }
  events.forEach(ev => setTimeout(() => addLine(ev.type, ev.text, getTS()), ev.delay));
  setTimeout(() => {
    let idx = 6;
    setInterval(() => { const ev = events[idx % events.length]; if (idx >= 6) addLine(ev.type, ev.text, getTS()); idx++; }, 2500);
  }, 12000);
}

// ── Terminal widget styles (inline, reused from original) ─
const termStyles = `
.hero-visual{position:relative;display:flex;justify-content:center;align-items:center}
.terminal{width:100%;max-width:460px;background:rgba(12,18,32,.9);border:1px solid var(--border-2);border-radius:12px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.5);position:relative;z-index:2;backdrop-filter:blur(8px)}
.terminal-bar{padding:12px 16px;background:rgba(255,255,255,.04);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.t-dot{width:11px;height:11px;border-radius:50%;flex-shrink:0}
.t-red{background:#FF5F57}.t-yellow{background:#FEBC2E}.t-green{background:#28C840}
.t-title{font-family:var(--font-mono);font-size:.72rem;color:var(--text-muted);margin-left:8px;flex:1;text-align:center}
.terminal-body{padding:16px;min-height:280px;font-family:var(--font-mono);font-size:.78rem;line-height:1.7;color:#94A3B8}
.t-line{display:flex;gap:8px;margin-bottom:2px}
.t-time{color:#475569;flex-shrink:0}
.t-block{color:var(--danger);font-weight:700}.t-allow{color:var(--success);font-weight:700}.t-warn{color:var(--warning);font-weight:700}.t-info{color:var(--accent-2)}.t-proc{color:#E2E8F0}
.t-cursor{display:inline-block;width:7px;height:14px;background:var(--accent);vertical-align:middle;animation:blink .7s step-end infinite}
.vis-ring{position:absolute;border-radius:50%;border:1px solid rgba(59,130,246,.15);pointer-events:none}
.vis-ring-1{width:520px;height:520px;animation:rotate 20s linear infinite}
.vis-ring-2{width:640px;height:640px;animation:rotate 30s linear infinite reverse;border-style:dashed}
.vis-ring-3{width:760px;height:760px;animation:rotate 45s linear infinite;opacity:.5}
@keyframes rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
`;
const styleEl = document.createElement('style');
styleEl.textContent = termStyles;
document.head.appendChild(styleEl);

// ── Ticker duplicate ──────────────────────────────────
const ticker = document.getElementById('ticker');
if (ticker) ticker.innerHTML += ticker.innerHTML;

// ── Fade-in on scroll ─────────────────────────────────
function runFadeIn(root) {
  const els = (root || document).querySelectorAll('.fade-in:not(.visible)');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}
runFadeIn();

// ── Code copy ─────────────────────────────────────────
function copyCode(btn) {
  const text = btn.dataset.code || '';
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!'; btn.style.color = 'var(--success)';
    setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1800);
  });
}
window.copyCode = copyCode;

// ── Docs: active sidebar link on scroll ──────────────
const docLinks = document.querySelectorAll('.doc-nav-link[href^="#"]');
if (docLinks.length) {
  const docSections = [...docLinks].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        docLinks.forEach(l => l.classList.remove('active'));
        const active = [...docLinks].find(l => l.getAttribute('href') === '#' + entry.target.id);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' }).observe && docSections.forEach(s => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          docLinks.forEach(l => l.classList.remove('active'));
          const a = [...docLinks].find(l => l.getAttribute('href') === '#' + entry.target.id);
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' }).observe(s);
  });
}
