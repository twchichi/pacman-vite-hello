import { GameLoop, LoopOptions } from './Loop';
import { MapLoader, loadMap } from './MapLoader';
import { TileRenderer } from './TileRenderer';
import { ResizeManager } from './ResizeManager';

export class GameEngine {
  private loop: GameLoop | null = null;
  private mapLoader: MapLoader | null = null;
  private renderer: TileRenderer | null = null;
  private resizeManager: ResizeManager | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private container: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private tileSize = 20;

  constructor(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx || null;
  }

  init(canvas: HTMLCanvasElement, container: HTMLElement): void {
    if (!this.ctx) {
      console.log('[engine] initializing placeholder');
      return;
    }

    this.canvas = canvas;
    this.container = container;

    // Setup resize manager
    this.resizeManager = new ResizeManager(canvas, container, () => {
      this.handleResize();
    });

    // Load map and initialize renderer
    const map = loadMap();
    this.mapLoader = map;
    this.renderer = new TileRenderer(this.ctx, this.tileSize);

    console.log(`[engine] loaded map: ${map.width}x${map.height}`);
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
    this.resizeManager?.dispose();
    console.log('[engine] stopping');
  }

  private update(): void {
    if (this.mapLoader && this.renderer) {
      const map = this.mapLoader.getTiles();
      this.renderer.renderMap(map, this.mapLoader.width, this.mapLoader.height);
    }
  }

  private handleResize(): void {
    // Recalculate tile size based on current canvas dimensions
    if (this.canvas && this.renderer && this.mapLoader) {
      const canvasWidth = this.canvas.clientWidth;
      const canvasHeight = this.canvas.clientHeight;
      const mapWidth = this.mapLoader.width;
      const mapHeight = this.mapLoader.height;

      const tileSizeX = canvasWidth / mapWidth;
      const tileSizeY = canvasHeight / mapHeight;
      const newTileSize = Math.floor(Math.min(tileSizeX, tileSizeY));

      this.renderer.setTileSize(newTileSize);
    }
  }

  private startPlaceholder(): void {
    console.log('[engine] starting placeholder');
  }
}
