import { describe, it, expect } from 'vitest';
import { renderScore, renderName } from '../safe-render';

describe('safe-render', () => {
  describe('renderScore', () => {
    it('renders score without XSS', () => {
      const html = renderScore('<script>alert("XSS")</script>100');
      expect(html).not.toContain('<script>');
      expect(html).toContain('100');
    });

    it('renders numeric score safely', () => {
      const html = renderScore(5000);
      expect(html).toBe('5000');
    });

    it('handles empty string', () => {
      const html = renderScore('');
      expect(html).toBe('');
    });

    it('handles null safely', () => {
      const html = renderScore(null);
      expect(html).toBe('');
    });
  });

  describe('renderName', () => {
    it('renders name without XSS', () => {
      const html = renderName('<img src=x onerror=alert(1)>Player1');
      expect(html).not.toContain('<img');
      expect(html).toContain('Player1');
    });

    it('renders simple name safely', () => {
      const html = renderName('Alice');
      expect(html).toBe('Alice');
    });

    it('handles null safely', () => {
      const html = renderName(null);
      expect(html).toBe('');
    });

    it('handles undefined safely', () => {
      const html = renderName(undefined);
      expect(html).toBe('');
    });

    it('escapes HTML entities', () => {
      const html = renderName('Bob & Carol');
      expect(html).toBe('Bob &amp; Carol');
    });
  });
});
