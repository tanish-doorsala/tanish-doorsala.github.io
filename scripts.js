/* ============================================================
   TANISH DOORSALA — PORTFOLIO SCRIPTS
   01. Scroll Fade (IntersectionObserver)
   02. Commit Chart (Canvas bar chart)
   03. UR3 Arm (Three.js interactive 3D)
   04. Oscilloscope (Canvas signal viz)
   05. Other Projects Toggle
============================================================ */


/* ── 01. Scroll Fade ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.04 });

document.querySelectorAll('.fade-up').forEach(el => {
  el.classList.add('will-animate');
  obs.observe(el);
});


/* ── 02. Commit Chart ── */
(function initCommitChart() {
  const canvas = document.getElementById('commit-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const weeks = [1,0,2,1,3,2,4,5,6,8,9,7,5,3,4,6,3,2,1,0,1];

  function draw() {
    const W = canvas.offsetWidth, H = 120;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const max = Math.max(...weeks);
    const barW = (W / weeks.length) - 4;
    const pad = 2;

    weeks.forEach((v, i) => {
      const x = i * (barW + pad * 2) + pad;
      const h = v === 0 ? 2 : (v / max) * (H - 20);
      const y = H - h - 4;
      ctx.fillStyle = v === 0 ? 'rgba(255,255,255,0.06)' : `rgba(192,32,10,${0.15 + (v / max) * 0.85})`;
      ctx.beginPath(); ctx.roundRect(x, y, barW, h, 2); ctx.fill();
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = H - 4 - (i / 4) * (H - 20);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  draw();
  window.addEventListener('resize', draw);
})();


/* ── 03. UR3 Arm (Three.js) ── */
(function initUR3Arm() {
  const canvas = document.getElementById('ur3-canvas');
  if (!canvas) return;
  const panel = canvas.parentElement;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.01, 50);
  camera.position.set(0, 0.85, 1.8);
  camera.lookAt(0, 0.65, 0);

  function resize() {
    const W = panel.clientWidth, H = panel.clientHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  [[[3,6,4], 0xffffff, 1.4], [[-3,3,-2], 0xaabbff, 0.5], [[0,2,-4], 0xffffff, 0.3]].forEach(([p,c,i]) => {
    const l = new THREE.DirectionalLight(c, i); l.position.set(...p); scene.add(l);
  });
  const rPt = new THREE.PointLight(0xc0200a, 1.2, 4); rPt.position.set(-1, 2, 1); scene.add(rPt);

  // Materials
  const mB  = new THREE.MeshStandardMaterial({ color: 0xa8a8a0, metalness: 0.35, roughness: 0.55 });
  const mJ  = new THREE.MeshStandardMaterial({ color: 0x2e2e2e, metalness: 0.8,  roughness: 0.2  });
  const mBs = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.65, roughness: 0.35 });
  const mR  = new THREE.MeshStandardMaterial({ color: 0xc0200a, metalness: 0.3,  roughness: 0.5  });
  const mT  = new THREE.MeshStandardMaterial({ color: 0xd0cfc8, metalness: 0.6,  roughness: 0.3  });

  const cy = (rt, rb, h, m, s = 20) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), m);
  const bx = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);

  // Build arm
  const root = new THREE.Group(); scene.add(root);
  const bd = cy(0.22, 0.26, 0.055, mBs); bd.position.y = 0.028; root.add(bd);
  const br = cy(0.17, 0.17, 0.03,  mR);  br.position.y = 0.068; root.add(br);
  const bc = cy(0.14, 0.14, 0.1,   mJ);  bc.position.y = 0.13;  root.add(bc);

  const j1 = new THREE.Group(); j1.position.y = 0.185; root.add(j1);
  const sh = cy(0.1, 0.1, 0.14, mJ, 24); sh.rotation.z = Math.PI / 2; j1.add(sh);
  [-.075, .075].forEach(x => { const s = cy(0.115, 0.115, 0.03, mB, 24); s.rotation.z = Math.PI / 2; s.position.x = x; j1.add(s); });

  const j2 = new THREE.Group(); j1.add(j2);
  const ua = cy(0.058, 0.058, 0.44, mB); ua.position.y = 0.22; j2.add(ua);
  const uas = cy(0.061, 0.061, 0.038, mR); uas.position.y = 0.20; j2.add(uas);
  const eh = cy(0.085, 0.085, 0.13, mJ, 24); eh.rotation.z = Math.PI / 2; eh.position.y = 0.44; j2.add(eh);
  [-.07, .07].forEach(x => { const e = cy(0.095, 0.095, 0.028, mB, 24); e.rotation.z = Math.PI / 2; e.position.set(x, 0.44, 0); j2.add(e); });

  const j3 = new THREE.Group(); j3.position.y = 0.44; j2.add(j3);
  const fa = cy(0.048, 0.048, 0.37, mB); fa.position.y = 0.185; j3.add(fa);
  const fas = cy(0.051, 0.051, 0.032, mR); fas.position.y = 0.09; j3.add(fas);
  const wh = cy(0.068, 0.068, 0.11, mJ, 24); wh.rotation.z = Math.PI / 2; wh.position.y = 0.37; j3.add(wh);

  const j4 = new THREE.Group(); j4.position.y = 0.37; j3.add(j4);
  const w1 = cy(0.04, 0.04, 0.11, mB); w1.position.y = 0.055; j4.add(w1);
  const w1h = cy(0.055, 0.055, 0.085, mJ, 24); w1h.rotation.z = Math.PI / 2; w1h.position.y = 0.11; j4.add(w1h);

  const j5 = new THREE.Group(); j5.position.y = 0.11; j4.add(j5);
  const w2 = cy(0.035, 0.035, 0.09, mB); w2.position.y = 0.045; j5.add(w2);
  const w2h = cy(0.048, 0.048, 0.065, mJ, 24); w2h.position.y = 0.09; j5.add(w2h);

  const j6 = new THREE.Group(); j6.position.y = 0.09; j5.add(j6);
  const fl = cy(0.04, 0.04, 0.028, mT); fl.position.y = 0.014; j6.add(fl);
  const fgb = bx(0.065, 0.015, 0.024, mJ); fgb.position.y = 0.038; j6.add(fgb);
  [.023, -.023].forEach(x => { const f = bx(0.015, 0.075, 0.015, mT); f.position.set(x, 0.076, 0); j6.add(f); });

  // Default pose
  j2.rotation.z = -0.15; j3.rotation.z = -0.5; j4.rotation.z = 0.5;

  // Mouse tracking
  let mx = 0.5, my = 0.5;
  panel.addEventListener('mousemove', e => {
    const r = panel.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width;
    my = (e.clientY - r.top) / r.height;
  });

  const lerp = (a, b, t) => a + (b - a) * t;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    j1.rotation.y = lerp(j1.rotation.y, (mx - .5) * 1.2, .05);
    j2.rotation.z = lerp(j2.rotation.z, -.15 + (my - .5) * -.7, .05);
    j3.rotation.z = lerp(j3.rotation.z, -.5  + (my - .5) * -.4, .05);
    j4.rotation.z = lerp(j4.rotation.z, .5   + (my - .5) * .35, .05);
    j5.rotation.y = lerp(j5.rotation.y, (mx - .5) * .5, .05);
    j6.rotation.z = Math.sin(t * .9) * .035;
    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();
})();


/* ── 04. Oscilloscope ── */
(function initOscilloscope() {
  const canvas = document.getElementById('osc-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let activeChannel = 0;
  let t = 0;

  // Cached dimensions — updated only on resize, not every frame
  let oscW = 0;
  const oscH = 160;

  const channels = [
    { fn: t => { const base = 0.55 + 0.18 * Math.sin(t * 0.8), noise = 0.018 * (Math.random() - 0.5), bump = 0.12 * Math.max(0, Math.sin(t * 2.1)) * (Math.sin(t * 0.3) > 0.2 ? 1 : 0); return Math.max(0.05, Math.min(0.95, base + noise + bump)); }},
    { fn: t => { const sweep = 0.5 + 0.32 * Math.sin(t * 0.45 + 0.8), correction = 0.08 * Math.sin(t * 4.2) * Math.exp(-((t % 3.5) * 0.8)), noise = 0.012 * (Math.random() - 0.5); return Math.max(0.05, Math.min(0.95, sweep + correction + noise)); }},
    { fn: t => { const travel = 0.5 + 0.2 * Math.sin(t * 0.35), vibe = 0.07 * Math.sin(t * 18.0), bump = 0.15 * Math.max(0, Math.sin(t * 1.1)) * (Math.sin(t * 0.7) > 0.6 ? 1 : 0), noise = 0.022 * (Math.random() - 0.5); return Math.max(0.05, Math.min(0.95, travel + vibe + bump + noise)); }}
  ];

  const POINTS = 300;
  const buffers = channels.map(() => new Array(POINTS).fill(0.5));
  const labels = ['Throttle', 'Steering', 'Suspension'];

  // Resize only updates canvas size — called on load + window resize only
  function resizeOsc() {
    oscW = canvas.offsetWidth;
    canvas.width  = oscW * dpr;
    canvas.height = oscH * dpr;
    canvas.style.width  = oscW + 'px';
    canvas.style.height = oscH + 'px';
    ctx.scale(dpr, dpr);
  }

  function draw() {
    const W = oscW, H = oscH;
    if (!W) return;
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const y = (i / 4) * H; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let i = 0; i <= 8; i++) { const x = (i / 8) * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke(); ctx.setLineDash([]);

    // Signal line
    const buf = buffers[activeChannel];
    ctx.strokeStyle = '#c0200a'; ctx.lineWidth = 1.5; ctx.shadowColor = 'rgba(192,32,10,0.4)'; ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let i = 0; i < POINTS; i++) { const x = (i / (POINTS - 1)) * W, y = (1 - buf[i]) * H; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke(); ctx.shadowBlur = 0;

    // Fill under line
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(192,32,10,0.08)'); grad.addColorStop(1, 'rgba(192,32,10,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(0, H);
    for (let i = 0; i < POINTS; i++) { const x = (i / (POINTS - 1)) * W, y = (1 - buf[i]) * H; ctx.lineTo(x, y); }
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();

    // Live dot + value
    const liveVal = buf[POINTS - 1], liveY = (1 - liveVal) * H;
    ctx.fillStyle = '#c0200a'; ctx.beginPath(); ctx.arc(W - 2, liveY, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(192,32,10,0.8)'; ctx.font = '10px "Barlow Condensed",monospace';
    ctx.fillText(Math.round(liveVal * 100) + '%', W - 36, liveY > 14 ? liveY - 6 : liveY + 14);
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.font = '11px "Barlow Condensed",monospace';
    ctx.fillText(labels[activeChannel].toUpperCase(), 8, 14);
  }

  function tick() {
    t += 0.025;
    channels.forEach((ch, i) => { buffers[i].shift(); buffers[i].push(ch.fn(t)); });
    draw();
    requestAnimationFrame(tick);
  }

  // Channel switcher buttons
  document.querySelectorAll('.osc-ch').forEach(btn => {
    btn.addEventListener('click', function () {
      activeChannel = parseInt(this.dataset.ch);
      document.querySelectorAll('.osc-ch').forEach(b => { b.style.borderColor = 'rgba(255,255,255,0.1)'; b.style.color = 'rgba(255,255,255,0.3)'; });
      this.style.borderColor = 'rgba(192,32,10,0.5)'; this.style.color = 'rgba(192,32,10,0.9)';
    });
  });

  resizeOsc();
  window.addEventListener('resize', resizeOsc);
  tick();
})();


/* ── 05. Other Projects Toggle ── */
function toggleOtherProjects() {
  const panel = document.getElementById('other-projects');
  const btn   = document.getElementById('other-projects-btn');
  const label = document.getElementById('other-btn-label');
  const isHidden = panel.style.display === 'none';

  if (isHidden) {
    panel.style.display = 'block';
    btn.classList.add('open');
    label.textContent = 'Hide Other Projects';
    // Trigger fade-in on newly visible elements
    panel.querySelectorAll('.fade-up').forEach(el => {
      el.classList.add('will-animate');
      obs.observe(el);
    });
  } else {
    panel.style.display = 'none';
    btn.classList.remove('open');
    label.textContent = 'Other Projects';
  }
}