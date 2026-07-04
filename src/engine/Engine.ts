import { GameLoop, LoopOptions } from './Loop';
import { MapLoader, loadMap } from './MapLoader';
import { TileRenderer } from './TileRenderer';
import { Input } from './Input';
import { Player } from './Player';
const TILE_WALL = 1;
const TILE_PELLET = 2;
const TILE_POWER_PELLET = 3;
const TILE_EMPTY = 0;

export class GameEngine {
  private loop: GameLoop | null = null;
  private mapLoader: MapLoader | null = null;
  private renderer: TileRenderer | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private tileSize = 20;
  public input!: Input;
  private player!: Player;
  private pellets: Set<string> = new Set();
  private powerPellets: Set<string> = new Set();
  private score = 0;

  constructor(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx || null;
  }

  getScore(): number {
    return this.score;
  }

  getMapDimensions(): { width: number; height: number } {
    return {
      width: this.mapLoader?.width ?? 0,
      height: this.mapLoader?.height ?? 0,
    };
  }

  getCanvasElement(): HTMLCanvasElement | null {
    return document.getElementById('game') as HTMLCanvasElement;
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
    this.player = new Player(23, 13, 1); // start at row 23, col 13
    this.input = new Input((dir) => {
      this.handleDirectionChange(dir);
    });

    // Collect pellets and power pellets from the map
    this.collectPellets(map.getTiles());

    console.log(`[engine] loaded map: ${map.width}x${map.height}, player at (${this.player.pos.col}, ${this.player.pos.row})`);
  }

  private collectPellets(map: number[][]): void {
    this.pellets.clear();
    this.powerPellets.clear();
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const tile = map[row][col];
        if (tile === TILE_PELLET) {
          this.pellets.add(`${col},${row}`);
        } else if (tile === TILE_POWER_PELLET) {
          this.powerPellets.add(`${col},${row}`);
        }
      }
    }
  }

  private handleDirectionChange(direction: import('./Input').Direction): void {
    // Direction is already queued by input system
    console.log(`[engine] direction changed to: ${direction}`);
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
      const nextPos = this.player.nextPos(direction);
      const nextCol = nextPos.col;
      const nextRow = nextPos.row;

      // Check bounds
      if (nextCol >= 0 && nextCol < width && nextRow >= 0 && nextRow < height) {
        const tile = map[nextRow][nextCol];
        if (tile !== TILE_WALL) {
          this.player.move(direction);
          this.input.clearQueue();

          // Check for pellet consumption
          this.eatPellet(nextCol, nextRow, map);
        }
      }
    }

    // Render
    this.renderer.renderMap(map, width, height);
    this.renderPlayer();
  }

  private eatPellet(col: number, row: number, map: number[][]): void {
    const key = `${col},${row}`;

    // Check power pellet
    if (this.powerPellets.has(key)) {
      this.powerPellets.delete(key);
      this.score += 50;
      // Update map to remove the power pellet
      map[row][col] = TILE_EMPTY;
      console.log(`[engine] ate power pellet at (${col},${row}), score: ${this.score}`);
      return;
    }

    // Check regular pellet
    if (this.pellets.has(key)) {
      this.pellets.delete(key);
      this.score += 10;
      // Update map to remove the pellet
      map[row][col] = TILE_EMPTY;
      console.log(`[engine] ate pellet at (${col},${row}), score: ${this.score}`);
    }
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
