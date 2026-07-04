import type { Direction } from './Input';

export interface PlayerPos {
  /** Column index in the tile grid */
  col: number;
  /** Row index in the tile grid */
  row: number;
}

export interface PlayerState {
  pos: PlayerPos;
  direction: Direction | null;
}

/**
 * Player entity.
 *
 * Movement is grid-aligned: the player occupies one tile at a time.
 * When the player reaches the center of a tile, the queued direction
 * is checked against the map for a wall. If clear, the player turns
 * onto that new tile. Direction is also committed after each move.
 *
 * This is a pure logic class — it does not render.
 */
export class Player {
  public pos: PlayerPos;
  public direction: Direction | null = null;
  public speed: number; // tiles per update

  /**
   * @param initialRow Start row (column defaults to center)
   * @param initialCol Start col (defaults to map center)
   * @param speed Tiles moved per update tick
   */
  constructor(initialRow: number, initialCol?: number, speed: number = 1) {
    this.pos = { col: initialCol ?? Math.floor(14), row: initialRow };
    this.speed = speed;
  }

  reset(row: number, col?: number, speed: number = 1): void {
    this.pos = { col: col ?? Math.floor(14), row };
    this.direction = null;
    this.speed = speed;
  }

  /**
   * Update position based on direction. Returns true if a tile moved.
   * Does NOT check walls — caller must validate with map first.
   */
  move(step: Direction | null): PlayerPos {
    if (!step) return this.pos;

    this.direction = step;
    switch (step) {
      case 'up':    this.pos.row -= this.speed; break;
      case 'down':  this.pos.row += this.speed; break;
      case 'left':  this.pos.col -= this.speed; break;
      case 'right': this.pos.col += this.speed; break;
    }
    return this.pos;
  }

  /**
   * Check if the next tile in `direction` is passable (not a wall).
   * @param mapFn Function that returns tile type at (col, row). Returns 1 for wall.
   */
  canMove(mapFn: (col: number, row: number) => number, direction: Direction): boolean {
    const next = this.nextPos(direction);
    return mapFn(next.col, next.row) !== 1; // tile 1 = wall
  }

  /**
   * Compute next position if moving in the given direction.
   */
  nextPos(direction: Direction): PlayerPos {
    const next = { ...this.pos };
    switch (direction) {
      case 'up':    next.row -= this.speed; break;
      case 'down':  next.row += this.speed; break;
      case 'left':  next.col -= this.speed; break;
      case 'right': next.col += this.speed; break;
    }
    return next;
  }

  /**
   * Try to apply a queued direction: if the direction is valid
   * (not a wall), commit it. Otherwise discard the queue entry.
   * @returns true if the direction was accepted and player moved.
   */
  tryApplyDirection(mapFn: (col: number, row: number) => number, direction: Direction): boolean {
    if (this.canMove(mapFn, direction)) {
      this.move(direction);
      return true;
    }
    return false;
  }
}
