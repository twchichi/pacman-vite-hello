import { GhostMode } from './GhostTypes';
import { FRIGHTENED_DURATION_SECONDS } from '../config/frightenedConstants';

/**
 * Manages frightened mode state independently from scatter/chase timer.
 *
 * Frightened is a temporary overlay on top of the scatter/chase phase.
 * When frightened activates, ghosts switch to frightened mode.
 * When frightened timer expires, ghosts revert to their scatter/chase mode.
 */
export class GhostManager {
  private frightenedTimer: number = 0; // seconds remaining
  private active: boolean = false;
  private onFrightenedExpired?: () => void;

  constructor(onFrightenedExpired?: () => void) {
    this.onFrightenedExpired = onFrightenedExpired;
  }

  /**
   * Activate frightened mode.
   * @returns duration remaining in seconds
   */
  activateFrightenedMode(): number {
    this.active = true;
    this.frightenedTimer = FRIGHTENED_DURATION_SECONDS;
    return this.frightenedTimer;
  }

  /**
   * Update frightened timer by delta seconds.
   * @returns true if frightened mode just expired this tick
   */
  updateFrightenedTimer(dt: number): boolean {
    if (!this.active || this.frightenedTimer <= 0) return false;

    this.frightenedTimer -= dt;

    if (this.frightenedTimer <= 0) {
      this.active = false;
      this.frightenedTimer = 0;
      this.onFrightenedExpired?.();
      return true;
    }

    return false;
  }

  /**
   * Check if frightened mode is currently active.
   */
  isFrightenedActive(): boolean {
    return this.active;
  }

  /**
   * Get remaining frightened time in seconds.
   */
  getRemainingTime(): number {
    return Math.max(0, this.frightenedTimer);
  }

  /**
   * Reset all frightened state.
   */
  reset(): void {
    this.active = false;
    this.frightenedTimer = 0;
    this.onFrightenedExpired = undefined;
  }
}
