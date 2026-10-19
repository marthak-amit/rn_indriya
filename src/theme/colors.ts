/**
 * Design tokens. Brand colours follow Indriya's palette (Midnight Blue #022E71, Bridal Heath #FFF9F3,
 * Black), sampled from the live site (peach section tint #FFF1E3, orange call-to-action #E4562E). The champagne `gold` is a restrained accent for jewellery details (stars, badges).
 */
export const colors = {
  background: '#FFF9F3',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF1E3',
  ink: '#262626',
  inkSoft: '#434343',
  muted: '#5F6368',
  line: '#F0DCC6',
  primary: '#022E71',
  primaryDark: '#011B45',
  primarySoft: '#E7EDF8',
  gold: '#B08A4A',
  goldLight: '#E9D6A8',
  goldPale: '#F7EFD9',
  rose: '#C98A7A',
  accent: '#E4562E',
  success: '#2E7D5B',
  successSoft: '#E3F2EA',
  danger: '#B3261E',
  dangerSoft: '#FBE9E7',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(2,14,36,0.55)',
} as const;

export type ColorToken = keyof typeof colors;
