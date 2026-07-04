/**
 * Placeholder for the rendering layer.
 *
 * The renderer is responsible for drawing game state to the canvas.
 * It will receive a GameState snapshot and render frames at the configured FPS.
 */

export interface RenderTarget {
  clear(): void;
  drawTile(x: number, y: number, tile: number, size: number): void;
  drawEntity(entity: { x: number; y: number; size: number; color: string }): void;
  drawText(text: string, x: number, y: number, size: number, color: string): void;
}

export class GameRenderer {
  private target: RenderTarget | null = null;

  init(target: RenderTarget): void {
    this.target = target;
    console.log('[renderer] initialized with render target');
  }

  render(_state: unknown): void {
    // TODO: implement actual rendering logic
  }

  resize(_width: number, _height: number): void {
    // TODO: handle canvas resize
  }
}
