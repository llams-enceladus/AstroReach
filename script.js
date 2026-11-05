// The moon starts as the "o" in the logo and travels into the header logo spot as you scroll the first screen.
const moon = document.getElementById('moon');
const logoO = document.getElementById('logoO');
const homeDot = document.querySelector('.home');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (moon && logoO && homeDot && !reduce) {
  document.documentElement.classList.add('moon-js');
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  let ticking = false;

  function placeMoon() {
    const h = window.innerHeight;
    const size = moon.offsetWidth;                       // moon's natural width (38px)
    const o = logoO.getBoundingClientRect();             // logo "o" (moves as the page scrolls)
    const d = homeDot.getBoundingClientRect();           // header spot (fixed)
    const p = clamp(window.scrollY / (h * 0.6));
    const e = 1 - Math.pow(1 - p, 3);                    // ease out
    const cx = lerp(o.left + o.width / 2, d.left + d.width / 2, e);
    const cy = lerp(o.top + o.height / 2, d.top + d.height / 2, e);
    const s = lerp(o.width / size, d.width / size, e);
    moon.style.setProperty('--s', s);
    moon.style.setProperty('--x', (cx - (size * s) / 2) + 'px');
    moon.style.setProperty('--y', (cy - (size * s) / 2) + 'px');
    ticking = false;
  }
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(placeMoon); } };
  placeMoon();
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('load', placeMoon);
  if (document.fonts) document.fonts.ready.then(placeMoon);
}