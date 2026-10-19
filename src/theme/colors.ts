/**
 * Design tokens. Brand colours are PLACEHOLDERS until the real Indriya palette
 * is confirmed — change them here and the whole app follows.
 */
export const colors = {
  background: '#FBF8F3',
  surface: '#FFFFFF',
  surfaceAlt: '#F4EEE5',
  ink: '#1E1A18',
  inkSoft: '#4A423D',
  muted: '#8A817A',
  line: '#EAE2D6',
  primary: '#5B1A2B',
  primaryDark: '#3E0F1C',
  primarySoft: '#F3E6E9',
  gold: '#B8893B',
  goldLight: '#E7CF96',
  goldPale: '#F7EDD3',
  rose: '#C98A7A',
  success: '#2E7D5B',
  successSoft: '#E3F2EA',
  danger: '#B3261E',
  dangerSoft: '#FBE9E7',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(20,12,10,0.55)',
} as const;

export type ColorToken = keyof typeof colors;
