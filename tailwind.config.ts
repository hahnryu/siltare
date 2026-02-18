import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Noto Serif KR'", 'Georgia', 'serif'],
        'serif-en': ["'Cormorant Garamond'", 'Georgia', 'serif'],
      },
      colors: {
        cream: '#FAF6F0',
        'warm-white': '#FFFDF9',
        bark: '#2C2418',
        'bark-light': '#4A3F30',
        amber: '#C4956A',
        'amber-light': '#D4AD84',
        leaf: '#8B7355',
        mist: '#E8E0D4',
        'mist-light': '#F0EBE3',
        stone: '#9E9585',
        'stone-light': '#B8B0A2',
      },
    },
  },
  plugins: [],
};
export default config;
