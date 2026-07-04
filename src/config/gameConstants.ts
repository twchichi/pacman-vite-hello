// =============================================================================
// gameConstants.ts
// Centralized game speed / timing constants — no magic numbers scattered around.
//
// Values follow the classic 1980 Namco System 1 (MS PAC-MAN) spec where noted.
// All speeds are in tiles/sec; all durations are in milliseconds unless noted.
// =============================================================================

// --- Player ---

/** Player speed (tiles/sec) during normal movement. */
export const PLAYER_SPEED_NORMAL: number = 8.0;

/** Player speed (tiles/sec) when frightened (after eating power pellet). */
export const PLAYER_SPEED_FRIGHTENED: number = 3.5;

/** Player dot-eaten sound interval (ms). */
export const PLAYER_DOT_SOUND_INTERVAL: number = 120;

// --- Ghost speeds (tiles/sec) ---

/** Base speed (tiles/sec) for all ghosts during normal chase / scatter mode. */
export const GHOST_SPEED_NORMAL: number = 8.0;

/** Base speed (tiles/sec) for all ghosts during frightened mode. */
export const GHOST_SPEED_FRIGHTENED: number = 3.0;

/** Individual ghost speed modifiers (multipliers on GHOST_SPEED_NORMAL).
 *  Inky & Clyde are slightly slower than Blinky & Pinky in classic.
 */
export const GHOST_SPEED_MODIFIER: Record<string, number> = {
  BLINKY: 1.0,   // Shadow — full speed
  PINKY: 1.0,    // Speedy — full speed
  INKY: 0.875,   // Bashful — slightly slower
  CLYDE: 0.875,  // Pokey — slightly slower
};

// --- Ghost frightened mode ---

/** Base frightened duration (ms) for levels 1–2. */
export const FRIGHTENED_DURATION_SHORT: number = 7000;

/** Frightened duration (ms) for levels 3–6. */
export const FRIGHTENED_DURATION_MEDIUM: number = 5000;

/** Base frightened duration (ms) for levels 7+. */
export const FRIGHTENED_DURATION_LONG: number = 20000;

/** Minimum frightened duration (ms) — cap so a round never ends before all ghosts are eaten. */
export const FRIGHTENED_DURATION_MIN: number = 1200;

// --- Ghost eat score ---

/** Points awarded for eating each frightened ghost in order (first, second, third, fourth). */
export const GHOST_EAT_SCORE: number[] = [200, 400, 800, 1600];

// --- Scatter / Chase mode cycle ---

/**
 * Scatter/chase mode durations (seconds) for levels 1–6.
 * Pattern: Scatter → Chase → Scatter → Chase → ...
 * After level 6 the pattern shortens to 5s / 7s alternating.
 *
 * Source: Namco System 1 hardware spec (commonly cited from Pac-Man World Review).
 */
export const MODE_SWITCH_INTERVALS_NORMAL: number[] = [7, 20, 7, 20, 5, 20, 5, 20];

/**
 * Scatter/chase mode durations (seconds) for levels 7+.
 * Alternating 5s scatter / 7s chase.
 */
export const MODE_SWITCH_INTERVALS_HARD: number[] = [5, 7];

// --- Ghost house ---

/** Time (ms) a ghost waits in the ghost house before being released, per ghost.
 *  First ghost: 0ms (immediate), then 3000ms, 5000ms, 7000ms.
 */
export const GHOST_RELEASE_DELAY: number[] = [0, 3000, 5000, 7000];

/** Number of ghosts released per fruit/level-up event. */
export const GHOSTS_RELEASED_PER_FRUIT: number = 1;

// --- Fruit ---

/** Time (ms) after game start when the first fruit appears. */
export const FRUIT_SPAWN_TIME: number = 7000;

/** Fruit score values by index (cherry, strawberry, orange, apple, melon, etc.). */
export const FRUIT_SCORES: number[] = [100, 300, 500, 700, 1000, 2000, 5000];

/** Number of fruit slots available on the board at any time. */
export const FRUIT_SLOTS: number = 2;

// --- Level ---

/** Number of dots/pellets needed to complete a level (excluding power pellets). */
export const TOTAL_PELLETS: number = 244;

/** Number of power pellets in the maze. */
export const TOTAL_POWER_PELLETS: number = 4;

/** Extra lives threshold (points) — classic awards at 10000, 30000, 50000. */
export const EXTRA_LIFE_SCORES: number[] = [10000, 30000, 50000];

/** Starting lives per game. */
export const INITIAL_LIVES: number = 3;

// --- Timing helpers ---

/** Frame duration (ms) at target FPS. */
export const FRAME_DURATION_MS = (fps: number): number => Math.floor(1000 / fps);

/** Frightened duration (ms) for a given level. */
export const getFrightenedDuration = (level: number): number => {
  if (level < 3) return FRIGHTENED_DURATION_SHORT;
  if (level < 7) return FRIGHTENED_DURATION_MEDIUM;
  return FRIGHTENED_DURATION_LONG;
};

/** Mode switch interval (seconds) for a given level. */
export const getModeSwitchInterval = (level: number, modeIndex: number): number => {
  if (level >= 7) {
    return MODE_SWITCH_INTERVALS_HARD[modeIndex % MODE_SWITCH_INTERVALS_HARD.length];
  }
  return MODE_SWITCH_INTERVALS_NORMAL[modeIndex % MODE_SWITCH_INTERVALS_NORMAL.length];
};

/** Current ghost speed (tiles/sec) for a named ghost in the given mode. */
export const getGhostSpeed = (ghostName: string, frightened: boolean): number => {
  const base = frightened ? GHOST_SPEED_FRIGHTENED : GHOST_SPEED_NORMAL;
  const modifier = GHOST_SPEED_MODIFIER[ghostName.toUpperCase()] ?? 1.0;
  return base * modifier;
};
