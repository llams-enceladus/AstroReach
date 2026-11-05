// Simple transit model: dip depth = (planet width / star width)^2
const slider = document.getElementById('size');
const graph = document.getElementById('graph');
const readout = document.getElementById('readout');

function draw() {
  if (!slider) return;
  const ratio = slider.value / 100;          // planet width as a fraction of the star
  const depth = ratio * ratio;               // fraction of light blocked
  const top = 60, scale = 3000;              // pixels; exaggerated so small dips are visible
  const bottom = top + depth * scale;
  graph.innerHTML =
    `<line x1="40" y1="${top}" x2="580" y2="${top}" stroke="#2a3166" stroke-dasharray="4 6"/>` +
    `<path d="M40 ${top} H210 L240 ${bottom} H400 L430 ${top} H580" fill="none" stroke="#7fb2ff" stroke-width="3" stroke-linejoin="round"/>` +
    `<text x="40" y="250" fill="#aab0d6" font-size="14">Time →</text>` +
    `<text x="40" y="30" fill="#aab0d6" font-size="14">Brightness</text>`;
  readout.textContent = `The planet blocks about ${(depth * 100).toFixed(2)}% of the star's light.`;
}
if (slider) { slider.addEventListener('input', draw); draw(); }


// Scroll-driven moon.
// Homepage: it starts as the "o" in the logo, leaps out as you begin to scroll, falls down the
// right edge, then drifts the rest of the way down the page. Other pages: it just drifts.
const moon = document.getElementById('moon');
const logoO = document.getElementById('logoO');
if (moon) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  let ticking = false;

  function placeMoon() {
    const w = window.innerWidth, h = window.innerHeight;
    const max = document.documentElement.scrollHeight - h;
    const sy = window.scrollY;
    const half = moon.offsetWidth / 2;
    const sideX = w * 0.86;
    let x, y, s;

    if (logoO) {
      const r = logoO.getBoundingClientRect();
      const ox = r.left + r.width / 2, oy = r.top + r.height / 2;   // where the logo's "o" is right now
      const s0 = r.width / moon.offsetWidth;                         // size that matches the "o"
      const jump = clamp(sy / (0.35 * h));                           // 0 to 1: leaping out
      const fall = clamp((sy - 0.35 * h) / (0.55 * h));             // 0 to 1: falling down the edge
      const q = clamp((sy - 0.9 * h) / Math.max(1, max - 0.9 * h)); // 0 to 1: rest of the page
      const ease = 1 - Math.pow(1 - jump, 3);                        // fast start, soft landing
      const peakY = h * 0.18, landY = h * 0.6;
      x = lerp(ox, sideX, ease) + w * 0.06 * Math.sin(q * Math.PI * 3);
      y = jump < 1 ? lerp(oy, peakY, ease)
                   : lerp(lerp(peakY, landY, fall * fall), h * 0.8, q);   // fall * fall = gravity
      s = lerp(lerp(s0, 1.1, ease), 0.8, q);
    } else {
      const p = max > 0 ? clamp(sy / max) : 0;
      x = w * (0.86 + 0.06 * Math.sin(p * Math.PI * 3));
      y = h * (0.14 + 0.66 * p);
      s = 1.3 - 0.5 * p;
    }
    moon.style.setProperty('--x', (x - half) + 'px');
    moon.style.setProperty('--y', (y - half) + 'px');
    moon.style.setProperty('--s', s);
    ticking = false;
  }

  if (still) {
    moon.style.display = 'none';            // reduced motion: no moving moon; the logo keeps its "o"
  } else {
    if (logoO) document.documentElement.classList.add('moon-js');
    placeMoon();
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(placeMoon); } }, { passive: true });
    window.addEventListener('resize', placeMoon);
    window.addEventListener('load', placeMoon);
    if (document.fonts) document.fonts.ready.then(placeMoon);
  }
}