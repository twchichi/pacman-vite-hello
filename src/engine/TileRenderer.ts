const TILE_WALL = 1;
const TILE_PELLET = 2;
const TILE_POWER_PELLET = 3;
const TILE_EMPTY = 0;

export class TileRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private tileSize: number;

  constructor(ctx: CanvasRenderingContext2D, tileSize: number) {
    this.ctx = ctx;
    this.tileSize = tileSize;
  }

  setTileSize(size: number): void {
    this.tileSize = size;
  }

  renderMap(mapData: number[][], width: number, height: number): void {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, width * this.tileSize, height * this.tileSize);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = mapData[y][x];
        const px = x * this.tileSize;
        const py = y * this.tileSize;

        switch (tile) {
          case TILE_WALL:
            this.renderWall(px, py);
            break;
          case TILE_PELLET:
            this.renderPellet(px, py);
            break;
          case TILE_POWER_PELLET:
            this.renderPowerPellet(px, py);
            break;
        }
      }
    }
  }

  private renderWall(px: number, py: number): void {
    this.ctx.fillStyle = '#1a1aff';
    this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
  }

  private renderPellet(px: number, py: number): void {
    const centerX = px + this.tileSize / 2;
    const centerY = py + this.tileSize / 2;
    const radius = this.tileSize * 0.1;

    this.ctx.fillStyle = '#ffb8ae';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderPowerPellet(px: number, py: number): void {
    const centerX = px + this.tileSize / 2;
    const centerY = py + this.tileSize / 2;
    const radius = this.tileSize * 0.25;

    this.ctx.fillStyle = '#ffb8ae';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
