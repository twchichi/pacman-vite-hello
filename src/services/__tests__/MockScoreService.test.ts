import { describe, it, expect } from 'vitest';
import { MockScoreService } from '../MockScoreService';
import type { ScoreEntry } from '../ScoreService';

describe('MockScoreService', () => {
  it('returns empty list on fresh service', () => {
    const svc = new MockScoreService();
    expect(svc.getHighScores()).toEqual([]);
  });

  it('returns scores sorted descending', () => {
    const entries: ScoreEntry[] = [
      { score: 100, player: 'A', timestamp: '2024-01-01T00:00:00Z' },
      { score: 500, player: 'B', timestamp: '2024-01-02T00:00:00Z' },
      { score: 200, player: 'C', timestamp: '2024-01-03T00:00:00Z' },
    ];
    const svc = new MockScoreService(entries);
    const top = svc.getHighScores();
    expect(top.map((e) => e.score)).toEqual([500, 200, 100]);
  });

  it('respects limit parameter', () => {
    const entries = Array.from({ length: 5 }, (_, i) => ({
      score: (i + 1) * 100,
      player: `P${i + 1}`,
      timestamp: '2024-01-01T00:00:00Z',
    }));
    const svc = new MockScoreService(entries, 3);
    expect(svc.getHighScores()).toHaveLength(3);
  });

  it('returns null for negative score', () => {
    const svc = new MockScoreService();
    expect(svc.submitScore(-100)).toBeNull();
  });

  it('returns null for NaN score', () => {
    const svc = new MockScoreService();
    expect(svc.submitScore(NaN)).toBeNull();
  });

  it('returns null for undefined score', () => {
    const svc = new MockScoreService();
    expect(svc.submitScore(undefined as any)).toBeNull();
  });

  it('accepts a valid score and returns entry', () => {
    const svc = new MockScoreService();
    const result = svc.submitScore(1000, 'Alice');
    expect(result).not.toBeNull();
    expect(result!.score).toBe(1000);
    expect(result!.player).toBe('Alice');
    expect(result!.timestamp).toBeTruthy();
  });

  it('defaults player name to Player', () => {
    const svc = new MockScoreService();
    const result = svc.submitScore(500);
    expect(result!.player).toBe('Player');
  });

  it('maintains sorted order after multiple submissions', () => {
    const svc = new MockScoreService();
    svc.submitScore(100);
    svc.submitScore(500);
    svc.submitScore(250);
    const top = svc.getHighScores();
    expect(top.map((e) => e.score)).toEqual([500, 250, 100]);
  });

  it('trims to limit when exceeded', () => {
    const svc = new MockScoreService([], 3);
    svc.submitScore(100);
    svc.submitScore(200);
    svc.submitScore(300);
    svc.submitScore(400); // should kick out 100
    expect(svc.getHighScores()).toHaveLength(3);
    expect(svc.getHighScores().map((e) => e.score)).toEqual([400, 300, 200]);
  });

  it('does not add score below cutoff', () => {
    const svc = new MockScoreService([], 2);
    svc.submitScore(500);
    svc.submitScore(1000);
    const result = svc.submitScore(50); // below cutoff
    expect(result).toBeNull();
    expect(svc.getHighScores()).toHaveLength(2);
  });

  it('uses default player name when not specified', () => {
    const svc = new MockScoreService();
    const result = svc.submitScore(300);
    expect(result!.player).toBe('Player');
  });

  it('reset clears all entries', () => {
    const svc = new MockScoreService();
    svc.submitScore(100);
    svc.submitScore(200);
    svc.reset();
    expect(svc.getHighScores()).toEqual([]);
  });

  it('does not mutate original entries array on construction', () => {
    const original: ScoreEntry[] = [
      { score: 100, player: 'A', timestamp: '2024-01-01T00:00:00Z' },
    ];
    const svc = new MockScoreService(original);
    svc.submitScore(200);
    // Original should not have been modified by getHighScores
    expect(svc.getHighScores().map((e) => e.score)).toEqual([200, 100]);
  });
});
