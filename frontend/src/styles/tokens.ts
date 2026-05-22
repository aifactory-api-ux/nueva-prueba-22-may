export const tokens = {
  colors: {
    primary: '#1A202C',
    secondary: '#2D3748',
    accent: '#F6AD55',
    background: '#F7FAFC',
    surface: '#FFFFFF',
    error: '#E53E3E',
    success: '#38A169',
    warning: '#DD6B20',
    text: '#2D3748',
    text_primary: '#1A202C',
    text_secondary: '#4A5568',
    text_on_primary: '#FFFFFF',
    muted: '#A0AEC0',
    border: '#E2E8F0'
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSizeBase: '1rem',
    fontWeightRegular: 400,
    fontWeightBold: 700,
    lineHeightBase: 1.5,
    heading1: '2.25rem',
    heading2: '1.5rem',
    heading3: '1.25rem'
  },
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem'
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
  }
};

export type Tokens = typeof tokens;