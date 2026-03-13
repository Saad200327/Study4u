import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        apple: {
          bg: '#f5f5f7',
          dark: '#1d1d1f',
          blue: '#0071e3',
          gray: '#6e6e73',
          light: '#fbfbfd',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'flip': 'flip 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        flip: { '0%': { transform: 'rotateY(0deg)' }, '100%': { transform: 'rotateY(180deg)' } },
      }
    },
  },
  plugins: [],
};

export default config;
