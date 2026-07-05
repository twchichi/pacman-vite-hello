import { GameEngine } from './engine/Engine';
import type { Direction } from './engine/Input';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Cannot get 2d context from canvas');
}

// UI elements
const scoreEl = document.getElementById('score-text') as HTMLElement;
const livesEl = document.getElementById('lives-text') as HTMLElement;
const overlay = document.getElementById('overlay') as HTMLElement;
const startBtn = document.getElementById('start-btn') as HTMLElement;

// Create engine
const engine = new GameEngine(ctx);

// Update UI periodically
const updateUI = () => {
  if (scoreEl) scoreEl.textContent = `Score: ${engine.getScore()}`;
  if (livesEl) livesEl.textContent = `Lives: ${engine.getLives()}`;
  requestAnimationFrame(updateUI);
};
updateUI();

// Show overlay on game states
const checkOverlay = () => {
  const state = engine.getGameState();
  if (state === 'gameOver' || state === 'levelClear') {
    showOverlay(state);
  }
};

function showOverlay(state: string): void {
  const h1 = overlay.querySelector('h1') as HTMLHeadingElement;
  const p = overlay.querySelectorAll('p');
  const btn = document.getElementById('start-btn') as HTMLButtonElement;

  if (state === 'gameOver') {
    h1.textContent = 'GAME OVER';
    h1.style.color = '#f00';
    if (p[0]) p[0].textContent = `最終分數: ${engine.getScore()}`;
    if (btn) btn.textContent = 'RESTART';
  } else if (state === 'levelClear') {
    h1.textContent = 'STAGE CLEAR!';
    h1.style.color = '#0f0';
    if (p[0]) p[0].textContent = `完成！分數: ${engine.getScore()}`;
    if (btn) btn.textContent = 'NEXT LEVEL';
  }

  overlay.classList.remove('hidden');
}

// Start / restart handler
const startGame = () => {
  overlay.classList.add('hidden');
  engine.reset();
  engine.start();
  requestAnimationFrame(checkOverlay);
};

startBtn.addEventListener('click', startGame);
startBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startGame();
}, { passive: false });

// Expose game state for E2E tests
(window as any).__game = {
  engine,
  get score() { return engine.getScore(); },
  input: engine.input,
  canvas,
};

// D-Pad buttons for mobile (touch + mouse)
const dpadButtons = document.querySelectorAll('.dpad-btn[data-dir]');
dpadButtons.forEach(btn => {
  const dir = (btn as HTMLElement).dataset.dir as Direction;
  if (!dir) return;

  const press = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    engine.input.setCurrentDirection(dir);
    btn.classList.add('pressed');
  };

  const release = (e: Event) => {
    e.preventDefault();
    btn.classList.remove('pressed');
  };

  btn.addEventListener('touchstart', press, { passive: false });
  btn.addEventListener('touchend', release);
  btn.addEventListener('touchcancel', release);
  btn.addEventListener('mousedown', press);
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
});

// Swipe support on canvas area
const gameWrapper = document.getElementById('game-wrapper') as HTMLElement;
engine.input.attachSwipe(gameWrapper);

// Keyboard is auto-attached via engine.init()
engine.init();
engine.start();

requestAnimationFrame(checkOverlay);

console.log('[app] Pac-Man game initialized');
