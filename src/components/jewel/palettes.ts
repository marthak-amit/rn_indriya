import type { GemType, MetalTone } from '@/features/catalog/types';

export const metalStops: Record<MetalTone, [string, string, string]> = {
  yellow: ['#FBEBB5', '#DDAE45', '#9A6A1B'],
  rose: ['#F9DACE', '#D99C88', '#9C5B4B'],
  white: ['#FFFFFF', '#D3D9E0', '#8993A0'],
};

export const gemStops: Record<Exclude<GemType, 'none'>, [string, string, string]> = {
  diamond: ['#FFFFFF', '#CDE6FF', '#86B1E3'],
  ruby: ['#FF9FAE', '#D81E4A', '#740A24'],
  emerald: ['#A3F2C5', '#1FA971', '#0A5236'],
  sapphire: ['#B3CBFF', '#2F5BD8', '#10265F'],
  pearl: ['#FFFFFF', '#F2E9DF', '#C4B3A3'],
};

export const backdropStops: Record<MetalTone, [string, string]> = {
  yellow: ['#FCF5E4', '#F0DFB4'],
  rose: ['#FDF0EC', '#F1D3C9'],
  white: ['#F6F8FB', '#DDE3EC'],
};
