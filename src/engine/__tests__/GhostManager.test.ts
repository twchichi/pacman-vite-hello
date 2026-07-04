import { describe, it, expect, vi } from 'vitest';
import { GhostManager } from '../GhostManager';
import { FRIGHTENED_DURATION_SECONDS } from '../../config/frightenedConstants';

describe('GhostManager', () => {
  describe('initial state', () => {
    it('should start with frightened mode inactive', () => {
      const manager = new GhostManager();
      expect(manager.isFrightenedActive()).toBe(false);
    });

    it('should start with zero remaining time', () => {
      const manager = new GhostManager();
      expect(manager.getRemainingTime()).toBe(0);
    });
  });

  describe('activateFrightenedMode', () => {
    it('should return the full frightened duration', () => {
      const manager = new GhostManager();
      const duration = manager.activateFrightenedMode();
      expect(duration).toBe(FRIGHTENED_DURATION_SECONDS);
    });

    it('should mark frightened mode as active', () => {
      const manager = new GhostManager();
      manager.activateFrightenedMode();
      expect(manager.isFrightenedActive()).toBe(true);
    });

    it('should set remaining time to full duration', () => {
      const manager = new GhostManager();
      manager.activateFrightenedMode();
      expect(manager.getRemainingTime()).toBe(FRIGHTENED_DURATION_SECONDS);
    });
  });

  describe('updateFrightenedTimer', () => {
    it('should return false when not active', () => {
      const manager = new GhostManager();
      const result = manager.updateFrightenedTimer(1);
      expect(result).toBe(false);
    });

    it('should decrement timer and return false when still positive', () => {
      const manager = new GhostManager();
      manager.activateFrightenedMode();
      const result = manager.updateFrightenedTimer(0.5);
      expect(result).toBe(false);
      expect(manager.getRemainingTime()).toBeLessThan(FRIGHTENED_DURATION_SECONDS);
    });

    it('should expire and return true when timer reaches zero', () => {
      const expiredCallback = vi.fn();
      const manager = new GhostManager(expiredCallback);
      manager.activateFrightenedMode();

      // Call updateFrightenedTimer with a value larger than the remaining time
      // to force expiry
      const result = manager.updateFrightenedTimer(FRIGHTENED_DURATION_SECONDS * 2);

      expect(result).toBe(true);
      expect(manager.isFrightenedActive()).toBe(false);
      expect(manager.getRemainingTime()).toBe(0);
      expect(expiredCallback).toHaveBeenCalled();
    });

    it('should not expire when timer is still positive', () => {
      const expiredCallback = vi.fn();
      const manager = new GhostManager(expiredCallback);
      manager.activateFrightenedMode();

      const result = manager.updateFrightenedTimer(0.5);
      expect(result).toBe(false);
      expect(manager.isFrightenedActive()).toBe(true);
      expect(expiredCallback).not.toHaveBeenCalled();
    });
  });

  describe('getRemainingTime', () => {
    it('should clamp to zero for negative values', () => {
      const manager = new GhostManager();
      // Trigger expiry by calling updateFrightenedTimer with a large value
      manager.activateFrightenedMode();
      manager.updateFrightenedTimer(FRIGHTENED_DURATION_SECONDS * 2);
      expect(manager.getRemainingTime()).toBe(0);
    });

    it('should return positive value when active', () => {
      const manager = new GhostManager();
      manager.activateFrightenedMode();
      expect(manager.getRemainingTime()).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('should clear all state', () => {
      const manager = new GhostManager();
      manager.activateFrightenedMode();
      // Trigger expiry
      manager.updateFrightenedTimer(FRIGHTENED_DURATION_SECONDS * 2);
      manager.reset();

      expect(manager.isFrightenedActive()).toBe(false);
      expect(manager.getRemainingTime()).toBe(0);
    });

    it('should allow re-activation after reset', () => {
      const manager = new GhostManager();
      manager.activateFrightenedMode();
      // Trigger expiry
      manager.updateFrightenedTimer(FRIGHTENED_DURATION_SECONDS * 2);
      manager.reset();
      manager.activateFrightenedMode();

      expect(manager.isFrightenedActive()).toBe(true);
      expect(manager.getRemainingTime()).toBe(FRIGHTENED_DURATION_SECONDS);
    });
  });
});
