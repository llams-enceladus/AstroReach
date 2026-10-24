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


// Scroll-driven moon: it drifts down the page, swinging left and right, and shrinks slightly.
const moon = document.getElementById('moon');
if (moon) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;
  function placeMoon() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;  // 0 = top, 1 = bottom
    const w = window.innerWidth, h = window.innerHeight;
    const swing = Math.sin(p * Math.PI * 3);                // 1.5 left-right swings over the page
    const x = w * (0.86 + 0.06 * swing) - moon.offsetWidth / 2;
    const y = h * (0.14 + 0.66 * p);
    const s = 1.3 - 0.5 * p;
    moon.style.setProperty('--x', x + 'px');
    moon.style.setProperty('--y', y + 'px');
    moon.style.setProperty('--s', s);
    ticking = false;
  }
  placeMoon();
  if (!still) {
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(placeMoon); } }, { passive: true });
    window.addEventListener('resize', placeMoon);
  }
}