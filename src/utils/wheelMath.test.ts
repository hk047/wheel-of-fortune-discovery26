import { describe, expect, it } from 'vitest';
import { buildCitySlices, createSpinPlan, normalizeDegrees, pointerAlignedRotationForSlice } from './wheelMath';

describe('wheelMath', () => {
  it('builds equal slices for all unique cities', () => {
    const slices = buildCitySlices(['Paris', 'Tokyo', 'Paris', 'New York']);

    expect(slices.map((slice) => slice.city)).toEqual(['Paris', 'Tokyo', 'New York']);
    expect(slices[0]).toMatchObject({ startAngle: 0, endAngle: 120 });
    expect(slices[2]).toMatchObject({ startAngle: 240, endAngle: 360 });
  });

  it('calculates a rotation that places the selected slice under the top pointer', () => {
    const slices = buildCitySlices(['Paris', 'Tokyo', 'New York']);
    const rotation = pointerAlignedRotationForSlice(slices[1], 0.5);
    const landedWheelAngleAtPointer = normalizeDegrees(270 - rotation);

    expect(landedWheelAngleAtPointer).toBeGreaterThan(120);
    expect(landedWheelAngleAtPointer).toBeLessThan(240);
  });

  it('creates a dramatic spin plan with full rotations and the requested city', () => {
    const slices = buildCitySlices(['Paris', 'Tokyo', 'New York']);
    const plan = createSpinPlan({
      slices,
      targetCity: 'New York',
      currentRotation: 15,
      random: () => 0.5,
    });

    expect(plan.targetCity).toBe('New York');
    expect(plan.fullRotations).toBeGreaterThanOrEqual(6);
    expect(plan.fullRotations).toBeLessThanOrEqual(10);
    expect(plan.durationMs).toBeGreaterThanOrEqual(4000);
    expect(plan.durationMs).toBeLessThanOrEqual(7000);
    expect(plan.toRotation).toBeGreaterThan(plan.fromRotation + 360 * 6);
  });
});
