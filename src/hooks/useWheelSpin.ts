import { useCallback, useEffect, useRef, useState } from 'react';
import type { CitySlice, SpinPlan, SpinState } from '../types';
import { createSpinPlan } from '../utils/wheelMath';
import { playFanfare, playStopClack, playTick } from '../utils/audio';

type UseWheelSpinResult = {
  rotation: number;
  spinState: SpinState;
  activePlan: SpinPlan | null;
  spinToCity: (city: string) => Promise<void>;
  resetRevealState: () => void;
};

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export function useWheelSpin(slices: CitySlice[], onFinished: (city: string) => void): UseWheelSpinResult {
  const [rotation, setRotation] = useState(0);
  const [spinState, setSpinState] = useState<SpinState>('idle');
  const [activePlan, setActivePlan] = useState<SpinPlan | null>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTickSliceRef = useRef<number | null>(null);

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
        lastTickSliceRef.current = null;
        const startedAt = performance.now();
        const sliceSize = slices.length > 0 ? 360 / slices.length : 360;

        const animate = (time: number) => {
          const elapsed = time - startedAt;
          const progress = Math.min(1, elapsed / plan.durationMs);
          const eased = easeOutCubic(progress);
          const nextRotation = plan.fromRotation + (plan.toRotation - plan.fromRotation) * eased;
          rotationRef.current = nextRotation;
          setRotation(nextRotation);

          const pointerWheelAngle = ((270 - nextRotation) % 360 + 360) % 360;
          const tickSlice = Math.floor(pointerWheelAngle / sliceSize);
          if (tickSlice !== lastTickSliceRef.current) {
            lastTickSliceRef.current = tickSlice;
            playTick(Math.max(0.25, 1 - progress * 0.65));
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

  return { rotation, spinState, activePlan, spinToCity, resetRevealState };
}
