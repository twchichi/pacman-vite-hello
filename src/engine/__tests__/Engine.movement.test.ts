import { describe, it, expect } from 'vitest';
import { GameEngine } from '../Engine';

/**
 * Regression test: GameLoop passes deltaTime in milliseconds, but Player.move()
 * and the ghost/frightened timers are all seconds-based. Engine.update() must
 * convert before using deltaTime downstream, or movement/timers run 1000x too fast.
 */
describe('GameEngine movement integration', () => {
  const mockCtx = () =>
    ({
      fillStyle: '',
      fillRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
    }) as unknown as CanvasRenderingContext2D;

  it('moves the player at the expected px/s rate, not 1000x too fast', () => {
    const engine = new GameEngine(mockCtx());
    engine.init();

    const player = (engine as any).player;
    const startX = player.x;

    (engine as any).input.setDirection('right');

    // 10 ticks at 30fps (GameLoop passes stepMs = 1000/30 per tick)
    for (let i = 0; i < 10; i++) {
      (engine as any).update(1000 / 30);
    }

    // speed=120px/s over 10 frames of 1/30s (=1/3s) => ~40px
    const dx = player.x - startX;
    expect(dx).toBeCloseTo(40, 0);
  });

  it('moves ghosts to finite grid positions without throwing', () => {
    const engine = new GameEngine(mockCtx());
    engine.init();

    for (let i = 0; i < 10; i++) {
      (engine as any).update(1000 / 30);
    }

    const ghosts = (engine as any).ghosts;
    for (const name of Object.keys(ghosts)) {
      const g = ghosts[name];
      expect(Number.isFinite(g.pos.col)).toBe(true);
      expect(Number.isFinite(g.pos.row)).toBe(true);
    }
  });
});
