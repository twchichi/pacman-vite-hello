/**
 * Frightened mode scoring constants.
 *
 * Classic Pac-Man combo scoring:
 *   1st ghost: 200
 *   2nd ghost: 400
 *   3rd ghost: 800
 *   4th ghost: 1600
 *
 * After 4 consecutive eats, score stays at 3200.
 */
export const BASE_FRIGHTENED_SCORE = 200;
export const COMBO_MULTIPLIER = 2;
export const EYES_SCORE = 100;

/**
 * Max consecutive frightened-ghost eats before score caps out.
 */
export const MAX_COMBO = 4;

/**
 * Duration of frightened mode in seconds.
 * Classic Pac-Man: 6s for first 2 rounds, then 5s for remaining.
 * Simplified to 6s for all.
 */
export const FRIGHTENED_DURATION_SECONDS = 6;
