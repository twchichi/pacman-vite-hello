// ---- primitives ----

/** Grid-aligned 2D position. */
export interface Vector2 {
  x: number;
  y: number;
}

/** Cardinal direction for movement. */
export enum Direction {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
  None = -1,
}

/** A tile in the maze. */
export enum Tile {
  Empty = 0,
  Wall = 1,
  Pellet = 2,
  PowerPellet = 3,
}

// ---- game entities ----

export interface Position {
  grid: Vector2;
  pixel: Vector2;
}

export interface Entity {
  id: number;
  name: string;
  position: Position;
  direction: Direction;
  speed: number;
  alive: boolean;
}

// ---- game state ----

export enum GameState {
  Ready = 'ready',
  Playing = 'playing',
  Paused = 'paused',
  GameOver = 'gameover',
  LevelComplete = 'levelcomplete',
}

export interface Score {
  pellets: number;
  powerPellets: number;
  ghosts: number;
  total: number;
}

export interface LevelState {
  map: Tile[][];
  lives: number;
  score: Score;
  level: number;
  timeLeft: number;
}

export interface GameStateFull {
  status: GameState;
  level: LevelState;
}

// ---- input ----

export interface InputEvent {
  type: 'keydown' | 'keyup' | 'click' | 'touch';
  key?: string;
  direction?: Direction;
}

// ---- service contracts ----

export interface Config {
  tileSize: number;
  fps: number;
  mapWidth: number;
  mapHeight: number;
}
