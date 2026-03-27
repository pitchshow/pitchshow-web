/* ═══════════════════════════════════════════════
   PitchShow — Secondary Pages JS
   GSAP + S-curve easing from video analysis
═══════════════════════════════════════════════ */
if (typeof lucide !== 'undefined') lucide.createIcons();

const E = 'power2.inOut'; // cubic-bezier(0.65,0,0.35,1)

if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // ── Hero entrance: staggered reveal ──
  gsap.fromTo('.pg-kicker, .pg-h1, .pg-sub, .pg-hero .btn-pill-primary, .pg-hero .ent-badges',
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: E, delay: 0.15, clearProps: 'transform' }
  );

  // ── Orb radial bloom ──
  gsap.fromTo('.pg-hero .orb-a', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: E });
  gsap.fromTo('.pg-hero .orb-b', { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.4, delay: 0.4, ease: E });

  // ── Scroll reveals: .gs-up ──
  // Skip elements inside .pg-hero — they are handled by the hero entrance animation above
  document.querySelectorAll('.gs-up').forEach(el => {
    if (el.closest('.pg-hero')) return;
    gsap.fromTo(el, { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.7, ease: E, clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 88%' } }
    );
  });

  // ── Scroll reveals: .gs-card (batch stagger) ──
  ScrollTrigger.batch('.gs-card', {
    onEnter: b => gsap.fromTo(b, { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: E, clearProps: 'transform' }),
    start: 'top 88%',
  });

  // ── Mouse parallax on orbs ──
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
  });
  gsap.ticker.add(() => {
    gsap.to('.pg-hero .orb-a', { x: mx * 40, y: my * 30, duration: 2.5, ease: 'none' });
    gsap.to('.pg-hero .orb-b', { x: -mx * 28, y: -my * 22, duration: 3, ease: 'none' });
  });
}

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return; e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 32, behavior: 'smooth' });
  });
});

// ── FAQ accordion ──
document.querySelectorAll('.fq').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq');
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq.open').forEach(f => f.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ── Get Started: tab switching ──
document.querySelectorAll('.path-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.path-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.path-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const id = 'tab-' + tab.dataset.tab;
    const content = document.getElementById(id);
    if (content) {
      content.classList.add('active');
      // Animate newly visible cards
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(content.querySelectorAll('.gs-card, .mcp-ide, .setup-step, .mcp-tools, .web-path-hero, .web-path-features, .mcp-intro'),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: E }
        );
      }
    }
  });
});

// ── 0. Wishlist modal (intercepts .sb-login on all pages) ──
(function() {
  // Build overlay + modal
  const overlay = document.createElement('div');
  overlay.className = 'wl-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <div class="wl-modal">
      <button class="wl-close" aria-label="Close">&times;</button>
      <svg class="wl-logo" viewBox="0 0 48 48" fill="none">
        <defs>
          <radialGradient id="wl-grad" cx="40%" cy="28%" r="62%">
            <stop offset="0%"   stop-color="#FFF9F4"/>
            <stop offset="52%"  stop-color="#FFE8D8"/>
            <stop offset="100%" stop-color="#FFD0BA"/>
          </radialGradient>
        </defs>
        <path d="M24,14 C21.5,5.5 4,9.5 4,21.5 C4,34 12.5,45 24,45 C35.5,45.5 44,34 44,21 C44,9 26.5,5 24,14 Z" fill="url(#wl-grad)"/>
        <ellipse cx="27.5" cy="9.5" rx="4.8" ry="7.2" fill="#3d6428" transform="rotate(20 27.5 9.5)"/>
        <path d="M24,14 C24.5,11.5 26,10 27.5,8.5" stroke="#5a3818" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <ellipse cx="10" cy="33.5" rx="5.5" ry="3.2" fill="rgba(255,140,120,0.18)"/>
        <ellipse cx="38" cy="33.5" rx="5.5" ry="3.2" fill="rgba(255,140,120,0.18)"/>
        <circle cx="16" cy="27" r="2.2" fill="#1a0810"/>
        <circle cx="32" cy="27" r="2.2" fill="#1a0810"/>
        <path d="M18,35 Q24,39 30,35" stroke="#1a0810" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="wl-title">PitchShow is opening soon</div>
      <div class="wl-sub">Thank you for your interest! Leave your email and we'll be the first to let you know when we launch.</div>
      <div class="wl-form">
        <input class="wl-input" type="email" placeholder="your@email.com" autocomplete="email"/>
        <button class="wl-btn">Join the waitlist</button>
      </div>
      <div class="wl-thanks">
        <div class="wl-thanks-icon">&#10003;</div>
        <h3>You're on the list!</h3>
        <p>We'll reach out as soon as PitchShow is ready. Thanks for being an early supporter.</p>
      </div>
      <p class="wl-note">No spam. Just one email when we launch.</p>
    </div>`;
  document.body.appendChild(overlay);

  const modal  = overlay.querySelector('.wl-modal');
  const form   = overlay.querySelector('.wl-form');
  const thanks = overlay.querySelector('.wl-thanks');
  const input  = overlay.querySelector('.wl-input');
  const btn    = overlay.querySelector('.wl-btn');
  const close  = overlay.querySelector('.wl-close');

  function openModal() {
    overlay.classList.add('open');
    setTimeout(() => input && input.focus(), 300);
  }
  function closeModal() {
    overlay.classList.remove('open');
  }

  // Submit: store email, show thanks
  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = '#ef4444';
      input.focus();
      setTimeout(() => input.style.borderColor = '', 1200);
      return;
    }
    // Save locally; in production you'd POST to an endpoint
    try {
      const list = JSON.parse(localStorage.getItem('ps_waitlist') || '[]');
      if (!list.includes(email)) { list.push(email); localStorage.setItem('ps_waitlist', JSON.stringify(list)); }
    } catch(e) {}
    btn.disabled = true;
    form.style.display = 'none';
    thanks.style.display = 'flex';
  });

  close.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Intercept sidebar login + any CTA marked data-waitlist
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.sb-login, [data-waitlist]');
    if (trigger) { e.preventDefault(); openModal(); }
  });
})();

// ── 1. Top bar logo (all secondary pages) ──
(function() {
  if (document.querySelector('.ps-topbar')) return; // already present
  const bar = document.createElement('header');
  bar.className = 'ps-topbar';
  bar.innerHTML = `
    <a href="./index.html" class="ps-topbar-logo" title="PitchShow">
      <svg class="ps-topbar-icon" width="34" height="34" viewBox="0 0 48 48" fill="none">
        <path d="M24,14 C21.5,5.5 4,9.5 4,21.5 C4,34 12.5,45 24,45 C35.5,45.5 44,34 44,21 C44,9 26.5,5 24,14 Z"
              fill="url(#ps-grad)"/>
        <ellipse class="ps-topbar-leaf" cx="27.5" cy="9.5" rx="4.8" ry="7.2" fill="#3d6428"
                 transform="rotate(20 27.5 9.5)"/>
        <path d="M24,14 C24.5,11.5 26,10 27.5,8.5"
              stroke="#5a3818" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <ellipse cx="10" cy="33.5" rx="5.5" ry="3.2" fill="rgba(255,140,120,0.15)"/>
        <ellipse cx="38" cy="33.5" rx="5.5" ry="3.2" fill="rgba(255,140,120,0.15)"/>
        <circle class="ps-topbar-eye"   cx="16" cy="27" r="2.2" fill="#1a0810"/>
        <circle class="ps-topbar-eye r" cx="32" cy="27" r="2.2" fill="#1a0810"/>
      </svg>
      <span class="ps-topbar-name">PitchShow</span>
    </a>`;
  document.body.prepend(bar);
})();

// ── 2. Chat widget (bottom-right, replaces simple mascot) ──
(function() {
  // Chat button
  const btn = document.createElement('button');
  btn.className = 'chat-widget-btn';
  btn.title = 'Get help';
  btn.setAttribute('aria-label', 'Open support chat');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

  // Dialog
  const dlg = document.createElement('div');
  dlg.className = 'chat-widget-dialog';
  dlg.innerHTML = `
    <div class="cwd-head">
      <svg class="cwd-peach" viewBox="0 0 48 48" fill="none">
        <defs><radialGradient id="cw-grad" cx="40%" cy="28%" r="62%"><stop offset="0%" stop-color="#FFF9F4"/><stop offset="52%" stop-color="#FFE8D8"/><stop offset="100%" stop-color="#FFD0BA"/></radialGradient></defs>
        <path d="M24,14 C21.5,5.5 4,9.5 4,21.5 C4,34 12.5,45 24,45 C35.5,45.5 44,34 44,21 C44,9 26.5,5 24,14 Z" fill="url(#cw-grad)"/>
        <ellipse cx="27.5" cy="9.5" rx="4.8" ry="7.2" fill="#3d6428" transform="rotate(20 27.5 9.5)"/>
        <ellipse cx="10" cy="33.5" rx="5.5" ry="3.2" fill="rgba(255,140,120,0.2)"/>
        <ellipse cx="38" cy="33.5" rx="5.5" ry="3.2" fill="rgba(255,140,120,0.2)"/>
        <path d="M12.5,29 Q16,24 19.5,29" stroke="#1a0810" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M28.5,29 Q32,24 35.5,29" stroke="#1a0810" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M21.5,35 Q24,37.5 26.5,35" stroke="#1a0810" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      </svg>
      <div>
        <div class="cwd-title">Hi! How can we help?</div>
        <div class="cwd-sub">PitchShow support</div>
      </div>
    </div>
    <div class="cwd-options">
      <a href="./get-started.html" class="cwd-opt">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 2 13 9 20 9"/><path d="M20 14v7H4V3h9"/></svg>
        Get started — download & setup
      </a>
      <a href="./docs.html" class="cwd-opt">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Browse documentation
      </a>
      <a href="https://github.com/pitchshowai/pitchshow/issues" target="_blank" class="cwd-opt">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Report a bug on GitHub
      </a>
      <a href="mailto:support@pitchshow.ai" class="cwd-opt">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        Email support@pitchshow.ai
      </a>
    </div>
    <div class="cwd-footer">Typically replies within 24 hours</div>`;

  document.body.appendChild(dlg);
  document.body.appendChild(btn);

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    dlg.classList.toggle('open', open);
    btn.innerHTML = open
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  });
  document.addEventListener('click', e => {
    if (open && !btn.contains(e.target) && !dlg.contains(e.target)) {
      open = false; dlg.classList.remove('open');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    }
  });
})();
