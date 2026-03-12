/* =========================================================
   BIRTHDAY WEBSITE — BHUMIKA  |  script.js
   Interactive Walkthrough + Cinematic Emotional Sequence
   ========================================================= */

'use strict';

/* ─── STATE ─── */
let isPlaying = false;
let confettiAnimId = null;
let draggedColor = null;
let touchGhost = null;
let emoSequenceRunning = false;

/* ─── SECTION ORDER ─── */
const SECTION_ORDER = [
    'section-welcome',
    'section-step1',
    'section-step2',
    'section-step3',
    'section-emotional',
    'section-reveal'
];
let currentSectionId = 'section-welcome';

/* ─── DOM REFS ─── */
const splash = document.getElementById('splash');
const splashCanvas = document.getElementById('splash-canvas');
const mainWrapper = document.getElementById('main-wrapper');
const mainCanvas = document.getElementById('main-canvas');
const bgMusic = document.getElementById('bgMusic');   // HTML <audio> element
const confCanvas = document.getElementById('confetti-canvas');
const stepProgress = document.getElementById('step-progress');
const spFill = document.getElementById('sp-fill');
const spLabel = document.getElementById('sp-label');
const progressDots = document.getElementById('progress-dots');

/* Small async delay helper */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


/* =========================================================
   SPLASH PARTICLES
========================================================= */
(function initSplashParticles() {
    const ctx = splashCanvas.getContext('2d');
    let particles = [], w, h;

    function resize() {
        w = splashCanvas.width = window.innerWidth;
        h = splashCanvas.height = window.innerHeight;
    }
    function createP() {
        return {
            x: Math.random() * w,
            y: Math.random() * h + h,
            r: Math.random() * 3.5 + 1,
            speed: Math.random() * 0.45 + 0.12,
            opacity: Math.random() * 0.45 + 0.12,
            color: ['#ffb3d4', '#ffd6e8', '#e8c1ff', '#fda4af', '#f9a8d4'][Math.floor(Math.random() * 5)]
        };
    }
    function tick() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p, i) => {
            p.y -= p.speed;
            p.x += Math.sin(Date.now() * 0.001 + i) * 0.45;
            if (p.y < -10) Object.assign(p, createP(), { y: h + 10 });
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(tick);
    }
    resize();
    particles = Array.from({ length: 32 }, createP);
    tick();
    window.addEventListener('resize', resize);
})();


/* =========================================================
   MAIN BACKGROUND PARTICLES
========================================================= */
(function initMainParticles() {
    const ctx = mainCanvas.getContext('2d');
    let particles = [], w, h;

    function resize() {
        w = mainCanvas.width = window.innerWidth;
        h = mainCanvas.height = window.innerHeight;
    }
    function drawHeart(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 10, size / 10);
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.bezierCurveTo(5, -8, 10, -3, 0, 5);
        ctx.bezierCurveTo(-10, -3, -5, -8, 0, -3);
        ctx.closePath();
        ctx.restore();
    }
    function createP() {
        return {
            x: Math.random() * w,
            y: Math.random() * h + h,
            size: Math.random() * 6 + 2.5,
            speed: Math.random() * 0.3 + 0.1,
            opacity: Math.random() * 0.22 + 0.04,
            color: ['#e91e8c', '#f48fb1', '#f9a8d4', '#ce93d8', '#fda4af', '#3b82f6', '#9c27b0'][Math.floor(Math.random() * 7)],
            isHeart: Math.random() > 0.45,
            phase: Math.random() * Math.PI * 2
        };
    }
    function tick() {
        ctx.clearRect(0, 0, w, h);
        const t = Date.now() * 0.001;
        particles.forEach((p, i) => {
            p.y -= p.speed;
            p.x += Math.sin(t + p.phase + i * 0.28) * 0.5;
            if (p.y < -20) Object.assign(p, createP(), { y: h + 20, x: Math.random() * w });
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            if (p.isHeart) { drawHeart(ctx, p.x, p.y, p.size); ctx.fill(); }
            else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(tick);
    }
    resize();
    particles = Array.from({ length: 26 }, createP);
    tick();
    window.addEventListener('resize', resize);
})();


/* =========================================================
   CONFETTI
========================================================= */
function startConfetti() {
    if (confettiAnimId) return;
    const ctx = confCanvas.getContext('2d');
    const colors = ['#e91e8c', '#f48fb1', '#ce93d8', '#ffd6e8', '#3b82f6', '#9c27b0', '#fda4af', '#eab308'];
    let pieces = [];

    function resize() {
        confCanvas.width = confCanvas.offsetWidth;
        confCanvas.height = confCanvas.offsetHeight;
    }
    function createPiece() {
        return {
            x: Math.random() * confCanvas.width,
            y: -12,
            w: Math.random() * 9 + 4,
            h: Math.random() * 14 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * 360,
            rotSpd: (Math.random() - 0.5) * 7,
            speed: Math.random() * 3.5 + 1.5,
            drift: (Math.random() - 0.5) * 2.2,
            opacity: Math.random() * 0.55 + 0.4,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        };
    }
    resize();
    pieces = Array.from({ length: 130 }, createPiece);
    pieces.forEach(p => { p.y = Math.random() * confCanvas.height; });
    window.addEventListener('resize', resize);

    function tick() {
        ctx.clearRect(0, 0, confCanvas.width, confCanvas.height);
        pieces.forEach(p => {
            p.y += p.speed; p.x += p.drift; p.rot += p.rotSpd;
            if (p.y > confCanvas.height + 20) { p.y = -12; p.x = Math.random() * confCanvas.width; }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            if (p.shape === 'rect') ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            else { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
            ctx.restore();
        });
        ctx.globalAlpha = 1;
        confettiAnimId = requestAnimationFrame(tick);
    }
    tick();
}

function stopConfetti() {
    if (confettiAnimId) { cancelAnimationFrame(confettiAnimId); confettiAnimId = null; }
}


/* =========================================================
   SECTION NAVIGATION
========================================================= */
function goToSection(targetId) {
    if (targetId === currentSectionId) return;

    const current = document.getElementById(currentSectionId);
    const next = document.getElementById(targetId);
    if (!current || !next) return;

    current.classList.remove('active');
    current.classList.add('exit-left');
    setTimeout(() => current.classList.remove('exit-left'), 800);

    next.classList.add('active');
    // Re-trigger child animations
    next.querySelectorAll('.anim-fade-up').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
    });

    currentSectionId = targetId;
    updateUI();

    // Trigger cinematic sequences when entering special sections
    if (targetId === 'section-emotional') {
        setTimeout(runEmotionalSequence, 700);
    }
    if (targetId === 'section-reveal') {
        setTimeout(runRevealSequence, 500);
    }
    if (targetId !== 'section-reveal') {
        stopConfetti();
    }
}

function updateUI() {
    const id = currentSectionId;
    const stepMap = {
        'section-step1': { label: 'Step 1 of 3', fill: '33.33%' },
        'section-step2': { label: 'Step 2 of 3', fill: '66.66%' },
        'section-step3': { label: 'Step 3 of 3', fill: '100%' }
    };
    const isStep = !!stepMap[id];
    const isSpecial = id === 'section-emotional' || id === 'section-reveal';

    // Step progress bar
    if (isStep) {
        stepProgress.classList.add('visible');
        spFill.style.width = stepMap[id].fill;
        spLabel.textContent = stepMap[id].label;
    } else {
        stepProgress.classList.remove('visible');
    }

    // Bottom dots
    if (isSpecial) {
        progressDots.classList.remove('visible');
    } else {
        progressDots.classList.add('visible');
    }

    const dotWelcome = document.getElementById('dot-welcome');
    const dotSteps = document.getElementById('dot-steps');
    const dotReveal = document.getElementById('dot-reveal');
    if (dotWelcome) dotWelcome.classList.toggle('active', id === 'section-welcome');
    if (dotSteps) dotSteps.classList.toggle('active', isStep);
    if (dotReveal) dotReveal.classList.toggle('active', id === 'section-reveal');
}


/* =========================================================
   FEEDBACK HELPERS
========================================================= */
function showFeedback(elId, message, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = message;
    el.className = `feedback-box show fb-${type}`;
}
function clearFeedback(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.className = 'feedback-box';
    el.textContent = '';
}

/* =========================================================
   RIPPLE
========================================================= */
function addRipple(btn, e) {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const cx = (e.clientX ?? e.touches?.[0]?.clientX ?? rect.left + rect.width / 2);
    const cy = (e.clientY ?? e.touches?.[0]?.clientY ?? rect.top + rect.height / 2);
    const x = cx - rect.left - size / 2;
    const y = cy - rect.top - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
}


/* =========================================================
   STEP 1 — MCQ
========================================================= */
function initStep1() {
    const grid = document.getElementById('mcq-grid');
    const continueBtn = document.getElementById('btn-step1-continue');
    if (!grid) return;

    grid.querySelectorAll('.mcq-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const correct = this.dataset.answer === '2018';
            grid.querySelectorAll('.mcq-btn').forEach(b => b.classList.remove('correct', 'wrong'));

            if (correct) {
                this.classList.add('correct');
                grid.querySelectorAll('.mcq-btn').forEach(b => { if (b !== this) b.disabled = true; });
                showFeedback('step1-feedback', 'Yes! That was the year our story began.', 'success');
                continueBtn.disabled = false;
            } else {
                this.classList.add('wrong');
                setTimeout(() => this.classList.remove('wrong'), 600);
                showFeedback('step1-feedback', 'Hmm\u2026 that doesn\u2019t seem right. Try again.', 'error');
            }
        });
    });

    continueBtn.addEventListener('click', function (e) {
        if (this.disabled) return;
        addRipple(this, e);
        setTimeout(() => goToSection('section-step2'), 200);
    });
}


/* =========================================================
   STEP 2 — HEART DRAG & DROP
========================================================= */
function initStep2() {
    const dropZone = document.getElementById('drop-zone');
    const continueBtn = document.getElementById('btn-step2-continue');
    const dragHearts = document.querySelectorAll('.drag-heart');
    if (!dropZone) return;

    /* Desktop */
    dragHearts.forEach(heart => {
        heart.addEventListener('dragstart', e => {
            draggedColor = heart.dataset.color;
            heart.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', draggedColor);
        });
        heart.addEventListener('dragend', () => heart.classList.remove('dragging'));
    });
    dropZone.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleHeartDrop(e.dataTransfer.getData('text/plain') || draggedColor);
    });

    /* Mobile touch */
    dragHearts.forEach(heart => {
        heart.addEventListener('touchstart', e => {
            draggedColor = heart.dataset.color;
            heart.classList.add('dragging');
            touchGhost = document.createElement('div');
            const svgEl = heart.querySelector('svg').cloneNode(true);
            svgEl.style.cssText = `width:54px;height:54px;fill:${heartFill(draggedColor)}`;
            touchGhost.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;transform:translate(-50%,-50%) scale(1.15);';
            touchGhost.appendChild(svgEl);
            document.body.appendChild(touchGhost);
            moveTouchGhost(e.touches[0]);
        }, { passive: true });

        heart.addEventListener('touchmove', e => {
            e.preventDefault();
            if (touchGhost) moveTouchGhost(e.touches[0]);
            const dz = document.getElementById('drop-zone');
            const r = dz.getBoundingClientRect();
            const t = e.touches[0];
            if (t.clientX >= r.left && t.clientX <= r.right && t.clientY >= r.top && t.clientY <= r.bottom) {
                dz.classList.add('drag-over');
            } else {
                dz.classList.remove('drag-over');
            }
        }, { passive: false });

        heart.addEventListener('touchend', e => {
            const touch = e.changedTouches[0];
            const dz = document.getElementById('drop-zone');
            const r = dz.getBoundingClientRect();
            dz.classList.remove('drag-over');
            if (touchGhost) { touchGhost.remove(); touchGhost = null; }
            heart.classList.remove('dragging');
            if (touch.clientX >= r.left && touch.clientX <= r.right && touch.clientY >= r.top && touch.clientY <= r.bottom) {
                handleHeartDrop(draggedColor);
            }
        }, { passive: true });
    });

    function moveTouchGhost(touch) {
        if (!touchGhost) return;
        touchGhost.style.left = touch.clientX + 'px';
        touchGhost.style.top = touch.clientY + 'px';
    }
    function heartFill(c) {
        return { red: '#ef4444', yellow: '#eab308', blue: '#3b82f6', purple: '#9c27b0' }[c] || '#e91e8c';
    }

    function handleHeartDrop(color) {
        const inner = document.getElementById('drop-zone-inner');
        if (color === 'blue') {
            dropZone.classList.add('accepted');
            inner.innerHTML = '';
            const sv = document.getElementById('heart-blue').querySelector('svg').cloneNode(true);
            sv.style.cssText = 'width:56px;height:56px;fill:#3b82f6;';
            inner.appendChild(sv);
            document.getElementById('heart-blue').classList.add('hidden');
            dragHearts.forEach(h => { if (h.id !== 'heart-blue') h.style.pointerEvents = 'none'; });
            showFeedback('step2-feedback', 'You remembered \ud83d\udc99', 'success');
            continueBtn.disabled = false;
        } else {
            dropZone.classList.add('rejected');
            showFeedback('step2-feedback', 'Not quite\u2026 try the color you always used.', 'error');
            setTimeout(() => dropZone.classList.remove('rejected'), 600);
        }
        draggedColor = null;
    }

    continueBtn.addEventListener('click', function (e) {
        if (this.disabled) return;
        addRipple(this, e);
        setTimeout(() => goToSection('section-step3'), 200);
    });
}


/* =========================================================
   STEP 3 — TEXT INPUT
========================================================= */
function initStep3() {
    const submitBtn = document.getElementById('btn-step3-submit');
    const continueBtn = document.getElementById('btn-step3-continue');
    const input = document.getElementById('step3-input');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function (e) {
        const val = (input.value || '').trim();
        if (!val) {
            showFeedback('step3-feedback', 'Please write something \u2014 anything heartfelt.', 'error');
            input.focus();
            return;
        }
        addRipple(this, e);
        showFeedback('step3-feedback', 'That\u2019s a beautiful answer.', 'success');
        submitBtn.disabled = true;
        continueBtn.disabled = false;
        input.disabled = true;
        input.style.borderBottomColor = '#10b981';
    });

    input.addEventListener('keydown', e => { if (e.key === 'Enter') submitBtn.click(); });

    continueBtn.addEventListener('click', function (e) {
        if (this.disabled) return;
        addRipple(this, e);
        setTimeout(() => goToSection('section-emotional'), 250);
    });
}


/* =========================================================
   EMOTIONAL SEQUENCE (cinematic)
========================================================= */
const EMO_SENTENCES = [
    'Sometimes people come into our lives quietly...',
    'But their presence changes things in the most beautiful way.',
    'They bring warmth, comfort, and moments that slowly turn into memories.',
    'And without even realizing it...',
    'They slowly become someone very important.',
    'So today, I wanted to do something a little different.',
    'Something small, but made with thought and effort.',
    'This little website...',
    'I made it only for you.'
];

async function runEmotionalSequence() {
    if (emoSequenceRunning) return;
    emoSequenceRunning = true;

    const sentenceWrap = document.getElementById('emo-sentence-wrap');
    const sentenceEl = document.getElementById('emo-sentence');
    const paragraphEl = document.getElementById('emo-paragraph');

    // Make sure paragraph is hidden at start
    paragraphEl.classList.remove('visible');
    paragraphEl.setAttribute('aria-hidden', 'true');
    sentenceWrap.style.display = 'flex';
    sentenceEl.classList.remove('visible');

    await delay(400); // brief settle

    for (const sentence of EMO_SENTENCES) {
        sentenceEl.textContent = sentence;

        // Fade in
        sentenceEl.classList.add('visible');
        await delay(3300); // stay visible

        // Fade out
        sentenceEl.classList.remove('visible');
        await delay(900); // wait for fade out animation
    }

    // Hide sentence display
    sentenceWrap.style.display = 'none';

    // Fade in full paragraph
    paragraphEl.removeAttribute('aria-hidden');
    await delay(100);
    paragraphEl.classList.add('visible');

    /* Bind continue button */
    const btnEmoCont = document.getElementById('btn-emo-continue');
    if (btnEmoCont) {
        btnEmoCont.onclick = function (e) {
            addRipple(this, e);
            setTimeout(() => goToSection('section-reveal'), 250);
        };
    }

    emoSequenceRunning = false;
}


/* =========================================================
   DRAMATIC REVEAL SEQUENCE (cinematic)
========================================================= */
async function runRevealSequence() {
    const elHappy = document.getElementById('reveal-happy');
    const elBirthday = document.getElementById('reveal-birthday');
    const elName = document.getElementById('reveal-name');
    const revealStage = document.getElementById('reveal-stage');
    const revealFinal = document.getElementById('reveal-final');

    // Reset
    [elHappy, elBirthday, elName].forEach(el => {
        el.classList.remove('rw-show', 'rw-fadeout', 'rw-hidden');
        el.classList.add('rw-hidden');
    });
    revealFinal.classList.remove('rw-show');
    revealFinal.classList.add('rw-hidden');
    revealStage.style.display = 'flex';

    await delay(300);

    /* Step 1 — "Happy" fades in */
    elHappy.classList.remove('rw-hidden');
    await delay(80);
    elHappy.classList.add('rw-show');
    await delay(2000);

    /* Step 2 — "Birthday" fades in below */
    elBirthday.classList.remove('rw-hidden');
    await delay(80);
    elBirthday.classList.add('rw-show');
    await delay(2000);

    /* Step 3 — "Bhumika" fades in below */
    elName.classList.remove('rw-hidden');
    await delay(80);
    elName.classList.add('rw-show');
    await delay(2000);

    /* Music volume swell */
    musicVolumeSwell();

    /* Step 4 — Fade out all words, reveal merged heading */
    [elHappy, elBirthday, elName].forEach(el => {
        el.classList.remove('rw-show');
        el.classList.add('rw-fadeout');
    });
    await delay(900);
    revealStage.style.display = 'none';

    /* Show final merged text */
    revealFinal.classList.remove('rw-hidden');
    await delay(80);
    revealFinal.classList.add('rw-show');

    /* Start confetti */
    setTimeout(startConfetti, 400);
}


/* =========================================================
   MUSIC VOLUME SWELL
========================================================= */
function musicVolumeSwell() {
    if (!bgMusic || bgMusic.paused) return;
    const orig = bgMusic.volume;
    bgMusic.volume = Math.min(1, orig * 2.0);
    setTimeout(() => { bgMusic.volume = orig; }, 2500);
}

/* =========================================================
   MUSIC — background auto-play
   Strategy:
   1. Try autoplay immediately (works on desktop/Chrome).
   2. If blocked, start silently on the very first user
      interaction anywhere on the page (tap, click, key).
   The splash screen is full-screen so the first tap on it
   counts as the gesture and music starts right away.
========================================================= */
function initBgMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.38;

    bgMusic.play().then(() => {
        isPlaying = true;
    }).catch(() => {
        /* Autoplay blocked — arm first-interaction fallback */
        const unlock = () => {
            bgMusic.play().then(() => { isPlaying = true; }).catch(() => { });
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('pointerdown', unlock);
            document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('touchstart', unlock, { once: true, passive: true });
        document.addEventListener('pointerdown', unlock, { once: true });
        document.addEventListener('keydown', unlock, { once: true });
    });
}


/* =========================================================
   SPLASH → MAIN
========================================================= */
function launchMain() {
    splash.classList.add('hidden');
    mainWrapper.classList.add('visible');
    progressDots.classList.add('visible');

    const welcome = document.getElementById('section-welcome');
    if (welcome) welcome.classList.add('active');
    currentSectionId = 'section-welcome';
    updateUI();

    /* Start music — works on desktop; mobile will catch first tap */
    setTimeout(initBgMusic, 600);
}
function autoPlayMusic() { /* kept for compatibility, no-op */ }
setTimeout(launchMain, 4000);


/* =========================================================
   RESET ALL (for replay)
========================================================= */
function resetAll() {
    emoSequenceRunning = false;

    /* Step 1 */
    const grid = document.getElementById('mcq-grid');
    if (grid) {
        grid.querySelectorAll('.mcq-btn').forEach(b => { b.classList.remove('correct', 'wrong'); b.disabled = false; });
    }
    clearFeedback('step1-feedback');
    const s1c = document.getElementById('btn-step1-continue');
    if (s1c) s1c.disabled = true;

    /* Step 2 */
    const dz = document.getElementById('drop-zone');
    if (dz) {
        dz.classList.remove('accepted', 'rejected', 'drag-over');
        const dzInner = document.getElementById('drop-zone-inner');
        if (dzInner) dzInner.innerHTML = `
      <svg class="dz-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(233,30,140,0.3)" stroke-width="1.5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span class="dz-label">Drop here</span>
    `;
    }
    document.querySelectorAll('.drag-heart').forEach(h => { h.classList.remove('hidden'); h.style.pointerEvents = ''; });
    clearFeedback('step2-feedback');
    const s2c = document.getElementById('btn-step2-continue');
    if (s2c) s2c.disabled = true;

    /* Step 3 */
    const inp = document.getElementById('step3-input');
    if (inp) { inp.value = ''; inp.disabled = false; inp.style.borderBottomColor = ''; }
    clearFeedback('step3-feedback');
    const s3sub = document.getElementById('btn-step3-submit');
    const s3cont = document.getElementById('btn-step3-continue');
    if (s3sub) s3sub.disabled = false;
    if (s3cont) s3cont.disabled = true;

    /* Emotional */
    const sentenceWrap = document.getElementById('emo-sentence-wrap');
    const sentenceEl = document.getElementById('emo-sentence');
    const paragraphEl = document.getElementById('emo-paragraph');
    if (sentenceWrap) sentenceWrap.style.display = 'flex';
    if (sentenceEl) { sentenceEl.textContent = ''; sentenceEl.classList.remove('visible'); }
    if (paragraphEl) { paragraphEl.classList.remove('visible'); paragraphEl.setAttribute('aria-hidden', 'true'); }

    /* Reveal */
    ['reveal-happy', 'reveal-birthday', 'reveal-name'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('rw-show', 'rw-fadeout'); el.classList.add('rw-hidden'); }
    });
    const revealStage = document.getElementById('reveal-stage');
    const revealFinal = document.getElementById('reveal-final');
    if (revealStage) revealStage.style.display = 'flex';
    if (revealFinal) { revealFinal.classList.remove('rw-show'); revealFinal.classList.add('rw-hidden'); }
}


/* =========================================================
   EVENT LISTENERS
========================================================= */
document.addEventListener('DOMContentLoaded', () => {



    /* Welcome */
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', function (e) {
            addRipple(this, e);
            setTimeout(() => goToSection('section-step1'), 200);
        });
    }

    /* Restart */
    const btnRestart = document.getElementById('btn-restart');
    if (btnRestart) {
        btnRestart.addEventListener('click', () => {
            stopConfetti();
            resetAll();
            goToSection('section-welcome');
        });
    }

    /* Init steps */
    initStep1();
    initStep2();
    initStep3();

});
