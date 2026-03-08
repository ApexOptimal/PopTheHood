/**
 * Centralized Theme for Pop the Hood
 * All color, spacing, typography, and border radius tokens
 */

const palette = {
  // Neutral scale
  neutral900: '#1a1a1a',
  neutral800: '#2d2d2d',
  neutral700: '#3d3d3d',
  neutral600: '#4d4d4d',
  neutral400: '#808080',
  neutral350: '#909090',
  neutral300: '#b0b0b0',
  neutral200: '#cccccc',
  neutral100: '#ffffff',

  // Brand
  blue500: '#0066cc',
  blue400: '#1a80e6',
  blue900: '#1a3a5c',

  // Semantic
  green600: '#00aa00',
  green500: '#00aa66',
  greenBright: '#4dff4d',
  greenDark: '#1a4d1a',
  orange500: '#ff8800',
  orange400: '#ffaa00',
  orange300: '#ffaa44',
  red500: '#ff4444',
  red400: '#ff6b6b',
  red700: '#cc0000',
};

export const theme = {
  colors: {
    // Backgrounds
    background: palette.neutral900,
    surface: palette.neutral800,
    surfaceElevated: palette.neutral700,
    border: palette.neutral600,
    overlay: 'rgba(0, 0, 0, 0.8)',

    // Primary action
    primary: palette.blue500,
    primaryLight: palette.blue400,
    primaryDark: palette.blue900,

    // Text
    textPrimary: palette.neutral100,
    textSecondary: palette.neutral300,
    textTertiary: palette.neutral400,
    textMuted: palette.neutral350,
    textDisabled: palette.neutral600,

    // Semantic
    success: palette.green500,
    successBright: palette.greenBright,
    successDark: palette.greenDark,
    successIndicator: palette.green600,
    warning: palette.orange500,
    warningLight: palette.orange400,
    warningMuted: palette.orange300,
    danger: palette.red500,
    dangerLight: palette.red400,
    dangerDark: palette.red700,

    // Tab bar
    tabActive: palette.blue500,
    tabInactive: palette.neutral300,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
  },

  typography: {
    h1: { fontSize: 36, fontWeight: '700', letterSpacing: 0.5 },
    h2: { fontSize: 28, fontWeight: '600' },
    h3: { fontSize: 20, fontWeight: '600' },
    h4: { fontSize: 18, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: '400' },
    bodySmall: { fontSize: 14, fontWeight: '400' },
    caption: { fontSize: 12, fontWeight: '400' },
    button: { fontSize: 18, fontWeight: '600', letterSpacing: 0.5 },
    buttonSmall: { fontSize: 14, fontWeight: '600' },
  },
};
