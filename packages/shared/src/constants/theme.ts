// nSchool 品牌色系
export const COLORS = {
  // 主色 - 紫色系
  primary: {
    50: '#F3F0FF',
    100: '#E8E0FF',
    200: '#D1C2FE',
    300: '#B9A3FD',
    400: '#A29BFE',
    500: '#6C5CE7', // 主色
    600: '#5A4BD1',
    700: '#4834B5',
    800: '#362799',
    900: '#241A7D',
  },
  // 金色 - 財富象徵
  gold: {
    50: '#FFF9E6',
    100: '#FFF3CC',
    200: '#FFE799',
    300: '#FFDB66',
    400: '#FDCB6E', // 輔色
    500: '#F0B429',
    600: '#D4991A',
    700: '#B87F0F',
    800: '#9C6508',
    900: '#804C04',
  },
  // 成功/漲
  success: {
    light: '#E8F5E9',
    main: '#4CAF50',
    dark: '#2E7D32',
  },
  // 危險/跌
  danger: {
    light: '#FFEBEE',
    main: '#F44336',
    dark: '#C62828',
  },
  // 中性色
  neutral: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#ADB5BD',
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#212529',
    900: '#0D1117',
  },
  // 背景
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F7FF', // 淺紫背景
    gradient: 'linear-gradient(135deg, #F8F7FF 0%, #E8E0FF 100%)',
  },
} as const;

export const FONTS = {
  sans: '"Noto Sans TC", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
} as const;

export const RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px rgba(108, 92, 231, 0.05)',
  md: '0 4px 6px rgba(108, 92, 231, 0.07)',
  lg: '0 10px 15px rgba(108, 92, 231, 0.1)',
  xl: '0 20px 25px rgba(108, 92, 231, 0.15)',
} as const;
