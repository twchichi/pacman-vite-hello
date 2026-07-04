import type { ScoreEntry, ScoreService } from './ScoreService';

/**
 * In-memory mock for ScoreService.
 *
 * Useful for tests and when localStorage is not available.
 * Exposes the store directly for assertions.
 */
export class MockScoreService implements ScoreService {
  public readonly entries: ScoreEntry[];
  public readonly limit: number;

  constructor(entries: ScoreEntry[] = [], limit: number = 10) {
    this.entries = [...entries];
    this.limit = limit;
  }

  getHighScores(limit?: number): ScoreEntry[] {
    const n = limit ?? this.limit;
    return [...this.entries].sort((a, b) => b.score - a.score).slice(0, n);
  }

  submitScore(score: number, player: string = 'Player'): ScoreEntry | null {
    if (!Number.isFinite(score) || score < 0) {
      return null;
    }

    const entry: ScoreEntry = {
      score,
      player,
      timestamp: new Date().toISOString(),
    };

    const sorted = [...this.entries, entry].sort((a, b) => b.score - a.score);
    if (sorted.length <= this.limit) {
      this.entries.length = 0;
      this.entries.push(...sorted);
    } else {
      // Compare against the cutoff: the lowest score currently in the list
      const cutoff = sorted[this.limit - 1].score;
      if (entry.score > cutoff || (entry.score === cutoff && entry !== sorted[this.limit - 1])) {
        this.entries.length = 0;
        this.entries.push(...sorted.slice(0, this.limit));
      } else {
        return null;
      }
    }

    return entry;
  }

  reset(): void {
    this.entries.length = 0;
  }
}
