import { GameEngine } from './engine/Engine';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const container = document.getElementById('game-container') as HTMLElement;
const ctx = canvas.getContext('2d');

if (ctx) {
  const engine = new GameEngine(ctx);
  engine.init(canvas, container);
  engine.start();

  console.log('[Pacman Clone] Game initialized successfully!');
} else {
  console.error('[Pacman Clone] Could not get 2D context from canvas');
}
