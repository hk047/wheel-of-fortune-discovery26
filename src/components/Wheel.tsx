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
        <WheelBulbs count={Math.max(slices.length * 2, 24)} isSpinning={isSpinning} />
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
      <div className="pointer-pin-slot" />
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
      <radialGradient id="rimBlackChrome" cx="42%" cy="28%">
        <stop offset="0%" stopColor="#4b2434" />
        <stop offset="45%" stopColor="#160713" />
        <stop offset="78%" stopColor="#050207" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>
      <linearGradient id="rimHotEdge" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#fff9d1" />
        <stop offset="20%" stopColor="#f6c34a" />
        <stop offset="46%" stopColor="#6d2608" />
        <stop offset="64%" stopColor="#fff1a8" />
        <stop offset="100%" stopColor="#3b1204" />
      </linearGradient>
      <radialGradient id="rimInsetCavity" cx="50%" cy="42%">
        <stop offset="0%" stopColor="#3a1030" stopOpacity="0.22" />
        <stop offset="70%" stopColor="#11040e" stopOpacity="0.76" />
        <stop offset="100%" stopColor="#020102" stopOpacity="0.95" />
      </radialGradient>
      <linearGradient id="rimGoldRail" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#fff6b8" />
        <stop offset="18%" stopColor="#dfaa35" />
        <stop offset="42%" stopColor="#7d3509" />
        <stop offset="58%" stopColor="#ffe48c" />
        <stop offset="82%" stopColor="#a55212" />
        <stop offset="100%" stopColor="#321006" />
      </linearGradient>
      <linearGradient id="sliceSheen" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.36" />
        <stop offset="21%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="54%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
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
      <radialGradient id="hubRubyGlass" cx="36%" cy="24%">
        <stop offset="0%" stopColor="#fff1c7" stopOpacity="0.75" />
        <stop offset="24%" stopColor="#e45645" />
        <stop offset="68%" stopColor="#67102b" />
        <stop offset="100%" stopColor="#14020c" />
      </radialGradient>
      <linearGradient id="hubGlassArc" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
        <stop offset="45%" stopColor="#ffffff" stopOpacity="0.11" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
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
      <linearGradient id="spotlightReflection" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="44%" stopColor="#ffffff" stopOpacity="0.28" />
        <stop offset="52%" stopColor="#fff7c7" stopOpacity="0.18" />
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
      <filter id="hubDepth" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.52" />
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
      <ellipse cx={CENTER} cy="289" rx="238" ry="214" fill="#050208" opacity="0.82" />
      <circle cx={CENTER} cy={CENTER} r="249" fill="url(#rimBlackChrome)" />
      <circle cx={CENTER} cy={CENTER} r="241" fill="url(#rimOuterMetal)" />
      <circle cx={CENTER} cy={CENTER} r="235" fill="none" stroke="url(#rimHotEdge)" strokeWidth="6" opacity="0.98" />
      <circle cx={CENTER} cy={CENTER} r="226" fill="none" stroke="url(#rimGoldRail)" strokeWidth="13" />
      <circle cx={CENTER} cy={CENTER} r="216" fill="url(#rimInsetCavity)" stroke="#10040d" strokeWidth="7" />
      <circle cx={CENTER} cy={CENTER} r="210" fill="none" stroke="#fff4bc" strokeWidth="2.9" opacity="0.82" />
      <circle cx={CENTER} cy={CENTER} r="201" fill="none" stroke="#24060f" strokeWidth="9" opacity="0.44" />
      <circle cx={CENTER} cy={CENTER} r="193" fill="none" stroke="#fff1a7" strokeWidth="1.2" opacity="0.26" />
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
      <path d={path} fill="url(#sliceSheen)" opacity="0.42" className="wheel-slice-sheen" />
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
      <path className="wheel-glass-highlight" d="M 86 105 C 155 27 312 17 420 105 C 330 75 202 79 104 140 Z" fill="url(#glassSweep)" />
      <path
        className="wheel-gloss-band"
        d="M 67 216 C 168 158 341 150 438 211 C 349 194 188 203 74 273 Z"
        fill="url(#spotlightReflection)"
        opacity="0.42"
      />
      <path className="wheel-hot-reflection" d="M 162 71 C 238 42 327 50 390 92 C 316 82 229 85 164 112 Z" fill="#fff8d2" opacity="0.16" />
      <circle cx={CENTER} cy={CENTER} r="205" fill="none" stroke="#fff9cf" strokeWidth="2.2" opacity="0.48" />
      <circle cx={CENTER} cy={CENTER} r="176" fill="none" stroke="#210815" strokeWidth="12" opacity="0.18" />
      <circle cx={CENTER} cy={CENTER} r="91" fill="none" stroke="#fff3ac" strokeWidth="1.4" opacity="0.22" />
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
    <g className="wheel-hub" filter="url(#hubDepth)">
      <circle cx={CENTER} cy={CENTER + 4} r="92" fill="#050207" opacity="0.48" />
      <circle cx={CENTER} cy={CENTER} r="88" fill="url(#hubGold)" stroke="#fff2a8" strokeWidth="4.5" />
      <circle cx={CENTER} cy={CENTER} r="76" fill="#250711" stroke="#5b2108" strokeWidth="5" opacity="0.96" />
      <circle cx={CENTER} cy={CENTER} r="66" fill="url(#hubInset)" stroke="#ffe58a" strokeWidth="2.4" opacity="0.98" />
      <circle cx={CENTER} cy={CENTER} r="57" fill="url(#hubRubyGlass)" opacity="0.86" />
      <path d="M 204 229 C 225 205 278 202 302 231 C 274 220 228 221 204 239 Z" fill="url(#hubGlassArc)" opacity="0.78" />
      <circle cx={CENTER - 20} cy={CENTER - 24} r="19" fill="#fff2b6" opacity="0.22" />
      <circle cx={CENTER} cy={CENTER} r="43" fill="none" stroke="#180711" strokeWidth="12" opacity="0.15" />
      <circle cx={CENTER} cy={CENTER} r="72" fill="none" stroke="#fff5ba" strokeWidth="1.2" opacity="0.46" />
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
        const point = polarToCartesian(CENTER, CENTER, 234, angle);
        const scale = index % 2 === 0 ? 1 : 0.88;
        return (
          <g key={angle} className="wheel-bulb" filter="url(#bulbGlow)" style={{ animationDelay: `${index * 70}ms` }}>
            <circle cx={point.x} cy={point.y + 1.5 * scale} r={10.8 * scale} fill="#140603" opacity="0.62" />
            <circle cx={point.x} cy={point.y} r={9.6 * scale} fill="#5b2607" opacity="0.9" />
            <circle cx={point.x} cy={point.y} r={6.7 * scale} fill="url(#bulbFace)" />
            <circle cx={point.x - 2.2 * scale} cy={point.y - 2.7 * scale} r={2.2 * scale} fill="#fffce8" opacity="0.96" />
            <circle cx={point.x + 1.6 * scale} cy={point.y + 1.8 * scale} r={3.2 * scale} fill="#ff9f1f" opacity="0.14" />
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
      <rect
        x={point.x - 40}
        y={point.y - 24}
        width="80"
        height={lines.length === 1 ? 42 : 52}
        rx="8"
        className="slice-label-plaque"
      />
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
