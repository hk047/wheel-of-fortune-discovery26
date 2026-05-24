import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        stage: '0 24px 90px rgba(0,0,0,0.42)',
        gold: '0 0 18px rgba(255,214,98,0.7), 0 0 42px rgba(255,151,48,0.28)',
      },
    },
  },
  plugins: [],
} satisfies Config;
