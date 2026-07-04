import { GameEngine } from './engine/Engine';
import { GameRenderer, RenderTarget } from './render/Renderer';
import { InputManager, InputListener } from './input/InputManager';
import { ServiceLocator } from './services/ServiceLocator';
import { GameConfig } from './config/GameConfig';
import { GameUI, Screen } from './ui/UI';

// Initialize the service locator
const services = ServiceLocator.get();

// Initialize config
const config = new GameConfig({
  tileSize: 20,
  fps: 30,
  mapWidth: 21,
  mapHeight: 21,
});
services.register('config', config);
console.log('[config] initialized:', config.getAll());

// Initialize the engine
const engine = new GameEngine();
services.register('engine', engine);

// Initialize the renderer with a render target
const renderer = new GameRenderer();
const renderTarget: RenderTarget = {
  clear: () => console.log('[renderer] clearing'),
  drawTile: (_x: number, _y: number, _tile: number, _size: number) => {},
  drawEntity: (_entity: { x: number; y: number; size: number; color: string }) => {},
  drawText: (_text: string, _x: number, _y: number, _size: number, _color: string) => {},
};
renderer.init(renderTarget);
services.register('renderer', renderer);

// Initialize the input manager with a listener
const inputManager = new InputManager();
const inputListener: InputListener = {
  onDirection: (dir: number) => console.log(`[input] direction: ${dir}`),
  onPause: () => console.log('[input] paused'),
  onRestart: () => console.log('[input] restarted'),
};
inputManager.init(inputListener);
services.register('input', inputManager);

// Initialize the UI
const ui = new GameUI();
ui.init();
services.register('ui', ui);

// Wire everything up
engine.init();
inputManager.init(inputListener);

// Start the game
engine.start();
ui.show(Screen.Title);

console.log('\n[Pacman Clone] Game initialized successfully!');
