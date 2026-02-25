import { describe, expect, it } from 'vitest';
import { toTitleCase } from '@/lib/utils/strings';

describe('toTitleCase', () => {
  it('normalizes words to title case', () => {
    expect(toTitleCase('jOhN doE')).toBe('John Doe');
  });

  it('trims and collapses whitespace', () => {
    expect(toTitleCase('   alice    bob   ')).toBe('Alice Bob');
  });
});
