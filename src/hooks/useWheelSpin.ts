import { useCallback, useEffect, useRef, useState } from 'react';
import type { CitySlice, SpinPlan, SpinState } from '../types';
import { createSpinPlan } from '../utils/wheelMath';
import { playFanfare, playStopClack, playTick } from '../utils/audio';

type UseWheelSpinResult = {
  rotation: number;
  spinState: SpinState;
  activePlan: SpinPlan | null;
  clickerTick: number;
  spinToCity: (city: string) => Promise<void>;
  resetRevealState: () => void;
};

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export function useWheelSpin(slices: CitySlice[], onFinished: (city: string) => void): UseWheelSpinResult {
  const [rotation, setRotation] = useState(0);
  const [spinState, setSpinState] = useState<SpinState>('idle');
  const [activePlan, setActivePlan] = useState<SpinPlan | null>(null);
  const [clickerTick, setClickerTick] = useState(0);
  const rotationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastBoundaryCountRef = useRef(0);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(
    () => () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    },
    [],
  );

  const resetRevealState = useCallback(() => {
    if (spinState !== 'spinning') {
      setSpinState('idle');
      setActivePlan(null);
    }
  }, [spinState]);

  const spinToCity = useCallback(
    (city: string) =>
      new Promise<void>((resolve, reject) => {
        if (spinState === 'spinning') {
          resolve();
          return;
        }

        let plan: SpinPlan;
        try {
          plan = createSpinPlan({ slices, targetCity: city, currentRotation: rotationRef.current });
        } catch (error) {
          reject(error);
          return;
        }

        setActivePlan(plan);
        setSpinState('spinning');
        const startedAt = performance.now();
        const sliceSize = slices.length > 0 ? 360 / slices.length : 360;
        lastBoundaryCountRef.current = 0;

        const animate = (time: number) => {
          const elapsed = time - startedAt;
          const progress = Math.min(1, elapsed / plan.durationMs);
          const eased = easeOutCubic(progress);
          const nextRotation = plan.fromRotation + (plan.toRotation - plan.fromRotation) * eased;
          rotationRef.current = nextRotation;
          setRotation(nextRotation);

          const boundaryCount = Math.floor(Math.abs(nextRotation - plan.fromRotation) / sliceSize);
          if (boundaryCount > lastBoundaryCountRef.current) {
            const crossedBoundaries = boundaryCount - lastBoundaryCountRef.current;
            lastBoundaryCountRef.current = boundaryCount;
            setClickerTick((tick) => tick + crossedBoundaries);
            const ticksToPlay = Math.min(crossedBoundaries, 4);
            for (let tickIndex = 0; tickIndex < ticksToPlay; tickIndex += 1) {
              playTick(Math.max(0.42, 1 - progress * 0.52), tickIndex * 0.018);
            }
          }

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
            return;
          }

          setRotation(plan.toRotation);
          rotationRef.current = plan.toRotation;
          setSpinState('finished');
          playStopClack();
          window.setTimeout(() => {
            playFanfare();
            onFinished(city);
            resolve();
          }, 260);
        };

        rafRef.current = requestAnimationFrame(animate);
      }),
    [onFinished, slices, spinState],
  );

  return { rotation, spinState, activePlan, clickerTick, spinToCity, resetRevealState };
}
