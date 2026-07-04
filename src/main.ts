import { GameEngine } from './engine/Engine';
import { GameConfig } from './config/GameConfig';
import * as gameConstants from './config/gameConstants';

// Initialize config with defaults (all constants centralized)
const config = new GameConfig();
console.log('[config] initialized with', Object.keys(config.getAll()).length, 'constants');

// Verify constants are accessible
console.log('  player speed:', config.get('playerSpeedNormal'));
console.log('  ghost speed:', config.get('ghostSpeedNormal'));
console.log('  frightened duration (level 1):', gameConstants.getFrightenedDuration(1));

// Initialize the engine
const engine = new GameEngine();
engine.init();
engine.start();

console.log('\n[Pacman Clone] Game initialized successfully!');
