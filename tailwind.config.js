/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        market: {
          50: '#f2f9f3',
          100: '#e1f3e5',
          200: '#c4e7cc',
          300: '#97d4a4',
          400: '#63ba76',
          500: '#3e9e53',
          600: '#2e8040',
          700: '#276635',
          800: '#23522d',
          900: '#1e4427',
          950: '#0c2513',
        },
        earth: {
          50: '#fdf8f4',
          100: '#f9eee5',
          200: '#f3d9c7',
          300: '#eabda1',
          400: '#df9976',
          500: '#d57753',
          600: '#c55c42',
          700: '#a44738',
          800: '#843b32',
          900: '#6d342c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
