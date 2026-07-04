const TILE_WALL = 1;
const TILE_PELLET = 2;
const TILE_POWER_PELLET = 3;

export class TileRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private tileSize: number;

  constructor(ctx: CanvasRenderingContext2D, tileSize: number) {
    this.ctx = ctx;
    this.tileSize = tileSize;
  }

  public setTileSize(size: number) {
    this.tileSize = size;
  }

  public clear(width: number, height: number) {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, width * this.tileSize, height * this.tileSize);
  }

  public renderMap(mapData: number[][], width: number, height: number) {
    this.clear(width, height);
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

  private renderWall(px: number, py: number) {
    this.ctx.fillStyle = '#0000FF';
    this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
  }

  private renderPellet(px: number, py: number) {
    this.ctx.fillStyle = '#FFFFCC';
    const centerX = px + this.tileSize / 2;
    const centerY = py + this.tileSize / 2;
    const radius = this.tileSize * 0.1;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderPowerPellet(px: number, py: number) {
    this.ctx.fillStyle = '#FFFFCC';
    const centerX = px + this.tileSize / 2;
    const centerY = py + this.tileSize / 2;
    const radius = this.tileSize * 0.25;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}