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