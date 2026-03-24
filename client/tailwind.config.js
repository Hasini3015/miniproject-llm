/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#f5a623', dark: '#c47d0e', light: '#ffc35a' },
        teal: { DEFAULT: '#00c9a7', dark: '#009e84' },
        surface: { DEFAULT: '#161616', 2: '#1e1e1e', 3: '#252525' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
