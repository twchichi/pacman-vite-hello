import { Position } from './GhostTypes';

/**
 * PathFinder: BFS pathfinding through the Pac-Man maze.
 * 
 * Handles:
 * - Wall collision detection (can't pass through walls)
 * - Tunnel wrapping (col wraps at 0-27)
 * - Returns shortest path from start to target position
 */

export class PathFinder {
  private map: number[][];
  private width: number;
  private height: number;
  
  // Tile constants
  private readonly TILE_WALL = 1;
  private readonly TILE_PELLET = 2;
  private readonly TILE_POWER_PELLET = 3;
  private readonly TILE_EMPTY = 0;

  // Direction vectors: [col_change, row_change]
  private readonly directions: Array<{ col: number; row: number }> = [
    { col: 0, row: -1 }, // up
    { col: 0, row: 1 },  // down
    { col: -1, row: 0 }, // left
    { col: 1, row: 0 },  // right
  ];

  constructor(map: number[][]) {
    this.map = map;
    this.height = map.length;
    this.width = map[0]?.length ?? 0;
  }

  /**
   * Find shortest path from start to target using BFS.
   * @param start - Starting position
   * @param target - Target position
   * @returns Array of positions from start to target (inclusive)
   */
  findPath(start: Position, target: Position): Position[] {
    if (!this.isValidPosition(start) || !this.isValidPosition(target)) {
      return [];
    }

    // Quick check: if already at target
    if (start.col === target.col && start.row === target.row) {
      return [start];
    }

    // BFS
    const visited: Map<string, boolean> = new Map();
    const queue: Array<{ pos: Position; path: Position[] }> = [];
    
    // Start BFS
    const startPos = this.wrapPosition(start);
    queue.push({ pos: startPos, path: [startPos] });
    visited.set(this.posKey(startPos), true);

    while (queue.length > 0) {
      const { pos, path } = queue.shift()!;

      // Try all 4 directions
      for (const dir of this.directions) {
        const nextCol = pos.col + dir.col;
        const nextRow = pos.row + dir.row;
        const nextPos = { col: nextCol, row: nextRow };

        // Wrap columns (tunnel)
        nextPos.col = ((nextPos.col % this.width) + this.width) % this.width;

        // Check bounds and walls
        if (this.canMoveTo(nextPos)) {
          const key = this.posKey(nextPos);
          if (!visited.has(key)) {
            const newPath = [...path, nextPos];
            
            // Check if we reached the target
            if (nextPos.col === target.col && nextPos.row === target.row) {
              return newPath;
            }

            visited.set(key, true);
            queue.push({ pos: nextPos, path: newPath });
          }
        }
      }
    }

    // No path found - return empty array
    return [];
  }

  /**
   * Check if position is valid (within map bounds after wrapping)
   */
  private isValidPosition(pos: Position): boolean {
    if (pos.col < 0 || pos.col >= this.width || pos.row < 0 || pos.row >= this.height) {
      return false;
    }
    return true;
  }

  /**
   * Check if we can move to a position (not a wall)
   */
  private canMoveTo(pos: Position): boolean {
    if (pos.col < 0 || pos.col >= this.width || pos.row < 0 || pos.row >= this.height) {
      return false;
    }
    
    const tile = this.map[pos.row]?.[pos.col];
    // Can't walk through walls (tile 1)
    return tile !== this.TILE_WALL;
  }

  /**
   * Wrap position to handle tunnel wrapping
   */
  private wrapPosition(pos: Position): Position {
    return {
      col: ((pos.col % this.width) + this.width) % this.width,
      row: ((pos.row % this.height) + this.height) % this.height,
    };
  }

  /**
   * Create unique key for position (used for visited set)
   */
  private posKey(pos: Position): string {
    return `${pos.col},${pos.row}`;
  }
}

/**
 * Move a ghost one step toward the target.
 * @param ghostPos - Current ghost position
 * @param target - Target position
 * @param pathFinder - PathFinder instance
 * @returns Next position for the ghost
 */
export function moveGhost(
  ghostPos: Position,
  target: Position,
  pathFinder: PathFinder
): Position {
  const path = pathFinder.findPath(ghostPos, target);
  
  if (path.length === 0) {
    // No path found, stay in place
    return ghostPos;
  }
  
  if (path.length === 1) {
    // Already at target
    return ghostPos;
  }
  
  // Return the next position in the path
  return path[1];
}