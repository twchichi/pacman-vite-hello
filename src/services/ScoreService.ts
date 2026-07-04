import type { Player } from '../engine/Player';

/** A single high score entry */
export interface ScoreEntry {
  /** Score value (integers only) */
  score: number;
  /** Who earned it — name or player id */
  player: string;
  /** ISO timestamp when the score was recorded */
  timestamp: string;
}

/**
 * Service interface for persisting and retrieving high scores.
 *
 * UI and game logic depend only on this interface (DI).
 * Concrete implementations live in src/services/.
 */
export interface ScoreService {
  /** Return the top N high scores (default 10), descending */
  getHighScores(limit?: number): ScoreEntry[];

  /**
   * Submit a score. Returns the full entry (with timestamp).
   * If the score qualifies (fits in top N), it is persisted.
   */
  submitScore(score: number, player?: string): ScoreEntry | null;
}
