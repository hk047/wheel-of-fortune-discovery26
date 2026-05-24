import { motion } from 'framer-motion';
import type { CitySlice, SpinState } from '../types';

type WheelProps = {
  slices: CitySlice[];
  rotation: number;
  spinState: SpinState;
};

const CENTER = 250;
const RADIUS = 210;

export function Wheel({ slices, rotation, spinState }: WheelProps) {
  const hasSlices = slices.length > 0;

  return (
    <div className="wheel-shell" aria-label="City wheel">
      <div className="wheel-crown" />
      <div className={`pointer ${spinState === 'spinning' ? 'pointer-live' : ''}`}>
        <div className="pointer-arm" />
        <div className="pointer-pin" />
        <div className="pointer-blade" />
      </div>

      <motion.svg
        viewBox="0 0 500 500"
        className="wheel-svg"
        style={{ rotate: rotation }}
        animate={{
          scale: spinState === 'finished' ? [1, 1.018, 0.995, 1] : 1,
        }}
        transition={{ duration: 0.72, ease: 'easeOut' }}
      >
        <defs>
          <radialGradient id="hubGradient" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#fffbe4" />
            <stop offset="30%" stopColor="#ffe079" />
            <stop offset="66%" stopColor="#c87419" />
            <stop offset="100%" stopColor="#5a2207" />
          </radialGradient>
          <radialGradient id="rimGradient" cx="40%" cy="25%">
            <stop offset="0%" stopColor="#fff9c9" />
            <stop offset="28%" stopColor="#f5c84d" />
            <stop offset="58%" stopColor="#b86516" />
            <stop offset="100%" stopColor="#351205" />
          </radialGradient>
          <linearGradient id="glassSweep" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.52" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="sliceVignette" cx="44%" cy="28%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.24" />
          </radialGradient>
          <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="22" stdDeviation="18" floodColor="#000" floodOpacity="0.58" />
          </filter>
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.55" />
          </filter>
          <filter id="bulbGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx={CENTER} cy="276" rx="232" ry="219" fill="#180715" opacity="0.72" />
        <circle cx={CENTER} cy={CENTER} r="246" fill="url(#rimGradient)" filter="url(#wheelShadow)" />
        <circle cx={CENTER} cy={CENTER} r="235" fill="none" stroke="#fff2a1" strokeWidth="5" opacity="0.9" />
        <circle cx={CENTER} cy={CENTER} r="222" fill="#230f28" stroke="#4b1a3e" strokeWidth="6" />

        {hasSlices ? (
          <g filter="url(#innerShadow)">
            {slices.map((slice) => <SlicePath key={slice.city} slice={slice} />)}
          </g>
        ) : (
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#5b254f" />
        )}

        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#sliceVignette)" pointerEvents="none" />
        <path d="M 105 95 C 178 31 302 25 389 96 C 316 77 207 82 118 127 Z" fill="url(#glassSweep)" opacity="0.44" />
        <circle cx={CENTER} cy={CENTER} r="212" fill="none" stroke="#fff7cf" strokeWidth="3" opacity="0.55" />
        <circle cx={CENTER} cy={CENTER} r="184" fill="none" stroke="#1d0718" strokeWidth="8" opacity="0.18" />

        {slices.map((slice) => (
          <CityLabel key={`${slice.city}-label`} slice={slice} total={slices.length} />
        ))}

        <circle cx={CENTER} cy={CENTER} r="78" fill="#3a101e" opacity="0.55" />
        <circle cx={CENTER} cy={CENTER} r="67" fill="url(#hubGradient)" stroke="#fff1a8" strokeWidth="6" />
        <circle cx={CENTER - 18} cy={CENTER - 20} r="22" fill="#fff4be" opacity="0.38" />
        <circle cx={CENTER} cy={CENTER} r="37" fill="#7c310e" opacity="0.42" />
        <text x={CENTER} y={CENTER - 2} textAnchor="middle" className="hub-text">
          GROUP
        </text>
        <text x={CENTER} y={CENTER + 27} textAnchor="middle" className="hub-subtext">
          REVEAL
        </text>

        {Array.from({ length: Math.max(slices.length, 12) }).map((_, index, lights) => {
          const angle = (index / lights.length) * 360;
          const point = polarToCartesian(CENTER, CENTER, 238, angle);
          return (
            <g key={angle} filter="url(#bulbGlow)">
              <circle cx={point.x} cy={point.y} r="9" fill="#5d260a" opacity="0.55" />
              <circle cx={point.x} cy={point.y} r="6.5" fill={index % 2 ? '#fff7bd' : '#ffd34e'} />
              <circle cx={point.x - 2} cy={point.y - 2} r="2.2" fill="#fffde7" opacity="0.95" />
            </g>
          );
        })}
      </motion.svg>

      {!hasSlices && <div className="empty-wheel-copy">Load CSV or try sample data</div>}
    </div>
  );
}

function SlicePath({ slice }: { slice: CitySlice }) {
  const path = describeArc(CENTER, CENTER, RADIUS, slice.startAngle, slice.endAngle);
  const separator = polarToCartesian(CENTER, CENTER, RADIUS, slice.startAngle);
  return (
    <g>
      <defs>
        <radialGradient id={`slice-${slice.index}`} cx="35%" cy="24%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="18%" stopColor={slice.color} stopOpacity="1" />
          <stop offset="72%" stopColor={slice.color} stopOpacity="0.92" />
          <stop offset="100%" stopColor="#210718" stopOpacity="0.34" />
        </radialGradient>
      </defs>
      <path d={path} fill={`url(#slice-${slice.index})`} stroke="#f8d889" strokeWidth="2.4" className="wheel-slice" />
      <line
        x1={CENTER}
        y1={CENTER}
        x2={separator.x}
        y2={separator.y}
        stroke="#fff7c8"
        strokeWidth="3"
        opacity="0.62"
      />
    </g>
  );
}

function CityLabel({ slice, total }: { slice: CitySlice; total: number }) {
  const middleAngle = (slice.startAngle + slice.endAngle) / 2;
  const point = polarToCartesian(CENTER, CENTER, total > 10 ? 142 : 132, middleAngle);
  const fontSize = total > 12 ? 12 : total > 8 ? 14 : 17;
  const label = slice.city.length > 15 ? `${slice.city.slice(0, 13)}...` : slice.city;

  return (
    <g transform={`rotate(${middleAngle + 90} ${point.x} ${point.y})`}>
      <text x={point.x} y={point.y - 8} textAnchor="middle" dominantBaseline="middle" className="slice-kicker">
        GROUP
      </text>
      <text x={point.x} y={point.y + 9} textAnchor="middle" dominantBaseline="middle" className="slice-label" fontSize={fontSize}>
        {label}
      </text>
    </g>
  );
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return ['M', x, y, 'L', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
}
