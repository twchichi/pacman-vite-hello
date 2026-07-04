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

  it('Pinky targets 4 tiles ahead in chase mode (right)', () => {
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('pinky', ghosts.pinky, pacman, ghosts.blinky, 'chase', 'right');
    expect(target).toEqual({ col: 18, row: 20 });
  });

  it('Pinky targets 4 tiles ahead in chase mode (up)', () => {
    // Classic overflow: up direction → offset goes 4 tiles up THEN 4 tiles left
    // (the ghost house is at the top of the screen; offset goes out of bounds)
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('pinky', ghosts.pinky, pacman, ghosts.blinky, 'chase', 'up');
    expect(target).toEqual({ col: 10, row: 16 });
  });

  it('Pinky targets 4 tiles ahead in chase mode (down)', () => {
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('pinky', ghosts.pinky, pacman, ghosts.blinky, 'chase', 'down');
    expect(target).toEqual({ col: 14, row: 24 });
  });

  it('Pinky targets 4 tiles ahead in chase mode (left)', () => {
    const pacman: Position = { col: 14, row: 20 };
    const target = calculateTarget('pinky', ghosts.pinky, pacman, ghosts.blinky, 'chase', 'left');
    expect(target).toEqual({ col: 10, row: 20 });
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

  it('Inky calculates target using Blinky reflection', () => {
    // Inky: target = 2 * ahead - blinky
    // Pacman at (14, 20), going right, Blinky at (10, 10)
    const pacman: Position = { col: 14, row: 20 };
    const blinky: Ghost = { ...ghosts.blinky, pos: { col: 10, row: 10 } };
    const target = calculateTarget('inky', ghosts.inky, pacman, blinky, 'chase', 'right');
    // ahead = (14+2, 20) = (16, 20)
    // vector = (10-16, 10-20) = (-6, -10)
    // target = (16 + (-6)*2, 20 + (-10)*2) = (16-12, 20-20) = (4, 0)
    expect(target).toEqual({ col: 4, row: 0 });
  });

  it('Inky handles Blinky behind Pacman', () => {
    const pacman: Position = { col: 14, row: 20 };
    const blinky: Ghost = { ...ghosts.blinky, pos: { col: 20, row: 25 } };
    const target = calculateTarget('inky', ghosts.inky, pacman, blinky, 'chase', 'right');
    // ahead = (16, 20)
    // vector = (20-16, 25-20) = (4, 5)
    // target = (16 + 4*2, 20 + 5*2) = (16+8, 20+10) = (24, 30)
    expect(target).toEqual({ col: 24, row: 30 });
  });

  it('Inky wraps around edges', () => {
    const pacman: Position = { col: 27, row: 15 };
    const blinky: Ghost = { ...ghosts.blinky, pos: { col: 1, row: 15 } };
    const target = calculateTarget('inky', ghosts.inky, pacman, blinky, 'chase', 'right');
    // ahead = (29, 15) → wrapped to (1, 15)
    // vector = (1-1, 15-15) = (0, 0)
    // target = (1 + 0, 15 + 0) = (1, 15)
    expect(target).toEqual({ col: 1, row: 15 });
  });
});
