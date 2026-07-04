import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../Engine';
import { type GhostMode } from '../GhostTypes';

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    engine.init();
  });

  it('starts in scatter mode', () => {
    expect(engine.getCurrentMode()).toBe('scatter');
  });

  it('starts timer when start() is called', () => {
    engine.start();
    expect(engine.getTimeRemaining()).toBeLessThan(7000);
  });

  it('updates mode after time passes', () => {
    engine.start();
    engine.update(7000);
    expect(engine.getCurrentMode()).toBe('chase');
  });

  it('notifies on mode change', () => {
    const changes: GhostMode[] = [];
    engine.onModeChange = (mode) => changes.push(mode);

    engine.start();
    expect(changes).toHaveLength(1);
    expect(changes[0]).toBe('scatter');

    engine.update(7000);
    expect(changes).toHaveLength(2);
    expect(changes[1]).toBe('chase');
  });

  it('resets engine state', () => {
    engine.start();
    engine.update(10000);
    engine.reset();
    expect(engine.getCurrentMode()).toBe('scatter');
    expect(engine.getTimeRemaining()).toBe(7000);
  });

  it('does not update when stopped', () => {
    engine.start();
    engine.update(5000);
    expect(engine.getCurrentMode()).toBe('chase');

    engine.stop();
    engine.update(100000);
    expect(engine.getCurrentMode()).toBe('chase'); // unchanged
  });
});
