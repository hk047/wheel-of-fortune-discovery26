import { describe, expect, it } from 'vitest';
import { findAssignment, parseAssignmentsCsv } from './csv';

describe('parseAssignmentsCsv', () => {
  it('parses a simple name,city CSV and normalizes lookup names', () => {
    const result = parseAssignmentsCsv('name,city\n Alice , Paris \nBob,Tokyo');

    expect(result.assignments).toEqual([
      { name: 'Alice', normalizedName: 'alice', city: 'Paris' },
      { name: 'Bob', normalizedName: 'bob', city: 'Tokyo' },
    ]);
    expect(findAssignment(result.assignments, '  ALICE  ')?.city).toBe('Paris');
  });

  it('skips invalid rows and reports duplicate names', () => {
    const result = parseAssignmentsCsv('name,city\nAlice,Paris\n,Tokyo\nBob,\nALICE,Rome');

    expect(result.assignments).toHaveLength(2);
    expect(result.skippedRows).toEqual([3, 4]);
    expect(result.duplicateNames).toEqual(['ALICE']);
    expect(result.warnings).toEqual([
      'Skipped 2 row(s) with missing name or city.',
      'Duplicate name(s) found: ALICE. The latest row wins for lookup.',
    ]);
  });

  it('handles quoted commas in fields', () => {
    const result = parseAssignmentsCsv('name,city\n"Dina Smith","New York, NY"');

    expect(result.assignments[0]).toMatchObject({
      name: 'Dina Smith',
      city: 'New York, NY',
    });
  });
});
