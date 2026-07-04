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

// ---- config ----

/**
 * Centralized game constants.
 *
 * All speed / timing / scoring values live here. Engine, input, renderer,
 * and service code read from this object — never hardcode magic numbers.
 */
export interface Config {
  // --- rendering ---
  tileSize: number;
  fps: number;
  mapWidth: number;
  mapHeight: number;

  // --- player ---
  playerSpeedNormal: number;
  playerSpeedFrightened: number;

  // --- ghosts ---
  ghostSpeedNormal: number;
  ghostSpeedFrightened: number;
  ghostSpeedModifiers: Record<string, number>;

  // --- frightened mode ---
  frightenedDurationShort: number;
  frightenedDurationMedium: number;
  frightenedDurationLong: number;
  frightenedDurationMin: number;

  // --- scoring ---
  ghostEatScore: number[];
  fruitScores: number[];

  // --- scatter/chase ---
  modeSwitchIntervalsNormal: number[];
  modeSwitchIntervalsHard: number[];

  // --- ghost house ---
  ghostReleaseDelay: number[];

  // --- level ---
  totalPellets: number;
  totalPowerPellets: number;
  extraLifeScores: number[];
  initialLives: number;

  // --- fruit ---
  fruitSpawnTime: number;
  fruitSlots: number;
}

/**
 * Reads a named constant from the Config.
 * This is the single entry-point — changing a constant means editing one place.
 */
export type ConfigKey = keyof Config;
export type ConfigValue = Config[ConfigKey];
