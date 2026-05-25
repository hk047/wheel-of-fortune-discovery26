import { motion } from 'framer-motion';
import type { CitySlice, SpinState } from '../types';
import { formatCityLabel } from '../utils/wheelLabels';

type WheelProps = {
  slices: CitySlice[];
  rotation: number;
  spinState: SpinState;
  clickerTick: number;
};

const CENTER = 250;
const SLICE_RADIUS = 204;

const wheelTheme = {
  divider: '#fff0a8',
  innerDivider: '#4d1a35',
  labelStroke: 'rgba(12, 3, 12, 0.92)',
};

const jewelToneStops = [
  ['#ff6f91', '#d91f52', '#7d1131'],
  ['#ffd166', '#f59e0b', '#8a4a05'],
  ['#6ee7a8', '#22c55e', '#166534'],
  ['#67e8f9', '#06b6d4', '#155e75'],
  ['#8fb6ff', '#3b82f6', '#1e3a8a'],
  ['#c4a2ff', '#8b5cf6', '#4c1d95'],
  ['#ff8bd5', '#ec4899', '#831843'],
  ['#ff827b', '#ef4444', '#7f1d1d'],
  ['#5eead4', '#14b8a6', '#134e4a'],
  ['#fde047', '#eab308', '#713f12'],
  ['#d8b4fe', '#a855f7', '#581c87'],
  ['#fda4af', '#fb7185', '#881337'],
  ['#7dd3fc', '#38bdf8', '#075985'],
  ['#bef264', '#84cc16', '#365314'],
  ['#fdba74', '#f97316', '#7c2d12'],
];

export function Wheel({ slices, rotation, spinState, clickerTick }: WheelProps) {
  const hasSlices = slices.length > 0;
  const isSpinning = spinState === 'spinning';

  return (
    <div className={`wheel-shell ${isSpinning ? 'wheel-shell-spinning' : ''}`} aria-label="City wheel">
      <div className="wheel-crown" />
      <WheelPointer clickerTick={clickerTick} spinState={spinState} />

      <motion.svg
        viewBox="0 0 500 500"
        className={`wheel-svg ${isSpinning ? 'wheel-svg-spinning' : ''}`}
        style={{ rotate: rotation }}
        animate={{
          scale: spinState === 'finished' ? [1, 1.018, 0.997, 1] : 1,
        }}
        transition={{ duration: 0.76, ease: 'easeOut' }}
      >
        <WheelDefs slices={slices} />
        <WheelRim />
        <WheelSlices slices={slices} hasSlices={hasSlices} />
        <WheelVarnish />
        <WheelLabels slices={slices} />
        <WheelHub />
        <WheelBulbs count={Math.max(slices.length, 16)} isSpinning={isSpinning} />
      </motion.svg>

      {!hasSlices && <div className="empty-wheel-copy">Load CSV or try sample data</div>}
    </div>
  );
}

function WheelPointer({ clickerTick, spinState }: { clickerTick: number; spinState: SpinState }) {
  return (
    <div className={`pointer ${spinState === 'finished' ? 'pointer-finished' : ''}`}>
      <div className="pointer-shadow" />
      <div className="pointer-arm" />
      <div className="pointer-pin" />
      <div className="pointer-pin-shine" />
      <div key={clickerTick} className={`pointer-blade ${clickerTick > 0 ? 'pointer-blade-tick' : ''}`} />
    </div>
  );
}

function WheelDefs({ slices }: { slices: CitySlice[] }) {
  return (
    <defs>
      <radialGradient id="rimOuterMetal" cx="34%" cy="18%">
        <stop offset="0%" stopColor="#fff8c7" />
        <stop offset="21%" stopColor="#f7d56a" />
        <stop offset="46%" stopColor="#b96a17" />
        <stop offset="72%" stopColor="#52200a" />
        <stop offset="100%" stopColor="#170709" />
      </radialGradient>
      <linearGradient id="rimGoldRail" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#fff6b8" />
        <stop offset="18%" stopColor="#dfaa35" />
        <stop offset="42%" stopColor="#7d3509" />
        <stop offset="58%" stopColor="#ffe48c" />
        <stop offset="82%" stopColor="#a55212" />
        <stop offset="100%" stopColor="#321006" />
      </linearGradient>
      <radialGradient id="hubGold" cx="34%" cy="24%">
        <stop offset="0%" stopColor="#fffbe5" />
        <stop offset="27%" stopColor="#ffe27d" />
        <stop offset="58%" stopColor="#b85f15" />
        <stop offset="100%" stopColor="#321006" />
      </radialGradient>
      <radialGradient id="hubInset" cx="42%" cy="26%">
        <stop offset="0%" stopColor="#ffdf92" />
        <stop offset="34%" stopColor="#7f3414" />
        <stop offset="100%" stopColor="#190713" />
      </radialGradient>
      <radialGradient id="sliceVignette" cx="44%" cy="24%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
        <stop offset="46%" stopColor="#ffffff" stopOpacity="0.02" />
        <stop offset="82%" stopColor="#000000" stopOpacity="0.13" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.26" />
      </radialGradient>
      <linearGradient id="glassSweep" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.58" />
        <stop offset="32%" stopColor="#ffffff" stopOpacity="0.16" />
        <stop offset="66%" stopColor="#ffffff" stopOpacity="0.03" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="dividerMetal" x1="0" x2="1">
        <stop offset="0%" stopColor="#61300d" />
        <stop offset="50%" stopColor="#fff0a8" />
        <stop offset="100%" stopColor="#7a3a0a" />
      </linearGradient>
      <radialGradient id="bulbFace" cx="34%" cy="27%">
        <stop offset="0%" stopColor="#fffde7" />
        <stop offset="28%" stopColor="#fff3a3" />
        <stop offset="68%" stopColor="#d49628" />
        <stop offset="100%" stopColor="#5c2609" />
      </radialGradient>
      <filter id="wheelRaisedShadow" x="-22%" y="-22%" width="144%" height="144%">
        <feDropShadow dx="0" dy="26" stdDeviation="17" floodColor="#000000" floodOpacity="0.62" />
      </filter>
      <filter id="rimInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.62" />
      </filter>
      <filter id="bulbGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="labelLift" x="-20%" y="-40%" width="140%" height="180%">
        <feDropShadow dx="0" dy="1.8" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.78" />
      </filter>
      {slices.map((slice) => {
        const stops = jewelToneStops[slice.index % jewelToneStops.length];
        return (
          <radialGradient key={slice.index} id={`slice-${slice.index}`} cx="34%" cy="22%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.48" />
            <stop offset="16%" stopColor={stops[0]} />
            <stop offset="58%" stopColor={stops[1]} />
            <stop offset="100%" stopColor={stops[2]} />
          </radialGradient>
        );
      })}
    </defs>
  );
}

function WheelRim() {
  return (
    <g className="wheel-rim" filter="url(#wheelRaisedShadow)">
      <ellipse cx={CENTER} cy="281" rx="232" ry="214" fill="#050208" opacity="0.72" />
      <circle cx={CENTER} cy={CENTER} r="247" fill="#130508" />
      <circle cx={CENTER} cy={CENTER} r="241" fill="url(#rimOuterMetal)" />
      <circle cx={CENTER} cy={CENTER} r="229" fill="none" stroke="url(#rimGoldRail)" strokeWidth="11" />
      <circle cx={CENTER} cy={CENTER} r="216" fill="#220b22" stroke="#10040d" strokeWidth="7" />
      <circle cx={CENTER} cy={CENTER} r="210" fill="none" stroke="#fff0a8" strokeWidth="2.6" opacity="0.74" />
      <circle cx={CENTER} cy={CENTER} r="196" fill="none" stroke="#0b0309" strokeWidth="6" opacity="0.22" />
    </g>
  );
}

function WheelSlices({ slices, hasSlices }: { slices: CitySlice[]; hasSlices: boolean }) {
  if (!hasSlices) {
    return <circle cx={CENTER} cy={CENTER} r={SLICE_RADIUS} fill="#5b254f" />;
  }

  return (
    <g filter="url(#rimInnerShadow)">
      {slices.map((slice) => (
        <WheelSlice key={slice.city} slice={slice} />
      ))}
    </g>
  );
}

function WheelSlice({ slice }: { slice: CitySlice }) {
  const path = describeArc(CENTER, CENTER, SLICE_RADIUS, slice.startAngle, slice.endAngle);
  const separator = polarToCartesian(CENTER, CENTER, SLICE_RADIUS, slice.startAngle);
  const innerSeparator = polarToCartesian(CENTER, CENTER, 78, slice.startAngle);

  return (
    <g>
      <path d={path} fill={`url(#slice-${slice.index})`} stroke={wheelTheme.innerDivider} strokeWidth="1.4" className="wheel-slice" />
      <line
        x1={innerSeparator.x}
        y1={innerSeparator.y}
        x2={separator.x}
        y2={separator.y}
        stroke="url(#dividerMetal)"
        strokeWidth="3.2"
        opacity="0.84"
      />
      <line
        x1={innerSeparator.x}
        y1={innerSeparator.y}
        x2={separator.x}
        y2={separator.y}
        stroke="#fff7c5"
        strokeWidth="0.8"
        opacity="0.62"
      />
    </g>
  );
}

function WheelVarnish() {
  return (
    <g pointerEvents="none">
      <circle cx={CENTER} cy={CENTER} r={SLICE_RADIUS} fill="url(#sliceVignette)" />
      <path className="wheel-glass-highlight" d="M 91 106 C 164 34 302 27 405 102 C 317 78 204 81 108 137 Z" fill="url(#glassSweep)" />
      <path
        className="wheel-gloss-band"
        d="M 82 226 C 165 173 326 158 421 215 C 347 194 181 205 91 265 Z"
        fill="#ffffff"
        opacity="0.08"
      />
      <circle cx={CENTER} cy={CENTER} r="205" fill="none" stroke="#fff9cf" strokeWidth="2" opacity="0.42" />
      <circle cx={CENTER} cy={CENTER} r="172" fill="none" stroke="#210815" strokeWidth="9" opacity="0.16" />
    </g>
  );
}

function WheelLabels({ slices }: { slices: CitySlice[] }) {
  return (
    <g filter="url(#labelLift)">
      {slices.map((slice) => (
        <CityLabel key={`${slice.city}-label`} slice={slice} total={slices.length} />
      ))}
    </g>
  );
}

function WheelHub() {
  return (
    <g className="wheel-hub">
      <circle cx={CENTER} cy={CENTER} r="86" fill="#160713" opacity="0.72" />
      <circle cx={CENTER} cy={CENTER} r="78" fill="url(#hubGold)" stroke="#fff2a8" strokeWidth="4.5" />
      <circle cx={CENTER} cy={CENTER} r="66" fill="#42140e" opacity="0.52" />
      <circle cx={CENTER} cy={CENTER} r="60" fill="url(#hubInset)" stroke="#ffe58a" strokeWidth="2" opacity="0.94" />
      <circle cx={CENTER - 19} cy={CENTER - 23} r="21" fill="#fff2b6" opacity="0.34" />
      <circle cx={CENTER} cy={CENTER} r="43" fill="none" stroke="#180711" strokeWidth="12" opacity="0.16" />
      <text x={CENTER} y={CENTER - 5} textAnchor="middle" className="hub-text">
        GROUP
      </text>
      <text x={CENTER} y={CENTER + 25} textAnchor="middle" className="hub-subtext">
        REVEAL
      </text>
    </g>
  );
}

function WheelBulbs({ count, isSpinning }: { count: number; isSpinning: boolean }) {
  return (
    <g className={isSpinning ? 'wheel-bulbs wheel-bulbs-spinning' : 'wheel-bulbs'}>
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / count) * 360;
        const point = polarToCartesian(CENTER, CENTER, 236, angle);
        const scale = index % 2 === 0 ? 1 : 0.86;
        return (
          <g key={angle} className="wheel-bulb" filter="url(#bulbGlow)" style={{ animationDelay: `${index * 70}ms` }}>
            <circle cx={point.x} cy={point.y} r={9.5 * scale} fill="#4c1d05" opacity="0.78" />
            <circle cx={point.x} cy={point.y} r={6.8 * scale} fill="url(#bulbFace)" />
            <circle cx={point.x - 2.2 * scale} cy={point.y - 2.5 * scale} r={2.1 * scale} fill="#fffce8" opacity="0.96" />
          </g>
        );
      })}
    </g>
  );
}

function CityLabel({ slice, total }: { slice: CitySlice; total: number }) {
  const middleAngle = (slice.startAngle + slice.endAngle) / 2;
  const lines = formatCityLabel(slice.city);
  const point = polarToCartesian(CENTER, CENTER, total > 14 ? 149 : total > 10 ? 153 : 140, middleAngle);
  const fontSize = getLabelFontSize(total, lines);
  const firstCityLineY = lines.length === 1 ? 8 : 4;

  return (
    <g transform={`rotate(${middleAngle + 90} ${point.x} ${point.y})`}>
      <text x={point.x} y={point.y - 14} textAnchor="middle" dominantBaseline="middle" className="slice-kicker">
        GROUP
      </text>
      <text
        x={point.x}
        y={point.y + firstCityLineY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="slice-label"
        fontSize={fontSize}
      >
        {lines.map((line, index) => (
          <tspan key={line} x={point.x} dy={index === 0 ? 0 : fontSize + 1.2}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function getLabelFontSize(total: number, lines: string[]): number {
  const longestLine = Math.max(...lines.map((line) => line.length));
  const baseSize = total > 16 ? 8.4 : total > 12 ? 9.4 : total > 8 ? 11.4 : 14.4;

  if (longestLine >= 10) {
    return baseSize - 1.2;
  }

  if (longestLine >= 8) {
    return baseSize - 0.55;
  }

  return baseSize;
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
