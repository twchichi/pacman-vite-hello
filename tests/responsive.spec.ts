import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test('canvas fits in 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone 8
    await page.goto('/');

    const canvas = page.locator('#game');
    const boundingBox = await canvas.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.width).toBeLessThanOrEqual(375);
    expect(boundingBox!.height).toBeLessThanOrEqual(667);
  });

  test('canvas fits in 414px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 }); // iPhone X
    await page.goto('/');

    const canvas = page.locator('#game');
    const boundingBox = await canvas.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.width).toBeLessThanOrEqual(414);
    expect(boundingBox!.height).toBeLessThanOrEqual(896);
  });

  test('no horizontal scroll on resize', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('/');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('aspect ratio preserved on orientation change', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('/');

    const canvas = page.locator('#game');
    const boundingBox1 = await canvas.boundingBox();

    // Simulate orientation change
    await page.setViewportSize({ width: 600, height: 800 });
    await page.waitForTimeout(100);

    const boundingBox2 = await canvas.boundingBox();

    expect(boundingBox1).toBeTruthy();
    expect(boundingBox2).toBeTruthy();

    const aspect1 = boundingBox1!.width / boundingBox1!.height;
    const aspect2 = boundingBox2!.width / boundingBox2!.height;

    const ratioDiff = Math.abs(aspect1 - aspect2);
    expect(ratioDiff).toBeLessThan(0.05);
  });
});
