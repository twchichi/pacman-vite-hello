import mapData from '../data/map.json';

const TILE_WALL = 1;
const TILE_PELLET = 2;
const TILE_POWER_PELLET = 3;
const TILE_EMPTY = 0;

/**
 * Loads the classic 28x31 Pac-Man maze from a JSON data file.
 * The data file uses integer codes: 0=Empty, 1=Wall, 2=Pellet, 3=PowerPellet.
 */
export class MapLoader {
  public readonly width: number;
  public readonly height: number;
  public readonly tileCount: number;
  private readonly tiles: number[][];

  constructor(mapData: number[][]) {
    this.tiles = mapData;
    this.height = mapData.length;
    this.width = mapData[0]?.length ?? 0;
    this.tileCount = 0;
    for (let y = 0; y < this.height; y++) {
      this.tileCount += this.tiles[y].length;
    }
  }

  getTiles(): number[][] {
    return this.tiles;
  }

  getTile(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return TILE_WALL;
    }
    return this.tiles[y][x];
  }

  isValid(): boolean {
    if (this.width === 0 || this.height === 0) {
      return false;
    }
    for (let y = 0; y < this.height; y++) {
      if (this.tiles[y].length !== this.width) {
        return false;
      }
      for (let x = 0; x < this.width; x++) {
        const tile = this.tiles[y][x];
        if (tile < TILE_EMPTY || tile > TILE_POWER_PELLET) {
          return false;
        }
      }
    }
    return true;
  }

  getStatistics(): { walls: number; pellets: number; powerPellets: number; empties: number } {
    let walls = 0, pellets = 0, powerPellets = 0, empties = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        switch (this.tiles[y][x]) {
          case TILE_WALL: walls++; break;
          case TILE_PELLET: pellets++; break;
          case TILE_POWER_PELLET: powerPellets++; break;
          default: empties++;
        }
      }
    }
    return { walls, pellets, powerPellets, empties };
  }
}

export function loadMap(): MapLoader {
  const tiles = mapData as number[][];
  return new MapLoader(tiles);
}
