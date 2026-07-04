import { Config } from '../types/types';

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
};

export class GameConfig {
  private config: Config;

  constructor(overrides?: Partial<Config>) {
    this.config = { ...DEFAULTS, ...overrides };
  }

  get(key: keyof Config): number {
    return this.config[key];
  }

  getAll(): Config {
    return { ...this.config };
  }

  set(overrides: Partial<Config>): void {
    this.config = { ...this.config, ...overrides };
  }
}
