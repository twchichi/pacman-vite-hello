import { GhostMode, Ghost, GhostName } from './GhostTypes';
import { GhostManager } from './GhostManager';

/**
 * Controls ghost state transitions:
 * - normal (scatter/chase) -> frightened (when power pellet eaten)
 * - frightened -> eaten (when player catches frightened ghost)
 * - eaten -> normal (after respawn timer)
 */
export class GhostStateController {
  private manager: GhostManager;
  private eatenTimers: Map<GhostName, number> = new Map();

  constructor(manager: GhostManager) {
    this.manager = manager;
  }

  /**
   * Set ghost to frightened mode.
   * Also activates the frightened timer on the GhostManager.
   */
  setFrightened(ghost: Ghost): Ghost {
    const newGhost = { ...ghost };
    newGhost.mode = 'frightened';
    this.manager.activateFrightenedMode();
    return newGhost;
  }

  /**
   * Set ghost to eaten state (eyes returning to ghost house).
   * Respawn timer starts at 3 seconds.
   */
  setEaten(ghost: Ghost): Ghost {
    const newGhost = { ...ghost };
    newGhost.mode = 'eaten';
    this.eatenTimers.set(ghost.name, 3);
    return newGhost;
  }

  /**
   * Update eaten timers and return ghosts that have respawned.
   */
  updateEatenTimers(dt: number): GhostName[] {
    const respawned: GhostName[] = [];

    this.eatenTimers.forEach((timer, ghostName) => {
      const newTimer = timer - dt;
      if (newTimer <= 0) {
        this.eatenTimers.delete(ghostName);
        respawned.push(ghostName);
      } else {
        this.eatenTimers.set(ghostName, newTimer);
      }
    });

    return respawned;
  }

  /**
   * Update frightened timer.
   * Returns true if frightened mode just expired.
   */
  updateFrightenedTimer(dt: number): boolean {
    return this.manager.updateFrightenedTimer(dt);
  }

  /**
   * Check if frightened mode is currently active.
   */
  isFrightenedActive(): boolean {
    return this.manager.isFrightenedActive();
  }

  /**
   * Get score for eating a frightened ghost based on combo.
   * Classic scoring: 200, 400, 800, 1600 (x2 for each consecutive)
   */
  getFrightenedGhostScore(combo: number): number {
    return 200 * Math.pow(2, combo - 1);
  }

  /**
   * Get remaining eaten time for a ghost.
   */
  getEatenTimeLeft(ghostName: GhostName): number | undefined {
    return this.eatenTimers.get(ghostName);
  }

  /**
   * Reset all state.
   */
  reset(): void {
    this.eatenTimers.clear();
    this.manager.reset();
  }
}
