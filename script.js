// Stopwatch logic (high-precision with performance.now)
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const clearLapsBtn = document.getElementById('clearLaps');
const lapsList = document.getElementById('laps');
const lapCount = document.getElementById('lapCount');
const yearSpan = document.getElementById('year');

yearSpan.textContent = new Date().getFullYear();

let startTime = 0;
let elapsed = 0;
let rafId = null;
let running = false;
let lastLapTime = 0;

function format(ms) {
  const milliseconds = ms % 1000;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');
  const msStr = String(milliseconds).padStart(3, '0');
  return `${h}:${m}:${s}.${msStr}`;
}

function render() {
  const now = performance.now();
  const current = running ? elapsed + (now - startTime) : elapsed;
  display.textContent = format(Math.floor(current));
  rafId = requestAnimationFrame(render);
}

function start() {
  if (running) return;
  running = true;
  startTime = performance.now();
  render();
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  lapBtn.disabled = false;
  resetBtn.disabled = false;
}

function pause() {
  if (!running) return;
  running = false;
  elapsed += performance.now() - startTime;
  cancelAnimationFrame(rafId);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function reset() {
  running = false;
  cancelAnimationFrame(rafId);
  elapsed = 0;
  lastLapTime = 0;
  display.textContent = '00:00:00.000';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  lapBtn.disabled = true;
  clearLaps();
}

function lap() {
  const current = running ? elapsed + (performance.now() - startTime) : elapsed;
  const lapTime = current - lastLapTime;
  lastLapTime = current;
  const li = document.createElement('li');
  li.className = 'lap';
  const n = lapsList.children.length + 1;
  li.innerHTML = `
    <strong>Lap ${n}</strong>
    <span class="badge">${format(lapTime)}</span>
    <small>Total: ${format(current)}</small>
  `;
  lapsList.prepend(li);
  lapCount.textContent = lapsList.children.length;
  clearLapsBtn.disabled = false;
}

function clearLaps() {
  lapsList.innerHTML = '';
  lapCount.textContent = '0';
  clearLapsBtn.disabled = true;
}

// Bind events
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);
clearLapsBtn.addEventListener('click', clearLaps);

// Keyboard shortcuts: Space=start/pause, L=lap, R=reset
window.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea')) return;
  if (e.code === 'Space') { e.preventDefault(); running ? pause() : start(); }
  if (e.key.toLowerCase() === 'l') lap();
  if (e.key.toLowerCase() === 'r') reset();
});
