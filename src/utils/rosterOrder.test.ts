import { describe, expect, it } from 'vitest';
import type { PersonAssignment } from '../types';
import { orderRosterForDisplay } from './rosterOrder';

const person = (name: string, city: string): PersonAssignment => ({
  name,
  normalizedName: name.toLowerCase(),
  city,
});

describe('orderRosterForDisplay', () => {
  it('interleaves names by city instead of preserving grouped CSV order', () => {
    const ordered = orderRosterForDisplay([
      person('Alice', 'Paris'),
      person('Charlie', 'Paris'),
      person('Bob', 'Tokyo'),
      person('Dina', 'Tokyo'),
      person('Elliot', 'Lisbon'),
    ]);

    expect(ordered.map((assignment) => assignment.city)).toEqual(['Paris', 'Tokyo', 'Lisbon', 'Paris', 'Tokyo']);
  });
});
