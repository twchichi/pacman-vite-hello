/**
 * Placeholder for the UI layer.
 *
 * Handles menus, HUD overlays, and game-state transitions
 * (title screen, game over, level complete, etc.).
 */

export enum Screen {
  Title = 'title',
  Game = 'game',
  Paused = 'paused',
  GameOver = 'gameover',
}

export class GameUI {
  private screen: Screen = Screen.Title;

  init(): void {
    this.screen = Screen.Title;
    console.log(`[ui] initialized on screen: ${this.screen}`);
  }

  show(screen: Screen): void {
    this.screen = screen;
    console.log(`[ui] showing screen: ${screen}`);
    // TODO: render appropriate screen content
  }

  getCurrentScreen(): Screen {
    return this.screen;
  }
}
