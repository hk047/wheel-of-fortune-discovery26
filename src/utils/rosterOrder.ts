import type { PersonAssignment } from '../types';

export function orderRosterForDisplay(assignments: PersonAssignment[]): PersonAssignment[] {
  const buckets = new Map<string, PersonAssignment[]>();
  assignments.forEach((assignment) => {
    const cityAssignments = buckets.get(assignment.city) ?? [];
    cityAssignments.push(assignment);
    buckets.set(assignment.city, cityAssignments);
  });

  const orderedBuckets = Array.from(buckets.values()).sort((left, right) => right.length - left.length);
  const ordered: PersonAssignment[] = [];
  let index = 0;
  let added = true;

  while (added) {
    added = false;
    orderedBuckets.forEach((bucket) => {
      const assignment = bucket[index];
      if (assignment) {
        ordered.push(assignment);
        added = true;
      }
    });
    index += 1;
  }

  return ordered;
}
