import type { Direction } from '../engine/Input';
import type { MapLoader } from '../engine/MapLoader';

const TILE_WALL = 1;

/**
 * Player entity — pixel-coordinate based movement.
 *
 * Position is stored in pixels; movement uses deltaTime * speed (px/s)
 * so motion is frame-rate independent. The player snaps to grid rows
 * when changing direction to keep the movement grid-aligned.
 *
 * Wall collision is checked via a MapLoader passed at construction.
 * The map's outer border (all 1s) naturally blocks the player from
 * leaving the maze area.
 *
 * Pure logic class — does not render.
 */
export class Player {
  public x: number;           // pixel x position
  public y: number;           // pixel y position
  public direction: Direction = 'none';
  public speed: number;       // pixels per second
  public isMoving: boolean = false;

  private map: MapLoader;
  private tileSize: number;

  /**
   * @param initialX  Start pixel x position
   * @param initialY  Start pixel y position
   * @param speed     Pixels moved per second
   * @param map       MapLoader instance for collision detection
   * @param tileSize  Tile size in pixels (for pixel-to-tile coordinate conversion)
   */
  constructor(initialX: number, initialY: number, speed: number, map: MapLoader, tileSize: number = 20) {
    this.x = initialX;
    this.y = initialY;
    this.speed = speed;
    this.map = map;
    this.tileSize = tileSize;
  }

  reset(x: number, y: number, speed?: number): void {
    this.x = x;
    this.y = y;
    if (speed !== undefined) this.speed = speed;
    this.direction = 'none';
    this.isMoving = false;
  }

  /**
   * Update position based on direction and deltaTime.
   * Returns true if the player actually moved.
   */
  move(direction: Direction, deltaTime: number): boolean {
    if (direction === 'none' || !this.isMoving) return false;

    const dx = this.deltaX(direction) * deltaTime;
    const dy = this.deltaY(direction) * deltaTime;
    const nextX = this.x + dx;
    const nextY = this.y + dy;

    if (this.canMove(direction, nextX, nextY)) {
      this.x = nextX;
      this.y = nextY;
      this.direction = direction;
      return true;
    }
    return false;
  }

  /**
   * Check if the player can move to the given pixel position.
   * Rejects positions that are out-of-bounds or on a wall tile.
   */
  canMove(direction: Direction, nextX?: number, nextY?: number): boolean {
    const checkX = nextX ?? this.x;
    const checkY = nextY ?? this.y;

    // Convert pixel position to tile coordinates
    const tileCol = Math.round(checkX / this.tileSize);
    const tileRow = Math.round(checkY / this.tileSize);

    // Check map boundaries
    if (tileCol < 0 || tileCol >= this.map.width ||
        tileRow < 0 || tileRow >= this.map.height) {
      return false;
    }

    // Check if the tile is a wall (tile code 1)
    const tile = this.map.getTile(tileCol, tileRow);
    return tile !== TILE_WALL;
  }

  /** Get the delta-x per second for the given direction. */
  private deltaX(direction: Direction): number {
    switch (direction) {
      case 'left':  return -this.speed;
      case 'right': return this.speed;
      default:      return 0;
    }
  }

  /** Get the delta-y per second for the given direction. */
  private deltaY(direction: Direction): number {
    switch (direction) {
      case 'up':    return -this.speed;
      case 'down':  return this.speed;
      default:      return 0;
    }
  }

  /**
   * Main update step. Calls move() if isMoving is true.
   * @returns true if the player moved during this tick.
   */
  update(deltaTime: number): boolean {
    return this.move(this.direction, deltaTime);
  }
}
