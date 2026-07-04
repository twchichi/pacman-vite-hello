import { describe, it, expect, beforeEach } from 'vitest';
import { ScatterChaseTimer } from '../ScatterChaseTimer';

describe('ScatterChaseTimer', () => {
  let timer: ScatterChaseTimer;
  let modeChanges: string[];

  beforeEach(() => {
    modeChanges = [];
    timer = new ScatterChaseTimer((mode) => modeChanges.push(mode));
  });

  it('starts in scatter mode', () => {
    expect(timer.getCurrentMode()).toBe('scatter');
  });

  it('transitions through phases in order', () => {
    timer.start();
    timer.update(7000); // scatter ends
    expect(timer.getCurrentMode()).toBe('chase');
    expect(modeChanges).toContain('chase');

    timer.update(20000); // chase ends
    expect(timer.getCurrentMode()).toBe('scatter');
  });

  it('cycles back to start after all phases', () => {
    timer.start();
    timer.update(7000);  // scatter
    timer.update(20000); // chase
    timer.update(7000);  // scatter
    timer.update(20000); // chase (should wrap)
    expect(timer.getCurrentMode()).toBe('scatter');
  });

  it('returns time remaining correctly', () => {
    timer.start();
    expect(timer.getTimeRemaining()).toBe(7000);
    timer.update(3000);
    expect(timer.getTimeRemaining()).toBe(4000);
  });

  it('does not count time when stopped', () => {
    timer.start();
    timer.update(3000);
    expect(timer.getTimeRemaining()).toBe(4000);

    timer.stop();
    timer.update(5000);
    expect(timer.getTimeRemaining()).toBe(4000); // unchanged
  });

  it('resets to initial state', () => {
    timer.start();
    timer.update(10000);
    timer.reset();
    expect(timer.getCurrentMode()).toBe('scatter');
    expect(timer.getTimeRemaining()).toBe(7000);
  });

  it('notifies on mode change', () => {
    timer.start();
    expect(modeChanges).toHaveLength(1);
    expect(modeChanges[0]).toBe('scatter');

    timer.update(7000);
    expect(modeChanges).toHaveLength(2);
    expect(modeChanges[1]).toBe('chase');
  });
});
