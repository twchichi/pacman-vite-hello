import { type Direction } from './Input';

export type GhostMode = 'scatter' | 'chase' | 'frightened' | 'eaten';
export type Position = { col: number; row: number };
export type GhostName = 'blinky' | 'pinky' | 'inky' | 'clyde';

export type Ghost = {
  name: GhostName;
  pos: Position;
  direction: Direction;
  mode: GhostMode;
  target: Position;
};

export const GHOST_NAMES: GhostName[] = ['blinky', 'pinky', 'inky', 'clyde'];

export const GHOST_START_POSITIONS: Record<GhostName, Position> = {
  blinky: { col: 14, row: 0 },
  pinky: { col: 14, row: 2 },
  inky: { col: 11, row: 2 },
  clyde: { col: 17, row: 2 },
};

export const SCATTER_CORNERS: Record<GhostName, Position> = {
  blinky: { col: 25, row: 0 },
  pinky: { col: 2, row: 0 },
  inky: { col: 27, row: 29 },
  clyde: { col: 3, row: 29 },
};

export function createGhost(name: GhostName): Ghost {
  const pos = GHOST_START_POSITIONS[name];
  return {
    name,
    pos,
    direction: 'none',
    mode: 'scatter',
    target: pos,
  };
}

export function createAllGhosts(): Record<GhostName, Ghost> {
  return {
    blinky: createGhost('blinky'),
    pinky: createGhost('pinky'),
    inky: createGhost('inky'),
    clyde: createGhost('clyde'),
  };
}
