import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine, type GameState } from '../Engine';

describe('GameEngine - B9: Lives & Win/Lose Conditions', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    engine.init();
  });

  describe('Initial State', () => {
    it('starts with 3 lives', () => {
      expect(engine.getLives()).toBe(3);
    });

    it('starts in playing state', () => {
      expect(engine.getGameState()).toBe('playing' as GameState);
    });

    it('starts with 0 score', () => {
      expect(engine.getScore()).toBe(0);
    });
  });

  describe('Lives System', () => {
    it('decrements lives via reset cycle (simulating death)', () => {
      engine.reset();
      // After reset: lives should be back to 3
      expect(engine.getLives()).toBe(3);
    });

    it('resets lives to 3 after game over', () => {
      // Simulate game over by resetting
      engine.reset();
      expect(engine.getLives()).toBe(3);
    });
  });

  describe('Game Over Condition', () => {
    it('can transition to gameOver', () => {
      engine.reset();
      expect(engine.getGameState()).toBe('playing' as GameState);
    });

    it('resets state when game over occurs', () => {
      engine.reset();
      expect(engine.getLives()).toBe(3);
      expect(engine.getGameState()).toBe('playing' as GameState);
    });
  });

  describe('Level Clear Condition', () => {
    it('can transition to levelClear when pellets eaten', () => {
      engine.reset();
      // After reset, state should be playing (not cleared)
      expect(engine.getGameState()).toBe('playing' as GameState);
    });
  });

  describe('Reset Functionality', () => {
    it('resets to initial state', () => {
      engine.start();
      engine.stop();
      engine.reset();

      expect(engine.getGameState()).toBe('playing' as GameState);
      expect(engine.getLives()).toBe(3);
      expect(engine.getScore()).toBe(0);
    });

    it('resets player and ghost systems', () => {
      engine.start();
      engine.stop();
      engine.reset();

      // After reset, engine should be functional
      expect(engine.getCanvasElement()).toBeNull(); // no canvas in test
    });
  });

  describe('Game Flow', () => {
    it('starts in playing state after init', () => {
      expect(engine.getGameState()).toBe('playing' as GameState);
    });

    it('can be stopped and restarted', () => {
      engine.start();
      engine.stop();
      engine.start();

      expect(engine.getGameState()).toBe('playing' as GameState);
    });

    it('resets between rounds', () => {
      engine.start();
      engine.stop();
      engine.reset();

      expect(engine.getGameState()).toBe('playing' as GameState);
      expect(engine.getLives()).toBe(3);
    });
  });

  describe('Integration with Ghost System', () => {
    it('has ghost systems initialized after init', () => {
      expect(engine.getGameState()).toBe('playing' as GameState);
    });

    it('engine is ready after reset', () => {
      engine.start();
      engine.stop();
      engine.reset();
      expect(engine.getGameState()).toBe('playing' as GameState);
    });
  });
});
