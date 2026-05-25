import { describe, expect, it } from 'vitest';
import { formatHubName } from './nameDisplay';

describe('formatHubName', () => {
  it('uses the default drop prompt when empty', () => {
    expect(formatHubName('')).toEqual({ lines: ['Drop'], size: 'normal' });
  });

  it('keeps short names on one line', () => {
    expect(formatHubName('Alice')).toEqual({ lines: ['Alice'], size: 'normal' });
  });

  it('wraps multi-word names for the hub', () => {
    expect(formatHubName('Mary Jane Smith')).toEqual({ lines: ['Mary Jane', 'Smith'], size: 'small' });
  });

  it('shrinks very long single names', () => {
    expect(formatHubName('Maximilian')).toEqual({ lines: ['Maximilian'], size: 'small' });
  });
});
