import type { ScoreEntry, ScoreService } from './ScoreService';

const STORAGE_KEY = 'pacman-highscores';
const DEFAULT_LIMIT = 10;

/**
 * ScoreService backed by browser localStorage.
 *
 * Storage shape: JSON array of ScoreEntry, capped at `limit` entries.
 * When a new score qualifies, the array is re-sorted descending and trimmed.
 *
 * This is a Node-safe implementation that falls back to an in-memory store
 * when localStorage is unavailable (SSR, tests, Node env).
 */
export class LocalScoreService implements ScoreService {
  private readonly limit: number;
  private readonly storage: Storage | null;
  private memoryStore: ScoreEntry[] = [];

  constructor(limit: number = DEFAULT_LIMIT, storage?: Storage | null) {
    this.limit = Math.max(1, Math.min(100, limit));
    this.storage = storage ?? this.detectStorage();
    this.load();
  }

  getHighScores(limit?: number): ScoreEntry[] {
    const n = limit ?? this.limit;
    return [...this.memoryStore].sort((a, b) => b.score - a.score).slice(0, n);
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

    // Check if this score qualifies for the leaderboard
    const sorted = [...this.memoryStore, entry].sort((a, b) => b.score - a.score);
    if (sorted.length <= this.limit) {
      this.memoryStore = sorted;
    } else if (entry.score >= sorted[sorted.length - 1].score) {
      this.memoryStore = sorted.slice(0, this.limit);
    } else {
      // Score doesn't make the cut
      return null;
    }

    this.persist();
    return entry;
  }

  /** Reset all scores. Useful for tests. */
  reset(): void {
    this.memoryStore = [];
    if (this.storage) {
      try {
        this.storage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }

  /** Internal: persist to storage */
  private persist(): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.memoryStore));
    } catch {
      // storage full or unavailable — keep in-memory
    }
  }

  /** Internal: load from storage */
  private load(): void {
    if (!this.storage) return;
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          this.memoryStore = parsed.filter((e) => this.isValidEntry(e));
        }
      }
    } catch {
      // corrupt data — start fresh
      this.memoryStore = [];
    }
  }

  private isValidEntry(e: unknown): e is ScoreEntry {
    if (!e || typeof e !== 'object') return false;
    const obj = e as Partial<ScoreEntry>;
    return (
      typeof obj.score === 'number' &&
      typeof obj.player === 'string' &&
      typeof obj.timestamp === 'string'
    );
  }

  /** Detect if localStorage is available (Node.js / test env will return null) */
  private detectStorage(): Storage | null {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      try {
        const testKey = '__ls_test__';
        const ls = (globalThis as any).localStorage;
        ls.setItem(testKey, '1');
        ls.removeItem(testKey);
        return ls;
      } catch {
        return null;
      }
    }
    return null;
  }
}
