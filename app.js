/* ── Safety fallback: reveal content if GSAP CDN fails ── */
(function() {
  function revealAll() {
    document.querySelectorAll('.h-fade,.h-el,.hero-product').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    const h1 = document.getElementById('heroH1');
    if (h1 && !h1.textContent.trim()) {
      h1.innerHTML = 'Pitch an idea.<br/><span class="h-grad">A show.</span>';
    }
    const sub = document.getElementById('heroSubline');
    if (sub) sub.style.opacity = '1';
    // Light up pipeline
    document.querySelectorAll('.pip').forEach((p, i) => {
      setTimeout(() => p.classList.add('lit'), i * 200);
    });
  }
  // If GSAP not ready after 3s, reveal content anyway
  setTimeout(() => {
    if (typeof gsap === 'undefined') revealAll();
  }, 3000);
  // Also run on DOMContentLoaded as immediate fallback
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') revealAll();
  });
})();

/* ═══════════════════════════════════════════════════
   PitchShow.ai — app.js v10
   Cat choreography (corrected):
   Phase 1 — enters LEFT → pauses → exits LEFT (same direction)
   Phase 2 — enters LEFT at subline level → stays as mascot
              text types to its right (padded area)
              blinks between each line
═══════════════════════════════════════════════════ */

if (typeof lucide !== 'undefined') lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);
const E  = 'power2.inOut';
const dl = ms => new Promise(r => setTimeout(r, ms));

const HIGHLIGHTS = [
  '8 minutes. From blank idea to animated presentation.',
  'Click any element. Describe the change. Done.',
  'Research, citations, Q&A prep — all written per slide.',
  'The PowerPoint that still moves. Every word editable.',
  'Your show at a URL. Full animations. Any device.',
  'You direct. AI builds. Every time.',
];

// ─────────────────────────────────────────────────────────
async function heroEntrance() {
  const mascot = document.getElementById('heroMascot');
  const cursor = document.getElementById('heroCursor');
  const h1     = document.getElementById('heroH1');
  const sub    = document.getElementById('heroSubline');
  if (!mascot || !h1 || !sub) { fallback(); return; }

  // Badge in
  gsap.fromTo('.hero-badge', {opacity:0,y:-10}, {opacity:1,y:0,duration:.5,ease:E});
  await dl(180);

  // ── PHASE 1: Cat enters LEFT → exits LEFT ──────────────
  // Start off-screen left
  gsap.set(mascot, {x: -130, opacity: 0});

  // Start headline typing IN PARALLEL with cat animation
  const typingDone = typeH1(h1, ['Pitch an idea.', 'Walk out with a show.']);

  // Cat slides in from left (入镜)
  gsap.to(mascot, {x: 0, opacity: 1, duration: 0.72, ease: 'power2.out'});
  await dl(1050); // pause — cat watches headline being typed

  // Cat exits back LEFT (same direction it came — 回去)
  gsap.to(mascot, {x: -130, opacity: 0, duration: 0.52, ease: 'power2.in'});
  await dl(580);

  // Wait for headline to finish typing
  await typingDone;
  if (cursor) cursor.style.display = 'none';
  await dl(240);

  // ── PHASE 2: Cat moves to subline level ────────────────
  // Give subline left padding so cat sits BEFORE the text
  sub.style.paddingLeft = '62px';

  // Calculate how far down the subline is
  const typeRow = mascot.closest('.hero-type-row') || mascot.parentElement;
  const trRect  = typeRow.getBoundingClientRect();
  const subRect = sub.getBoundingClientRect();

  // Center cat vertically with subline text
  const catH   = 52;
  const subH   = Math.max(subRect.height, 22);
  const yDelta = (subRect.top - trRect.top) - Math.max(0, (catH - subH) / 2);

  // Enter from left at subline level (俏皮的左到右入镜)
  gsap.set(mascot, {x: -90, y: yDelta, opacity: 0});
  await dl(120);
  gsap.to(mascot, {x: 2, y: yDelta, opacity: 1, duration: 0.65, ease: 'back.out(1.7)'});
  await dl(780);

  // Blink twice (can't hold back the cuteness)
  const eyes = mascot.querySelectorAll('circle');
  const blink = async () => {
    gsap.to(eyes, {scaleY:.08, transformOrigin:'center', duration:.08, ease:'power2.in'});
    await dl(85);
    gsap.to(eyes, {scaleY:1, transformOrigin:'center', duration:.13, ease:'power2.out'});
    await dl(200);
  };
  await blink();
  await dl(200);
  await blink();
  await dl(320);

  // ── PHASE 3: CTAs + pipeline + mockup fade in ──────────
  [...document.querySelectorAll('.h-fade')].forEach((el, i) =>
    gsap.to(el, {opacity:1, y:0, duration:.65, delay:.08+i*.1, ease:E}));
  gsap.to('.hero-product', {opacity:1, y:0, duration:.9, delay:.35, ease:E});
  lightUp();
  gsap.to(sub, {opacity:1, duration:.35, ease:E});

  // Subline: text node + cursor
  sub.innerHTML = '<span class="sl-t"></span><span class="sl-c">|</span>';
  const slT = sub.querySelector('.sl-t');

  // ── PHASE 4: Rotating highlights (cat stays put) ───────
  let idx = 0;
  while (true) {
    const text   = HIGHLIGHTS[idx % HIGHLIGHTS.length];
    const isLast = (idx % HIGHLIGHTS.length) === HIGHLIGHTS.length - 1;

    // Type out
    let typed = '';
    for (const ch of text) {
      typed += ch;
      slT.textContent = typed;
      await dl(ch === ' ' ? 24 : ch === '.' ? 72 : 34);
    }

    // Pause
    await dl(isLast ? 3000 : 1900);

    // Special blink on last line
    if (isLast) { await blink(); await dl(400); }

    // Erase
    while (typed.length > 0) {
      typed = typed.slice(0, -1);
      slT.textContent = typed;
      await dl(14);
    }
    await dl(200);
    idx++;
  }
}

// ── Typewriter H1 ─────────────────────────────────────────
function typeH1(el, lines) {
  return new Promise(async resolve => {
    let raw = '';
    for (let li = 0; li < lines.length; li++) {
      for (const ch of lines[li]) {
        raw += ch;
        el.innerHTML = raw.split('\n')
          .map(p => p.replace(/\ba show\./g, '<span class="h-grad">a show.</span>'))
          .join('<br/>');
        await dl(ch === ' ' ? 28 : ch === '.' ? 92 : 43);
      }
      if (li < lines.length - 1) { raw += '\n'; await dl(200); }
    }
    resolve();
  });
}

function fallback() {
  document.querySelectorAll('.h-fade').forEach((el,i) =>
    gsap.to(el, {opacity:1,y:0,duration:.7,delay:i*.1,ease:E}));
  lightUp();
}

function lightUp() {
  [...document.querySelectorAll('.pip')].forEach((p,i) =>
    setTimeout(() => p.classList.add('lit'), i*220));
}

// Inject subline cursor style
document.head.insertAdjacentHTML('beforeend',
  `<style>.sl-c{display:inline-block;width:2px;height:1.05em;background:var(--p400);` +
  `border-radius:1px;vertical-align:text-bottom;margin-left:2px;` +
  `animation:blink-cur 1s step-end infinite}.sl-t{display:inline}</style>`
);

heroEntrance();

// ── Orbs bloom ────────────────────────────────────────────
gsap.fromTo('.orb-a',{scale:.4,opacity:0},{scale:1,opacity:1,duration:2,ease:E});
gsap.fromTo('.orb-b',{scale:.3,opacity:0},{scale:1,opacity:1,duration:2.4,delay:.4,ease:E});

// ── Scroll triggers ───────────────────────────────────────
document.querySelectorAll('.feat-section .kicker,.feat-section h2').forEach(el =>
  gsap.fromTo(el,{opacity:0,y:20},{opacity:1,y:0,duration:.65,ease:E,clearProps:'transform',
    scrollTrigger:{trigger:el,start:'top 88%'}}));

document.querySelectorAll('.feat-pts').forEach(list =>
  gsap.fromTo(list.querySelectorAll('li'),{opacity:0,x:-14},
    {opacity:1,x:0,duration:.5,stagger:.09,ease:E,clearProps:'transform',
      scrollTrigger:{trigger:list,start:'top 86%'}}));

document.querySelectorAll('.video-placeholder').forEach(el =>
  gsap.fromTo(el,{opacity:0,scale:.97},{opacity:1,scale:1,duration:.8,ease:E,clearProps:'transform',
    scrollTrigger:{trigger:el,start:'top 83%'}}));

ScrollTrigger.batch('.fg-card',{
  onEnter: b => gsap.fromTo(b,{opacity:0,y:24},
    {opacity:1,y:0,duration:.55,stagger:.06,ease:E,clearProps:'transform'}),
  start:'top 88%',
});

gsap.fromTo('.oss-inner',{opacity:0,y:20},{opacity:1,y:0,duration:.7,ease:E,
  scrollTrigger:{trigger:'.oss-band',start:'top 85%'}});

// Quotes loop
const qi = document.getElementById('qInner');
if (qi) { qi.innerHTML += qi.innerHTML; lucide.createIcons(); }

// Parallax
let mx=0,my=0;
document.addEventListener('mousemove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
gsap.ticker.add(()=>{
  gsap.to('.orb-a',{x:mx*55,y:my*45,duration:2.8,ease:'none'});
  gsap.to('.orb-b',{x:-mx*38,y:-my*28,duration:3.5,ease:'none'});
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(!t)return;e.preventDefault();
    window.scrollTo({top:t.getBoundingClientRect().top+scrollY-32,behavior:'smooth'});
  }));

// Theme toggle
const themeBtn=document.getElementById('themeToggle');
const themeIcon=document.getElementById('themeIcon');
let isDark=true;
/* Theme toggle disabled — light mode not yet designed
themeBtn?.addEventListener('click',()=>{
  isDark=!isDark;
  document.documentElement.setAttribute('data-theme',isDark?'':'light');
  if(themeIcon){themeIcon.setAttribute('data-lucide',isDark?'moon':'sun');lucide.createIcons();}
});
*/

// ── FAQ accordion ──
document.querySelectorAll('.fq').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq.open').forEach(f => f.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Scroll triggers: new sections ──
['.comp-head-text h2', '.comp-head-text .comp-sub',
 '.price-inner h2', '.price-inner .price-sub',
 '.faq-inner h2'].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    gsap.fromTo(el, {opacity:0,y:20},
      {opacity:1,y:0,duration:.65,ease:E,clearProps:'transform',
       scrollTrigger:{trigger:el,start:'top 88%'}});
  });
});

ScrollTrigger.batch('.pc', {
  onEnter: b => gsap.fromTo(b, {opacity:0,y:28},
    {opacity:1,y:0,duration:.65,stagger:.1,ease:E,clearProps:'transform'}),
  start: 'top 86%',
});
ScrollTrigger.batch('.faq', {
  onEnter: b => gsap.fromTo(b, {opacity:0,y:16},
    {opacity:1,y:0,duration:.5,stagger:.07,ease:E,clearProps:'transform'}),
  start: 'top 88%',
});
gsap.fromTo('.comp-table-wrap', {opacity:0,y:24},
  {opacity:1,y:0,duration:.8,ease:E,clearProps:'transform',
   scrollTrigger:{trigger:'.comp-table-wrap',start:'top 84%'}});
gsap.fromTo('.dl-inner>*', {opacity:0,y:20},
  {opacity:1,y:0,duration:.65,stagger:.1,ease:E,clearProps:'transform',
   scrollTrigger:{trigger:'.section-dl',start:'top 80%'}});
