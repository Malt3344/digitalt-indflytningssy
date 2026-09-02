import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep teal-green — trustworthy, distinctly Danish property-portal
        brand: {
          50: '#eef8f4',
          100: '#d3ede2',
          200: '#a6dcc6',
          300: '#71c3a4',
          400: '#43a481',
          500: '#248767',
          600: '#186b52',
          700: '#155744',
          800: '#144638',
          900: '#123a30',
          950: '#08201a',
        },
        mint: {
          200: '#bff3e2',
          300: '#8ee8cd',
          400: '#5ad6b3',
        },
        ink: {
          DEFAULT: '#15201c',
          soft: '#465049',
          muted: '#6b746d',
        },
        line: {
          DEFAULT: '#e6e6df',
          strong: '#d6d7cd',
        },
        sand: {
          DEFAULT: '#f7f5ef',
          deep: '#efece2',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f7f5ef',
          sunken: '#efece2',
        },
        success: {
          50: '#ecfdf3',
          100: '#d1fadf',
          600: '#15803d',
          700: '#116932',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        md: '0.5rem',
        lg: '0.625rem',
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(21, 32, 28, 0.04), 0 8px 24px -8px rgba(21, 32, 28, 0.08)',
        elevated: '0 2px 8px rgba(21, 32, 28, 0.05), 0 32px 64px -16px rgba(21, 32, 28, 0.16)',
        glow: '0 24px 70px -18px rgba(24, 107, 82, 0.4)',
        ring: '0 0 0 1px rgba(21, 32, 28, 0.06)',
      },
      maxWidth: {
        content: '75rem',
      },
      letterSpacing: {
        tightish: '-0.015em',
        tighter2: '-0.03em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
export default config;
