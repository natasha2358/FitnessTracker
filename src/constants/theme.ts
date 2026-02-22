export const colors = {
  bg: '#0F0F14',
  surface: '#1A1A24',
  surfaceAlt: '#22222F',
  border: '#2E2E3E',
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  accent: '#FF6584',
  text: '#F0F0F8',
  textSub: '#8888A8',
  textMuted: '#55556A',
  success: '#4CAF84',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodyMed: { fontSize: 15, fontWeight: '500' as const, color: colors.text },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.textSub },
  label: { fontSize: 13, fontWeight: '600' as const, color: colors.textSub, letterSpacing: 0.5 },
};
