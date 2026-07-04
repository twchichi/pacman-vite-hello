/**
 * Placeholder for the game engine layer.
 *
 * The engine is responsible for the main game loop (update + step),
 * game state transitions, and coordinating between systems.
 */

export class GameEngine {
  private running = false;

  init(): void {
    console.log('[engine] initializing placeholder');
    // TODO: instantiate engine with config, register systems
  }

  start(): void {
    this.running = true;
    console.log('[engine] starting placeholder');
    // TODO: begin the update loop
  }

  stop(): void {
    this.running = false;
    console.log('[engine] stopping placeholder');
    // TODO: tear down the update loop
  }
}
