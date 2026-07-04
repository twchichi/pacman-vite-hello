/**
 * ResizeManager: Responsive canvas sizing for Pac-Man
 *
 * Handles:
 * - Canvas aspect ratio preservation
 * - Safe-area insets (iOS notch, Android notch)
 * - Device pixel ratio for crisp rendering
 * - No horizontal scroll (canvas centered, overflow hidden)
 * - Orientation change handling
 */

export interface ResizeCallback {
  (canvasWidth: number, canvasHeight: number): void;
}

export class ResizeManager {
  private canvas: HTMLCanvasElement;
  private container: HTMLElement;
  private onResize: ResizeCallback;
  private handleResize: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    onResize: ResizeCallback,
  ) {
    this.canvas = canvas;
    this.container = container;
    this.onResize = onResize;

    this.handleResize = () => {
      this.resize();
    };

    // Initial resize
    this.resize();

    // Listen for resize and orientation change
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
  }

  /**
   * Perform resize calculation and update canvas.
   */
  private resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;

    if (containerWidth === 0 || containerHeight === 0) {
      return;
    }

    // Get safe-area insets from CSS env() variables
    const safeAreaTop = this.getSafeAreaInset('top');
    const safeAreaRight = this.getSafeAreaInset('right');
    const safeAreaBottom = this.getSafeAreaInset('bottom');
    const safeAreaLeft = this.getSafeAreaInset('left');

    // Calculate available area excluding safe areas
    const availableWidth = containerWidth - safeAreaLeft - safeAreaRight;
    const availableHeight = containerHeight - safeAreaTop - safeAreaBottom;

    if (availableWidth <= 0 || availableHeight <= 0) {
      return;
    }

    // Calculate the scaling factor to fit the map in the container
    // The map is 28 columns × 31 rows
    const mapAspectRatio = 28 / 31;
    const containerAspectRatio = availableWidth / availableHeight;

    let displayWidth: number;
    let displayHeight: number;

    if (containerAspectRatio > mapAspectRatio) {
      // Container is wider than map → fit by height
      displayHeight = availableHeight;
      displayWidth = displayHeight * mapAspectRatio;
    } else {
      // Container is taller than map → fit by width
      displayWidth = availableWidth;
      displayHeight = displayWidth / mapAspectRatio;
    }

    // Apply the scaling
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    // Update canvas dimensions with device pixel ratio for crisp rendering
    this.canvas.width = Math.floor(displayWidth * dpr);
    this.canvas.height = Math.floor(displayHeight * dpr);

    // Notify callback
    this.onResize(displayWidth, displayHeight);
  }

  /**
   * Get safe-area inset value in pixels.
   * Returns 0 if env() is not supported.
   */
  private getSafeAreaInset(edge: 'top' | 'right' | 'bottom' | 'left'): number {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--safe-area-${edge}`)
      .trim();

    if (value === '') {
      return 0;
    }

    return parseInt(value, 10) || 0;
  }

  /**
   * Remove event listeners.
   */
  public dispose(): void {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
  }
}
