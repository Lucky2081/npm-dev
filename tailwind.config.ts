import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#155EEF',
          dark: '#0E4DB8',
          light: '#EFF6FF',
        },
        accent: '#0F4761',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          disabled: '#94A3B8',
        },
        bg: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'var(--font-noto-sans-sc)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      fontSize: {
        'hero': ['64px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        'section': '100px',
        'card': '24px',
        'element': '16px',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'badge': '16px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'focus': '0 0 0 3px rgba(21, 94, 239, 0.1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'default': '250ms',
        'slow': '400ms',
      },
    },
  },
  plugins: [],
}
export default config
