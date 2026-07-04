import { type GhostMode } from './GhostTypes';
import { ScatterChaseTimer } from './ScatterChaseTimer';

/**
 * Game engine — coordinates game systems (ghosts, player, map, scoring).
 */
export class GameEngine {
  private running = false;
  private timer = new ScatterChaseTimer();

  /** Called when scatter/chase mode changes. */
  onModeChange: (mode: GhostMode) => void = () => {};

  init(): void {
    this.timer = new ScatterChaseTimer((mode) => this.onModeChange(mode));
    console.log('[engine] initialized');
  }

  start(): void {
    this.running = true;
    this.timer.start();
    console.log('[engine] started');
  }

  stop(): void {
    this.running = false;
    this.timer.stop();
    console.log('[engine] stopped');
  }

  /**
   * Update the engine by the given delta (ms).
   * Returns current ghost mode (scatter/chase/frightened).
   */
  update(deltaMs: number): GhostMode {
    if (!this.running) return this.timer.getCurrentMode();
    return this.timer.update(deltaMs);
  }

  reset(): void {
    this.timer.reset();
  }

  getCurrentMode(): GhostMode {
    return this.timer.getCurrentMode();
  }

  getTimeRemaining(): number {
    return this.timer.getTimeRemaining();
  }
}
