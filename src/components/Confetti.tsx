import { useMemo } from 'react';

type ConfettiProps = {
  active: boolean;
};

export function Confetti({ active }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 74 }).map((_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.42}s`,
        duration: `${1.9 + Math.random() * 1.4}s`,
        color: ['#facc15', '#fb7185', '#22d3ee', '#a78bfa', '#34d399'][index % 5],
        rotation: `${Math.random() * 360}deg`,
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            backgroundColor: piece.color,
            rotate: piece.rotation,
          }}
        />
      ))}
    </div>
  );
}
