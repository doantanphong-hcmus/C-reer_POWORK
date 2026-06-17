import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#141414',
        'background-secondary': '#1e1e1e',
        'background-tertiary': '#272727',
        foreground: '#f0ede8',
        'foreground-secondary': '#9c9a92',
        'foreground-tertiary': '#5e5d58',
        accent: '#7c6ff7',
        'accent-bg': 'rgba(124, 111, 247, 0.15)',
        success: '#22c55e',
        'success-bg': 'rgba(34, 197, 94, 0.12)',
        warning: '#f59e0b',
        'warning-bg': 'rgba(245, 158, 11, 0.12)',
        error: '#f87171',
        'error-bg': 'rgba(248, 113, 113, 0.12)',
        info: '#60a5fa',
        'info-bg': 'rgba(96, 165, 250, 0.12)',
      },
      borderColor: {
        border: 'rgba(255, 255, 255, 0.08)',
        'border-secondary': 'rgba(255, 255, 255, 0.14)',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        pill: '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        xs: ['11px', { lineHeight: '15px' }],
        sm: ['12px', { lineHeight: '16px' }],
        base: ['13px', { lineHeight: '19px' }],
        md: ['15px', { lineHeight: '22px' }],
        lg: ['16px', { lineHeight: '24px' }],
        xl: ['16px', { lineHeight: '24px' }],
        '2xl': ['18px', { lineHeight: '27px' }],
        '3xl': ['20px', { lineHeight: '30px' }],
        '4xl': ['28px', { lineHeight: '36px' }],
      },
      borderWidth: {
        hairline: '0.5px',
      },
    },
  },
  plugins: [],
};

export default config;
