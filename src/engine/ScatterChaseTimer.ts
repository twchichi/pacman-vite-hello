import { type GhostMode } from './GhostTypes';

/**
 * Classic Pac-Man scatter/chase phase timing (in milliseconds).
 *
 * Timing:
 *  - Scatter: 7s → 20s → 7s → 20s (repeat)
 *  - Chase:   20s → 7s → 20s → ...
 *
 * Note: The total scatter+chase cycle is 27s in classic Pac-Man.
 * This implementation uses the original Ms. Pac-Man timing table which
 * is the most commonly referenced: scatter 7s, chase 20s, scatter 7s, chase 20s.
 */
const PHASES: { mode: GhostMode; durationMs: number }[] = [
  { mode: 'scatter', durationMs: 7000 },
  { mode: 'chase', durationMs: 20000 },
  { mode: 'scatter', durationMs: 7000 },
  { mode: 'chase', durationMs: 20000 },
];

export class ScatterChaseTimer {
  private phaseIndex: number = 0;
  private phaseStartTime: number = 0;
  private totalElapsed: number = 0;
  private running: boolean = false;
  private onModeChange: ((mode: GhostMode) => void) | null = null;

  constructor(onModeChange?: (mode: GhostMode) => void) {
    if (onModeChange) {
      this.onModeChange = onModeChange;
    }
  }

  /**
   * Get the current phase mode.
   */
  getCurrentMode(): GhostMode {
    return PHASES[this.phaseIndex]?.mode ?? 'chase';
  }

  /**
   * Get the time remaining in the current phase (ms).
   */
  getTimeRemaining(): number {
    const phase = PHASES[this.phaseIndex];
    if (!phase) return 0;
    const elapsedInPhase = this.totalElapsed - this.phaseStartTime;
    return Math.max(0, phase.durationMs - elapsedInPhase);
  }

  /**
   * Get the total elapsed time across all phases (ms).
   */
  getTotalElapsed(): number {
    return this.totalElapsed;
  }

  /**
   * Start the timer (called when game begins).
   */
  start(): void {
    this.running = true;
    this.phaseStartTime = this.totalElapsed;
    this.notifyModeChange();
  }

  /**
   * Stop the timer.
   */
  stop(): void {
    this.running = false;
  }

  /**
   * Reset the timer to initial state.
   */
  reset(): void {
    this.phaseIndex = 0;
    this.totalElapsed = 0;
    this.phaseStartTime = 0;
  }

  /**
   * Advance the timer by `deltaMs` and update phase if needed.
   * Returns the current mode.
   */
  update(deltaMs: number): GhostMode {
    if (!this.running) return this.getCurrentMode();

    this.totalElapsed += deltaMs;

    const phase = PHASES[this.phaseIndex];
    if (!phase) return 'chase';

    const elapsedInPhase = this.totalElapsed - this.phaseStartTime;

    if (elapsedInPhase >= phase.durationMs) {
      // Phase elapsed, advance to next
      this.phaseIndex++;

      // Wrap around to cycle
      if (this.phaseIndex >= PHASES.length) {
        this.phaseIndex = 0;
        this.totalElapsed = 0;
      }

      this.phaseStartTime = this.totalElapsed;
      this.notifyModeChange();
    }

    return this.getCurrentMode();
  }

  /**
   * Set the current mode directly (useful for frighten mode or manual override).
   */
  setMode(mode: GhostMode): void {
    if (mode === 'frightened') return; // Frightened is managed separately

    this.phaseIndex = PHASES.findIndex((p) => p.mode === mode);
    if (this.phaseIndex === -1) return;

    this.phaseStartTime = this.totalElapsed;
    this.notifyModeChange();
  }

  private notifyModeChange(): void {
    if (this.onModeChange) {
      this.onModeChange(this.getCurrentMode());
    }
  }
}
