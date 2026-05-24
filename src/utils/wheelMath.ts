import type { CitySlice, SpinPlan } from '../types';

const SLICE_COLORS = [
  '#f43f5e',
  '#f59e0b',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#14b8a6',
  '#eab308',
  '#a855f7',
  '#fb7185',
  '#38bdf8',
  '#84cc16',
  '#f97316',
];

export function buildCitySlices(cities: string[]): CitySlice[] {
  const uniqueCities = Array.from(new Set(cities.map((city) => city.trim()).filter(Boolean)));
  const sliceSize = uniqueCities.length > 0 ? 360 / uniqueCities.length : 360;

  return uniqueCities.map((city, index) => ({
    city,
    index,
    startAngle: index * sliceSize,
    endAngle: (index + 1) * sliceSize,
    color: SLICE_COLORS[index % SLICE_COLORS.length],
  }));
}

export function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

export function pointerAlignedRotationForSlice(slice: CitySlice, landingRatio: number): number {
  const clampedRatio = Math.min(0.86, Math.max(0.14, landingRatio));
  const targetAngleInSlice = slice.startAngle + (slice.endAngle - slice.startAngle) * clampedRatio;

  // SVG wheel angles start at 3 o'clock and increase clockwise. The pointer is fixed at
  // 12 o'clock, which is 270 degrees in that coordinate system. Rotating the wheel by
  // this amount makes the chosen angle sit exactly under the fixed top pointer.
  return normalizeDegrees(270 - targetAngleInSlice);
}

export function createSpinPlan({
  slices,
  targetCity,
  currentRotation,
  random = Math.random,
}: {
  slices: CitySlice[];
  targetCity: string;
  currentRotation: number;
  random?: () => number;
}): SpinPlan {
  const slice = slices.find((candidate) => candidate.city === targetCity);
  if (!slice) {
    throw new Error(`No wheel slice found for city: ${targetCity}`);
  }

  const fullRotations = 6 + Math.floor(random() * 5);
  const landingOffset = 0.18 + random() * 0.64;
  const durationMs = 4000 + Math.round(random() * 3000);
  const targetBaseRotation = pointerAlignedRotationForSlice(slice, landingOffset);
  const currentNormalized = normalizeDegrees(currentRotation);
  const deltaToTarget = normalizeDegrees(targetBaseRotation - currentNormalized);
  const toRotation = currentRotation + fullRotations * 360 + deltaToTarget;

  return {
    targetCity,
    fromRotation: currentRotation,
    toRotation,
    durationMs,
    fullRotations,
    landingOffset,
  };
}
