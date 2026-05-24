import { describe, expect, it } from 'vitest';
import { formatCityLabel } from '../utils/wheelLabels';

describe('formatCityLabel', () => {
  it('keeps short city names on one line', () => {
    expect(formatCityLabel('Paris')).toEqual(['Paris']);
  });

  it('wraps multi-word city names onto readable lines', () => {
    expect(formatCityLabel('New York')).toEqual(['New', 'York']);
    expect(formatCityLabel('Rio de Janeiro')).toEqual(['Rio de', 'Janeiro']);
  });

  it('keeps one-word city names intact', () => {
    expect(formatCityLabel('Singapore')).toEqual(['Singapore']);
    expect(formatCityLabel('Vancouver')).toEqual(['Vancouver']);
  });

  it('shortens very long labels while keeping two lines at most', () => {
    expect(formatCityLabel('Very Long City Name')).toEqual(['Very Long', 'City...']);
  });
});
