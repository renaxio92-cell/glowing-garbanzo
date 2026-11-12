import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0b0f19',
        panel: '#121a2d',
        rose: '#f43f5e',
        accent: '#7dd3fc',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(125, 211, 252, 0.12), 0 20px 45px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
