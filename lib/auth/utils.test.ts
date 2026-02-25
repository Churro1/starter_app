import { describe, expect, it } from 'vitest';
import { isSessionActive } from '@/lib/auth/utils';

describe('isSessionActive', () => {
  it('returns true when expiry is in the future', () => {
    expect(isSessionActive(2000, 1000)).toBe(true);
  });

  it('returns false when expiry is missing or expired', () => {
    expect(isSessionActive(undefined, 1000)).toBe(false);
    expect(isSessionActive(900, 1000)).toBe(false);
  });
});
