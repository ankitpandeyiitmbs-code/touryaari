import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New Luxury Design System - Pine & Gold
        pine: {
          DEFAULT: '#1B3A2D',
          dark: '#0F2218',
          light: '#2A5444',
        },
        gold: {
          DEFAULT: '#C89033',
          light: '#E8B055',
          pale: '#F5E6C8',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EAE0',
        },
        slate: {
          DEFAULT: '#1E2A38',
          mid: '#3A4A5C',
        },
        stone: {
          DEFAULT: '#8A7A6A',
          light: '#BEB0A0',
        },
        // Legacy colors for backward compatibility
        primary: {
          DEFAULT: '#1B3A2D',
          light: '#2A5444',
          dark: '#0F2218',
        },
        secondary: {
          DEFAULT: '#0F2218',
        },
        accent: {
          DEFAULT: '#C89033',
          light: '#E8B055',
          dark: '#A07020',
        },
        'light-bg': '#FAF7F2',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        display: ['var(--font-cinzel)', 'serif'],
        // Legacy font names
        heading: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease both',
        'fade-up-delay-1': 'fadeUp 0.8s 0.1s ease both',
        'fade-up-delay-2': 'fadeUp 0.8s 0.2s ease both',
        'fade-up-delay-3': 'fadeUp 0.8s 0.3s ease both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(27, 58, 45, 0.08)',
        'card-hover': '0 8px 32px rgba(27, 58, 45, 0.14)',
        'nav': '0 2px 15px rgba(0, 0, 0, 0.1)',
        'lg': '0 20px 60px rgba(27, 58, 45, 0.20)',
        'md': '0 8px 32px rgba(27, 58, 45, 0.14)',
        'sm': '0 2px 12px rgba(27, 58, 45, 0.08)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        'lg': '12px',
      },
    },
  },
  plugins: [],
};

export default config;
