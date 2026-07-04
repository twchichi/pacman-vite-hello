import { GameLoop, LoopOptions } from './Loop';
import { MapLoader, loadMap } from './MapLoader';
import { TileRenderer } from './TileRenderer';
import { Input } from './Input';
import { Player } from './Player';

export class GameEngine {
  private loop: GameLoop | null = null;
  private mapLoader: MapLoader | null = null;
  private renderer: TileRenderer | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private tileSize = 20;
  private input!: Input;
  private player!: Player;

  constructor(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx || null;
  }

  init(): void {
    if (!this.ctx) {
      console.log('[engine] initializing placeholder');
      return;
    }

    const map = loadMap();
    this.mapLoader = map;
    this.renderer = new TileRenderer(this.ctx, this.tileSize);

    // Create player and input
    this.player = new Player(23, 14, 1); // start at row 23, center column
    this.input = new Input((dir) => {
      // Handle direction changes from input
      this.handleDirectionChange(dir);
    });

    console.log(`[engine] loaded map: ${map.width}x${map.height}, player at (${this.player.pos.col}, ${this.player.pos.row})`);
  }

  start(): void {
    if (!this.ctx || !this.renderer) {
      this.startPlaceholder();
      return;
    }

    this.loop = new GameLoop({
      fps: 30,
      update: () => this.update(),
    });
    this.loop.start();
  }

  stop(): void {
    this.loop?.stop();
    this.input?.detachKeyboard();
    console.log('[engine] stopping');
  }

  private update(): void {
    if (!this.mapLoader || !this.renderer || !this.player) {
      return;
    }

    const map = this.mapLoader.getTiles();
    const width = this.mapLoader.width;
    const height = this.mapLoader.height;

    // Get direction from input
    const direction = this.input.getDirection();

    // Try to apply queued direction
    if (direction) {
      const nextCol = this.player.nextPos(direction).col;
      const nextRow = this.player.nextPos(direction).row;

      // Check bounds
      if (nextCol >= 0 && nextCol < width && nextRow >= 0 && nextRow < height) {
        const tile = map[nextRow][nextCol];
        if (tile !== 1) { // not a wall
          this.player.move(direction);
          this.input.clearQueue();
        }
      }
    }

    // Render
    this.renderer.renderMap(map, width, height);
    this.renderPlayer();
  }

  private handleDirectionChange(direction: import('./Input').Direction): void {
    // This is called when input detects a new direction
    // The actual movement happens in update()
    console.log(`[engine] direction changed to: ${direction}`);
  }

  private renderPlayer(): void {
    if (!this.ctx || !this.player || !this.renderer) {
      return;
    }

    const { col, row } = this.player.pos;
    const px = col * this.tileSize;
    const py = row * this.tileSize;

    this.ctx.fillStyle = '#ffff00'; // yellow for Pac-Man
    this.ctx.beginPath();
    this.ctx.arc(
      px + this.tileSize / 2,
      py + this.tileSize / 2,
      this.tileSize * 0.4,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  private startPlaceholder(): void {
    console.log('[engine] starting placeholder');
  }
}
