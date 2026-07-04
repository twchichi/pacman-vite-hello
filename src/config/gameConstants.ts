// src/config/gameConstants.ts

/**
 * Ghost movement speeds (tiles per second)
 */
export const GHOST_SPEED = 1;
export const GHOST_SCATTER_SPEED = 1;
export const GHOST_FRIGHTENED_SPEED = 0.5;

/**
 * Scatter/Chase mode durations (in seconds)
 * Classic Pac-Man timings
 */
export const CHASE_DURATIONS = [7, 30, 5, 20]; // [s1, s2, s3, s4]
export const SCATTER_DURATIONS = [20, 5, 30, 5]; // [s1, s2, s3, s4]

/**
 * Ghost starting positions (row, col)
 */
export const GHOST_START_POSITIONS = {
  blinky: { row: 0, col: 14 },
  pinky: { row: 2, col: 14 },
  inky: { row: 2, col: 11 },
  clyde: { row: 2, col: 17 },
};

/**
 * Scatter corner targets (row, col)
 * These are the corners of the map where ghosts retreat to during scatter mode
 */
export const SCATTER_CORNERS = {
  blinky: { row: 0, col: 25 },   // Top-right
  pinky: { row: 0, col: 2 },     // Top-left
  inky: { row: 29, col: 27 },    // Bottom-right
  clyde: { row: 29, col: 3 },    // Bottom-left
};

/**
 * Ghost house exit position
 */
export const GHOST_HOUSE_EXIT = { row: 14, col: 14 };

/**
 * Player starting position
 */
export const PLAYER_START = { row: 23, col: 13 };
