/**
 * Input layer: keyboard (WASD / Arrow keys) + swipe gesture (mobile).
 * Emits direction changes through `onDirectionChange` callback.
 * Direction queue lets players queue a turn while still on current tile.
 */

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export interface SwipeGesture {
  direction: Direction;
}

export class Input {
  private directionQueue: Direction[] = [];
  private currentDirection: Direction | null = null;
  public readonly onDirectionChange?: (direction: Direction) => void;

  constructor(onDirectionChange?: (direction: Direction) => void) {
    this.onDirectionChange = onDirectionChange;
  }

  /** Get the next queued direction, or current if no queue. */
  getDirection(): Direction | null {
    if (this.directionQueue.length > 0) {
      return this.directionQueue[0];
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
      keyboardEvent.stopPropagation();
      this.currentDirection = dir;
      this.directionQueue = [dir];
      this.onDirectionChange?.(dir);
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
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent): void => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    };

    const onTouchEnd = (e: TouchEvent): void => {
      if (e.changedTouches.length === 0) return;
      const changed = e.changedTouches[0];
      const dx = changed.clientX - startX;
      const dy = changed.clientY - startY;

      const dir = detectSwipe(dx, dy);
      if (dir) {
        this.currentDirection = dir;
        this.directionQueue = [dir];
        this.onDirectionChange?.(dir);
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

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
    this.currentDirection = dir;
    if (this.directionQueue.length === 0 || this.directionQueue[this.directionQueue.length - 1] === dir) {
      this.directionQueue = [dir];
    } else {
      this.directionQueue.push(dir);
    }
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
    if (this.directionQueue.length > 0) {
      this.currentDirection = this.directionQueue.shift()!;
      this.onDirectionChange?.(this.currentDirection);
    }
  }

  /** Set direction without queuing (used by D-pad buttons). */
  setCurrentDirection(dir: Direction): void {
    this.currentDirection = dir;
    this.directionQueue = [dir];
    this.onDirectionChange?.(dir);
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
