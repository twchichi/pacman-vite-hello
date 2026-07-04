import { Direction, InputEvent } from '../types/types';

/**
 * Placeholder for the input handling layer.
 *
 * The input manager listens for keyboard/mouse/touch events
 * and translates them into game-direction commands.
 */

export interface InputListener {
  onDirection(dir: Direction): void;
  onPause(): void;
  onRestart(): void;
}

export class InputManager {
  private listener: InputListener | null = null;
  private active: Direction = Direction.None;

  init(listener: InputListener): void {
    this.listener = listener;
    console.log('[input] initialized with listener');
    // TODO: attach event listeners to document/window
  }

  handle(_event: InputEvent): void {
    // TODO: translate event into direction / action
  }

  destroy(): void {
    console.log('[input] destroyed');
    // TODO: detach event listeners
  }
}
