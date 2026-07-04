import { describe, it, expect, beforeAll } from 'vitest';
import { MapLoader } from '../MapLoader';
import mapData from '../../data/map.json';

describe('MapLoader', () => {
  let loader: MapLoader;

  beforeAll(() => {
    loader = new MapLoader(mapData as number[][]);
  });

  describe('dimensions', () => {
    it('should have width of 28', () => {
      expect(loader.width).toBe(28);
    });

    it('should have height of 31', () => {
      expect(loader.height).toBe(31);
    });

    it('should be valid', () => {
      expect(loader.isValid()).toBe(true);
    });
  });

  describe('data integrity', () => {
    it('should load exactly 60 pellets', () => {
      const stats = loader.getStatistics();
      expect(stats.pellets).toBe(60);
    });

    it('should load exactly 1 power pellet', () => {
      const stats = loader.getStatistics();
      expect(stats.powerPellets).toBe(1);
    });

    it('should load exactly 456 walls', () => {
      const stats = loader.getStatistics();
      expect(stats.walls).toBe(456);
    });

    it('should have correct total tile count', () => {
      const stats = loader.getStatistics();
      expect(stats.walls + stats.pellets + stats.powerPellets + stats.empties).toBe(28 * 31);
    });
  });

  describe('getTile', () => {
    it('should return Wall for out-of-bounds coordinates', () => {
      expect(loader.getTile(-1, -1)).toBe(1); // Wall = 1
      expect(loader.getTile(28, 0)).toBe(1);
      expect(loader.getTile(0, 31)).toBe(1);
    });

    it('should return the correct tile at specific coordinates', () => {
      // Top-left corner should be Wall
      expect(loader.getTile(0, 0)).toBe(1);

      // Specific pellet position (1,1) should be Pellet
      expect(loader.getTile(1, 1)).toBe(2);

      // Specific power pellet position (13,13) should be PowerPellet
      expect(loader.getTile(13, 13)).toBe(3);
    });

    it('should match the original data', () => {
      for (let y = 0; y < 31; y++) {
        for (let x = 0; x < 28; x++) {
          expect(loader.getTile(x, y)).toBe((mapData as number[][])[y][x]);
        }
      }
    });
  });

  describe('getTiles', () => {
    it('should return a 2D array', () => {
      const tiles = loader.getTiles();
      expect(Array.isArray(tiles)).toBe(true);
      expect(tiles.length).toBe(31);
      expect(tiles[0].length).toBe(28);
    });

    it('should match the original data', () => {
      const tiles = loader.getTiles();
      for (let y = 0; y < 31; y++) {
        expect(tiles[y]).toEqual((mapData as number[][])[y]);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle invalid tile values', () => {
      const invalidMap = [
        [0, 1, 5], // 5 is invalid
      ];
      const badLoader = new MapLoader(invalidMap);
      expect(badLoader.isValid()).toBe(false);
    });

    it('should handle uneven rows', () => {
      const unevenMap = [
        [0, 1, 2],
        [0, 1], // Different length
      ];
      const badLoader = new MapLoader(unevenMap);
      expect(badLoader.isValid()).toBe(false);
    });

    it('should handle wrong dimensions', () => {
      const wrongSize = [
        [0, 1, 2, 3],
      ];
      const badLoader = new MapLoader(wrongSize);
      expect(badLoader.isValid()).toBe(false);
    });
  });
});
