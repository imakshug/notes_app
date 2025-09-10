
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          300: '#98ffec',
          400: '#5fffd7',
        },
        lavender: {
          300: '#e6e6fa',
          400: '#b57edc',
        },
      },
    },
  },
  plugins: [],
};

 