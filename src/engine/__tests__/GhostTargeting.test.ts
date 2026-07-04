import { describe, it, expect } from 'vitest';
import { calculateTarget } from '../GhostTargeting';
import { createGhost } from '../GhostTypes';

describe('GhostTargeting - calculateTarget', () => {
  const pacman = { col: 14, row: 15 };
  const blinky = createGhost('blinky');

  describe('Blinky', () => {
    it('should target Pacman in chase mode', () => {
      const target = calculateTarget('blinky', blinky, pacman, blinky, 'chase');
      expect(target).toEqual(pacman);
    });

    it('should target scatter corner in scatter mode', () => {
      const target = calculateTarget('blinky', blinky, pacman, blinky, 'scatter');
      expect(target).toEqual({ col: 25, row: 0 });
    });
  });

  describe('Pinky', () => {
    it('should target scatter corner in scatter mode', () => {
      const target = calculateTarget('pinky', createGhost('pinky'), pacman, blinky, 'scatter');
      expect(target).toEqual({ col: 2, row: 0 });
    });

    it('should target ahead of Pacman in chase mode with right direction', () => {
      const target = calculateTarget('pinky', createGhost('pinky'), pacman, blinky, 'chase', 'right');
      expect(target).toEqual({ col: 18, row: 15 });
    });

    it('should target ahead of Pacman in chase mode with left direction', () => {
      const target = calculateTarget('pinky', createGhost('pinky'), pacman, blinky, 'chase', 'left');
      expect(target).toEqual({ col: 10, row: 15 });
    });

    it('should target ahead of Pacman in chase mode with up direction (with overflow bug)', () => {
      const target = calculateTarget('pinky', createGhost('pinky'), pacman, blinky, 'chase', 'up');
      expect(target).toEqual({ col: 10, row: 11 });
    });

    it('should target ahead of Pacman in chase mode with down direction', () => {
      const target = calculateTarget('pinky', createGhost('pinky'), pacman, blinky, 'chase', 'down');
      expect(target).toEqual({ col: 14, row: 19 });
    });
  });

  describe('Clyde', () => {
    it('should target scatter corner in scatter mode', () => {
      const target = calculateTarget('clyde', createGhost('clyde'), pacman, blinky, 'scatter');
      expect(target).toEqual({ col: 3, row: 29 });
    });

    it('should target Pacman in chase mode when far away', () => {
      const clyde = createGhost('clyde');
      clyde.pos = { col: 0, row: 0 };
      const target = calculateTarget('clyde', clyde, pacman, blinky, 'chase');
      expect(target).toEqual(pacman);
    });

    it('should target scatter corner in chase mode when close', () => {
      const clyde = createGhost('clyde');
      clyde.pos = { col: 14, row: 15 };
      const target = calculateTarget('clyde', clyde, pacman, blinky, 'chase');
      expect(target).toEqual({ col: 3, row: 29 });
    });
  });

  describe('Inky', () => {
    it('should target scatter corner in scatter mode', () => {
      const target = calculateTarget('inky', createGhost('inky'), pacman, blinky, 'scatter');
      expect(target).toEqual({ col: 27, row: 29 });
    });

    it('should use reflection in chase mode', () => {
      const inky = createGhost('inky');
      const target = calculateTarget('inky', inky, pacman, blinky, 'chase', 'right');
      expect(target).toBeDefined();
      expect(typeof target.col).toBe('number');
      expect(typeof target.row).toBe('number');
    });
  });
});
