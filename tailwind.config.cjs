/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: { light: '#6258D9', dark: '#A69BFF' },
        surface: { light: '#ffffff', dark: '#1a1a2e' },
        text: { light: '#242238', dark: '#F4F2FF' },
      },
    },
  },
  plugins: [],
};
