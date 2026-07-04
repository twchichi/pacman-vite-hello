import { GameEngine } from './engine/Engine';
import { Input, keyToDirection } from './engine/Input';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('Cannot get 2d context from canvas');
}

// Score display
const scoreEl = document.createElement('div');
scoreEl.id = 'score-display';
scoreEl.textContent = 'Score: 0';
scoreEl.style.cssText = 'color:#fff;font:16px monospace;text-align:center;position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:10;pointer-events:none;';
document.body.appendChild(scoreEl);

// Create engine
const engine = new GameEngine(ctx);
engine.init();
engine.start();

// Expose game state for E2E tests
(window as any).__game = {
  engine,
  get score() {
    return engine.getScore();
  },
  input: engine.input,
  canvas,
};

// Also attach a keyboard handler to window that delegates to the engine's Input.
// This lets E2E tests dispatch events on window directly.
window.addEventListener('keydown', (e: KeyboardEvent) => {
  const dir = keyToDirection(e.key);
  if (dir) {
    engine.input.setDirection(dir);
  }
});

console.log('[app] Pac-Man game initialized');
