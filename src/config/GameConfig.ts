import { Config } from '../types/types';
import * as gameConstants from './gameConstants';

/**
 * Placeholder for the configuration layer.
 *
 * Loads and provides default + user-overridden game configuration.
 */

const DEFAULTS: Config = {
  tileSize: 20,
  fps: 30,
  mapWidth: 21,
  mapHeight: 21,
  playerSpeedNormal: gameConstants.PLAYER_SPEED_NORMAL,
  playerSpeedFrightened: gameConstants.PLAYER_SPEED_FRIGHTENED,
  ghostSpeedNormal: gameConstants.GHOST_SPEED_NORMAL,
  ghostSpeedFrightened: gameConstants.GHOST_SPEED_FRIGHTENED,
  ghostSpeedModifiers: gameConstants.GHOST_SPEED_MODIFIER,
  frightenedDurationShort: gameConstants.FRIGHTENED_DURATION_SHORT,
  frightenedDurationMedium: gameConstants.FRIGHTENED_DURATION_MEDIUM,
  frightenedDurationLong: gameConstants.FRIGHTENED_DURATION_LONG,
  frightenedDurationMin: gameConstants.FRIGHTENED_DURATION_MIN,
  ghostEatScore: gameConstants.GHOST_EAT_SCORE,
  fruitScores: gameConstants.FRUIT_SCORES,
  modeSwitchIntervalsNormal: gameConstants.MODE_SWITCH_INTERVALS_NORMAL,
  modeSwitchIntervalsHard: gameConstants.MODE_SWITCH_INTERVALS_HARD,
  ghostReleaseDelay: gameConstants.GHOST_RELEASE_DELAY,
  totalPellets: gameConstants.TOTAL_PELLETS,
  totalPowerPellets: gameConstants.TOTAL_POWER_PELLETS,
  extraLifeScores: gameConstants.EXTRA_LIFE_SCORES,
  initialLives: gameConstants.INITIAL_LIVES,
  fruitSpawnTime: gameConstants.FRUIT_SPAWN_TIME,
  fruitSlots: gameConstants.FRUIT_SLOTS,
};

export class GameConfig {
  private config: Config;

  constructor(overrides?: Partial<Config>) {
    this.config = { ...DEFAULTS, ...overrides };
  }

  get(key: keyof Config): Config[keyof Config] {
    return this.config[key];
  }

  getAll(): Config {
    return { ...this.config };
  }

  set(overrides: Partial<Config>): void {
    this.config = { ...this.config, ...overrides };
  }
}
