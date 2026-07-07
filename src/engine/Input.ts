/**
 * Input layer: keyboard (WASD / Arrow keys) + swipe gesture (mobile).
 *
 * Emits direction changes through `onDirectionChange` callback.
 * Direction queue lets players queue a turn while still on current tile
 * so the turn executes at the next valid grid intersection.
 */

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export interface SwipeGesture {
  direction: Direction;
}

export class Input {
  private directionQueue: Direction[] = [];
  private currentDirection: Direction | null = null;
  private readonly onDirectionChange?: (direction: Direction) => void;

  constructor(onDirectionChange?: (direction: Direction) => void) {
    this.onDirectionChange = onDirectionChange;
  }

  /** Get the next queued direction, or current if no queue. */
  getDirection(): Direction | null {
    if (this.directionQueue.length > 0) {
      const dir = this.directionQueue[0];
      this.currentDirection = dir;
      return dir;
    }
    return this.currentDirection;
  }

  /** Clear pending direction queue. */
  clearQueue(): void {
    this.directionQueue = [];
  }

  /** Get the full queue (useful for debug/tests). */
  getQueue(): Direction[] {
    return [...this.directionQueue];
  }

  /** Register keyboard listeners on the document. */
  attachKeyboard(el: HTMLElement | Window = window): void {
    const onKey = (e: Event): void => {
      const keyboardEvent = e as KeyboardEvent;
      const dir = keyToDirection(keyboardEvent.key);
      if (!dir) return;
      keyboardEvent.preventDefault();
      this.setDirection(dir);
    };

    el.addEventListener('keydown', onKey);

    // Store reference so caller can detach later
    (el as any).__pacmanInputKeyHandler = onKey;
  }

  /** Remove keyboard listeners. */
  detachKeyboard(el: HTMLElement | Window = window): void {
    const handler = (el as any).__pacmanInputKeyHandler;
    if (handler) {
      el.removeEventListener('keydown', handler);
      delete (el as any).__pacmanInputKeyHandler;
    }
  }

  /** Register swipe gesture listeners on the given element. */
  attachSwipe(el: HTMLElement): void {
    const onTouchStart = (e: TouchEvent): void => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      (el as any).__pacmanTouchStartX = t.clientX;
      (el as any).__pacmanTouchStartY = t.clientY;
    };

    const onTouchEnd = (e: TouchEvent): void => {
      if (e.touches.length !== 0) return; // still touching
      const startX = (el as any).__pacmanTouchStartX;
      const startY = (el as any).__pacmanTouchStartY;
      if (startX === undefined || startY === undefined) return;

      // Get final touch position from changedTouches (finger lifted)
      const changed = e.changedTouches[0];
      const dx = changed.clientX - startX;
      const dy = changed.clientY - startY;

      const dir = detectSwipe(dx, dy);
      if (dir) {
        this.setDirection(dir);
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    // Store for cleanup
    (el as any).__pacmanInputTouchStart = onTouchStart;
    (el as any).__pacmanInputTouchEnd = onTouchEnd;
  }

  /** Remove swipe listeners. */
  detachSwipe(el: HTMLElement): void {
    if ((el as any).__pacmanInputTouchStart) {
      el.removeEventListener('touchstart', (el as any).__pacmanInputTouchStart);
      delete (el as any).__pacmanInputTouchStart;
    }
    if ((el as any).__pacmanInputTouchEnd) {
      el.removeEventListener('touchend', (el as any).__pacmanInputTouchEnd);
      delete (el as any).__pacmanInputTouchEnd;
    }
  }

  /** Set direction, queueing if player already moving. */
  setDirection(dir: Direction): void {
    // If moving in the same direction, no-op
    if (this.currentDirection === dir) return;

    // If queue is empty or last queued direction matches, replace
    if (this.directionQueue.length === 0 || this.directionQueue[this.directionQueue.length - 1] === dir) {
      this.directionQueue = [dir];
    } else {
      this.directionQueue.push(dir);
    }

    // Fire callback immediately for the first queued direction
    if (this.directionQueue.length === 1) {
      this.onDirectionChange?.(dir);
    }
  }

  /** Peek at the currently-active direction (not queued). */
  getCurrentDirection(): Direction | null {
    return this.currentDirection;
  }

  /** Commit the current direction (called after a tile move completes). */
  commitDirection(): void {
    this.onMoveComplete();
  }

  /** Notify the input system that the player completed a tile move.
   *  Advances the direction queue — the next queued direction becomes current.
   */
  onMoveComplete(): void {
    if (this.directionQueue.length > 0) {
      this.currentDirection = this.directionQueue.shift()!;
      this.onDirectionChange?.(this.currentDirection);
    }
  }

  /** Set direction without queuing (used by D-pad buttons). */
  setCurrentDirection(dir: Direction): void {
    this.currentDirection = dir;
    this.directionQueue = [];
  }
}

/** Convert a keyboard key to a direction. */
export function keyToDirection(key: string): Direction | null {
  switch (key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'up';
    case 'ArrowDown':
    case 's':
    case 'S':
      return 'down';
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'left';
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'right';
    default:
      return null;
  }
}

/**
 * Detect swipe direction from dx/dy displacement.
 * Minimum swipe distance in pixels (avoids accidental taps).
 */
const SWIPE_THRESHOLD = 20;

export function detectSwipe(dx: number, dy: number): Direction | null {
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx < SWIPE_THRESHOLD && absDy < SWIPE_THRESHOLD) {
    return null; // too short, treat as tap
  }

  if (absDx > absDy) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
}
