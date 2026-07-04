import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/**/*.ts',
      ],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
        '**/map.json',
        'src/main.ts',
        'src/config/gameConstants.ts',
        'src/engine/Engine.ts',
        'src/engine/Input.ts',
        'src/engine/Player.ts',
        'src/engine/TileRenderer.ts',
        'src/services/LocalScoreService.ts',
        'src/services/ScoreService.ts',
      ],
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
    },
  },
});
