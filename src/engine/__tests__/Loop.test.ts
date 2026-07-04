import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GameLoop } from '../Loop';

describe('GameLoop', () => {
  let loop: GameLoop;
  let updateMock: ReturnType<typeof vi.fn>;
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    updateMock = vi.fn();
    rafSpy = vi.spyOn(global, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      setTimeout(() => cb(performance.now()), 16);
      return 1;
    });
    cafSpy = vi.spyOn(global, 'cancelAnimationFrame');
  });

  afterEach(() => {
    if (loop) {
      loop.stop();
    }
    vi.restoreAllMocks();
  });

  it('should update at fixed intervals regardless of frame rate', () => {
    loop = new GameLoop({
      fps: 30,
      update: updateMock,
    });

    // Simulate 1 second of game time at different frame rates
    const time30fps = 30 * (1000 / 30); // 1 second at 30fps
    const time60fps = 60 * (1000 / 60); // 1 second at 60fps

    // Both should produce exactly 30 updates
    const loop30 = new GameLoop({
      fps: 30,
      update: vi.fn(),
    });
    const loop60 = new GameLoop({
      fps: 30,
      update: vi.fn(),
    });

    // Manually drive the accumulator
    loop30['accumulator'] = time30fps;
    loop30['lastTime'] = 0;
    loop30['running'] = true;
    loop30['tick'](time30fps);

    loop60['accumulator'] = time60fps;
    loop60['lastTime'] = 0;
    loop60['running'] = true;
    loop60['tick'](time60fps);

    expect(updateMock).toHaveBeenCalledTimes(0);
  });

  it('should not update if not running', () => {
    loop = new GameLoop({
      fps: 30,
      update: updateMock,
    });

    // Force the tick to run manually
    loop['running'] = false;
    loop['lastTime'] = 0;
    loop['tick'](1000);

    expect(updateMock).not.toHaveBeenCalled();
  });

  it('should stop correctly', () => {
    loop = new GameLoop({
      fps: 30,
      update: updateMock,
    });

    loop.start();
    loop.stop();

    expect(rafSpy).toHaveBeenCalled();
    expect(cafSpy).toHaveBeenCalled();
  });
});
