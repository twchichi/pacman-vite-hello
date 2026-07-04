import { describe, it, expect, beforeEach } from 'vitest';
import { createAllGhosts, type Position, type GhostName, type Ghost } from '../GhostTypes';
import { calculateTarget } from '../GhostTargeting';

describe('GhostTargeting', () => {
  let ghosts: Record<GhostName, Ghost>;

  beforeEach(() => {
    ghosts = createAllGhosts();
  });

  it('Blinky targets Pac-Man in chase mode', () => {
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('blinky', ghosts.blinky, pacman, ghosts.blinky, 'chase');
    expect(target).toEqual(pacman);
  });

  it('Blinky targets scatter corner in scatter mode', () => {
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('blinky', ghosts.blinky, pacman, ghosts.blinky, 'scatter');
    expect(target).toEqual({ col: 25, row: 0 });
  });

  it('Pinky targets 4 tiles ahead in chase mode', () => {
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('pinky', ghosts.pinky, pacman, ghosts.blinky, 'chase');
    expect(target).toEqual({ col: 18, row: 20 });
  });

  it('Pinky targets scatter corner in scatter mode', () => {
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('pinky', ghosts.pinky, pacman, ghosts.blinky, 'scatter');
    expect(target).toEqual({ col: 2, row: 0 });
  });

  it('Clyde chases Pac-Man when far away', () => {
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('clyde', ghosts.clyde, pacman, ghosts.blinky, 'chase');
    expect(target).toEqual(pacman);
  });

  it('Clyde retreats to scatter corner when close', () => {
    const pacman: Position = { col: 17, row: 4 };
    const target = calculateTarget('clyde', ghosts.clyde, pacman, ghosts.blinky, 'chase');
    expect(target).toEqual({ col: 3, row: 29 });
  });

  it('Clyde targets scatter corner in scatter mode', () => {
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('clyde', ghosts.clyde, pacman, ghosts.blinky, 'scatter');
    expect(target).toEqual({ col: 3, row: 29 });
  });
});
