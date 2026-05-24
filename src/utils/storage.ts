import type { PersonAssignment } from '../types';

const STORAGE_KEY = 'city-fortune-wheel.assignments.v1';

export function loadAssignments(): PersonAssignment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersonAssignment[]) : [];
  } catch {
    return [];
  }
}

export function saveAssignments(assignments: PersonAssignment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
}

export function clearAssignments(): void {
  localStorage.removeItem(STORAGE_KEY);
}
