import { memo, useId } from 'react';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Polygon, RadialGradient, Stop } from 'react-native-svg';
import type { GemType, JewelShape, MetalTone } from '@/features/catalog/types';
import { gemStops, metalStops } from './palettes';

export interface JewelArtProps {
  shape: JewelShape;
  tone: MetalTone;
  gem: GemType;
  size?: number | string;
}

const TEAR = 'M0 -24 C 15 -7 17 11 0 26 C -17 11 -15 -7 0 -24 Z';
const BRILLIANT = '0,-20 14,-12 20,2 8,20 -8,20 -20,2 -14,-12';

interface GemShapeProps {
  g: [string, string, string] | null;
  stone: string;
  edge: string;
  x: number;
  y: number;
  s?: number;
  tear?: boolean;
  rotate?: number;
}

function GemShape({ g, stone, edge, x, y, s = 1, tear = false, rotate = 0 }: GemShapeProps) {
  if (!g) return null;
  return (
    <G transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      {tear ? <Path d={TEAR} fill={`url(#${stone})`} stroke={edge} strokeWidth={2.2} /> : <Polygon points={BRILLIANT} fill={`url(#${stone})`} stroke={edge} strokeWidth={2.2} strokeLinejoin="round" />}
      <Path d={tear ? 'M0 -24 L0 26 M-10 -2 L10 -2' : 'M-20 2 L20 2 M-14 -12 L-8 20 M14 -12 L8 20 M0 -20 L0 20'} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={1.1} />
      <Ellipse cx={-5} cy={-8} rx={4} ry={7} fill="#FFFFFF" opacity={0.55} transform="rotate(-25 -5 -8)" />
    </G>
  );
}

/**
 * Vector jewellery illustrations. They stand in for photography until real
 * product images are bundled (see scripts/sync-indriya.mjs) and also act as the
 * graceful fallback when an image fails to load.
 */
function JewelArtBase({ shape, tone, gem, size = '100%' }: JewelArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const m = metalStops[tone];
  const g = gem === 'none' ? null : gemStops[gem];
  const metal = `metal${uid}`;
  const stone = `stone${uid}`;
  const shine = `shine${uid}`;

  let body: React.JSX.Element;
  switch (shape) {
    case 'ring':
      body = (
        <>
          <Circle cx={100} cy={128} r={48} fill="none" stroke={`url(#${metal})`} strokeWidth={13} />
          <Circle cx={100} cy={128} r={41} fill="none" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={1.5} />
          <Path d="M82 88 L118 88 L110 70 L90 70 Z" fill={`url(#${metal})`} stroke={m[2]} strokeWidth={1.5} />
          {g ? <GemShape g={g} stone={stone} edge={m[2]} x={100} y={52} s={1.35} /> : <Circle cx={100} cy={72} r={9} fill={`url(#${metal})`} stroke={m[2]} />}
        </>
      );
      break;
    case 'necklace':
      body = (
        <>
          <Path d="M28 34 Q100 190 172 34" fill="none" stroke={`url(#${metal})`} strokeWidth={5} strokeLinecap="round" />
          <Path d="M28 34 Q100 190 172 34" fill="none" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="2 7" />
          <GemShape g={g} stone={stone} edge={m[2]} x={64} y={88} s={0.55} rotate={-18} />
          <GemShape g={g} stone={stone} edge={m[2]} x={136} y={88} s={0.55} rotate={18} />
          <Circle cx={100} cy={115} r={7} fill={`url(#${metal})`} stroke={m[2]} />
          <GemShape g={g} stone={stone} edge={m[2]} x={100} y={146} s={1.15} tear />
        </>
      );
      break;
    case 'earrings':
      body = (
        <>
          {[62, 138].map((x) => (
            <G key={x}>
              <Circle cx={x} cy={34} r={9} fill="none" stroke={`url(#${metal})`} strokeWidth={4} />
              <Path d={`M${x} 43 L${x} 74`} stroke={`url(#${metal})`} strokeWidth={4} strokeLinecap="round" />
              <Circle cx={x} cy={80} r={8} fill={`url(#${metal})`} stroke={m[2]} />
              <GemShape g={g} stone={stone} edge={m[2]} x={x} y={118} s={1.05} tear />
            </G>
          ))}
        </>
      );
      break;
    case 'mangalsutra':
      body = (
        <>
          <Path d="M32 30 Q100 175 168 30" fill="none" stroke={`url(#${metal})`} strokeWidth={3} strokeLinecap="round" />
          {Array.from({ length: 13 }, (_, i) => {
            const t = 0.08 + (i / 12) * 0.84;
            const x = (1 - t) * (1 - t) * 32 + 2 * (1 - t) * t * 100 + t * t * 168;
            const y = (1 - t) * (1 - t) * 30 + 2 * (1 - t) * t * 175 + t * t * 30;
            return <Circle key={i} cx={x} cy={y} r={i % 3 === 1 ? 5 : 3.6} fill={i % 3 === 1 ? m[1] : '#14110F'} stroke={i % 3 === 1 ? m[2] : 'none'} />;
          })}
          <Circle cx={100} cy={118} r={9} fill={`url(#${metal})`} stroke={m[2]} />
          <Path d="M100 124 C 126 142 122 164 100 176 C 78 164 74 142 100 124 Z" fill={`url(#${metal})`} stroke={m[2]} strokeWidth={1.5} />
          <GemShape g={g} stone={stone} edge={m[2]} x={100} y={150} s={0.8} tear />
        </>
      );
      break;
    case 'bangle':
      body = (
        <>
          <Ellipse cx={100} cy={108} rx={70} ry={64} fill="none" stroke={`url(#${metal})`} strokeWidth={15} />
          <Ellipse cx={100} cy={108} rx={63} ry={57} fill="none" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={1.4} />
          {g
            ? [-150, -120, -90, -60, -30].map((a) => {
                const r = (a * Math.PI) / 180;
                return <GemShape g={g} stone={stone} edge={m[2]} key={a} x={100 + 70 * Math.cos(r)} y={108 + 64 * Math.sin(r)} s={0.42} rotate={a + 90} />;
              })
            : [-140, -110, -80, -50].map((a) => {
                const r = (a * Math.PI) / 180;
                return <Circle key={a} cx={100 + 70 * Math.cos(r)} cy={108 + 64 * Math.sin(r)} r={4} fill={m[0]} opacity={0.85} />;
              })}
        </>
      );
      break;
    default:
      body = (
        <>
          <Path d="M46 22 L100 92 L154 22" fill="none" stroke={`url(#${metal})`} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx={100} cy={98} r={9} fill="none" stroke={`url(#${metal})`} strokeWidth={4} />
          <Path d="M100 108 L100 118" stroke={`url(#${metal})`} strokeWidth={4} />
          {g ? <Path d="M100 112 C 140 138 134 170 100 184 C 66 170 60 138 100 112 Z" fill={`url(#${metal})`} stroke={m[2]} strokeWidth={1.5} /> : <Circle cx={100} cy={150} r={36} fill={`url(#${metal})`} stroke={m[2]} strokeWidth={1.5} />}
          {g ? <GemShape g={g} stone={stone} edge={m[2]} x={100} y={150} s={1.15} tear /> : <Circle cx={100} cy={150} r={26} fill="none" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1.4} />}
        </>
      );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={m[0]} />
          <Stop offset="0.5" stopColor={m[1]} />
          <Stop offset="1" stopColor={m[2]} />
        </LinearGradient>
        {g ? (
          <LinearGradient id={stone} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={g[0]} />
            <Stop offset="0.55" stopColor={g[1]} />
            <Stop offset="1" stopColor={g[2]} />
          </LinearGradient>
        ) : null}
        <RadialGradient id={shine} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.5} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={100} cy={188} rx={52} ry={6} fill="#000" opacity={0.07} />
      {body}
    </Svg>
  );
}

export const JewelArt = memo(JewelArtBase);
