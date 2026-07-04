/**
 * Fixed-time-step game loop.
 *
 * Uses requestAnimationFrame for smooth rendering, but accumulates time
 * and updates game logic at fixed intervals (1000/fps milliseconds).
 * This prevents the "spiral of death" and ensures deterministic behavior
 * regardless of frame rate.
 */

export interface LoopOptions {
  fps?: number;
  update: (dt: number) => void;
}

export class GameLoop {
  private readonly stepMs: number;
  private readonly update: (dt: number) => void;
  private rafId: number | null = null;
  private lastTime = 0;
  private accumulator = 0;
  private running = false;

  constructor(options: LoopOptions) {
    const fps = options.fps ?? 30;
    this.stepMs = 1000 / fps;
    this.update = options.update;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.tick(this.lastTime);
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  get isRunning(): boolean {
    return this.running;
  }

  private tick = (currentTime: number): void => {
    if (!this.running) return;

    const delta = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += delta;

    // Cap accumulator to prevent spiral of death
    const maxFrameTime = 250; // ~4fps
    if (this.accumulator > maxFrameTime) {
      this.accumulator = maxFrameTime;
    }

    let updates = 0;
    while (this.accumulator >= this.stepMs && updates < 5) {
      this.update(this.stepMs);
      this.accumulator -= this.stepMs;
      updates++;
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}
