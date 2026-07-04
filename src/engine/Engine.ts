import { Config } from '../types/types';
import * as gameConstants from '../config/gameConstants';

/**
 * Placeholder for the game engine layer.
 *
 * The engine is responsible for the main game loop (update + step),
 * game state transitions, and coordinating between systems.
 *
 * All speed / timing values come from gameConstants.ts — never hardcode.
 */

export class GameEngine {
  private running = false;
  private config: Config | null = null;

  init(config?: Config): void {
    this.config = config ?? this.loadDefaults();
    console.log('[engine] initialized with fps:', this.config.fps);
    // TODO: instantiate engine with config, register systems
  }

  private loadDefaults(): Config {
    // Reuse the same DEFAULTS object so config + engine share one source of truth.
    const defaults: Config = {
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
    return defaults;
  }

  start(): void {
    if (!this.config) {
      throw new Error('[engine] init() must be called before start()');
    }
    this.running = true;
    console.log('[engine] starting placeholder (fps:', this.config.fps, ')');
    // TODO: begin the update loop
  }

  stop(): void {
    this.running = false;
    console.log('[engine] stopping placeholder');
    // TODO: tear down the update loop
  }
}
