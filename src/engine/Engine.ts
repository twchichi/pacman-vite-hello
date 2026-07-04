import { GameLoop, LoopOptions } from './Loop';
import { MapLoader, loadMap } from './MapLoader';
import { TileRenderer } from './TileRenderer';

export class GameEngine {
  private loop: GameLoop | null = null;
  private mapLoader: MapLoader | null = null;
  private renderer: TileRenderer | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private tileSize = 20;

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
    console.log('[engine] stopping');
  }

  private update(): void {
    if (this.mapLoader && this.renderer) {
      const map = this.mapLoader.getTiles();
      this.renderer.renderMap(map, this.mapLoader.width, this.mapLoader.height);
    }
  }

  private startPlaceholder(): void {
    console.log('[engine] starting placeholder');
  }
}