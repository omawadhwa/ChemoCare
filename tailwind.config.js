/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Libre Baskerville', 'serif'],
      },
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d1c7',
          300: '#a3b3a3',
          400: '#7e917e',
          500: '#637663',
          600: '#4d5c4d',
          700: '#404940',
          800: '#363c36',
          900: '#2f332f',
        },
        warm: {
          50: '#faf6f3',
          100: '#f2e9e4',
          200: '#e6d5cc',
          300: '#d3b7aa',
          400: '#bc9585',
          500: '#a47a68',
          600: '#8b6354',
          700: '#735147',
          800: '#5f443d',
          900: '#503b35',
        }
      }
    },
  },
  plugins: [],
};