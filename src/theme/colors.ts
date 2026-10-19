/**
 * Design tokens. Brand colours follow Indriya's palette (Midnight Blue #022E71, Bridal Heath #FFF9F3,
 * Black). The champagne `gold` is a restrained accent for jewellery details (stars, badges).
 */
export const colors = {
  background: '#FFF9F3',
  surface: '#FFFFFF',
  surfaceAlt: '#F6EEE3',
  ink: '#0A0A0A',
  inkSoft: '#3A3F4B',
  muted: '#7B8190',
  line: '#E8DED0',
  primary: '#022E71',
  primaryDark: '#011B45',
  primarySoft: '#E7EDF8',
  gold: '#B08A4A',
  goldLight: '#E9D6A8',
  goldPale: '#F7EFD9',
  rose: '#C98A7A',
  success: '#2E7D5B',
  successSoft: '#E3F2EA',
  danger: '#B3261E',
  dangerSoft: '#FBE9E7',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(2,14,36,0.55)',
} as const;

export type ColorToken = keyof typeof colors;
