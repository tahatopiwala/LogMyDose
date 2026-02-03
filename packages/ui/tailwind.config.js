/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#0A1F0A',
          100: '#0D2E0D',
          200: '#134013',
          300: '#1A5C1A',
          400: '#22B822',
          500: '#39FF14',
          600: '#5FFF42',
          700: '#85FF70',
          800: '#ABFF9E',
          900: '#D1FFCC',
          950: '#E8FFE5',
        },
        surface: {
          base: '#0D0D0D',
          raised: '#141414',
          card: '#1A1A1A',
          elevated: '#242424',
          border: '#181818',
          hover: '#252525',
        },
      },
      boxShadow: {
        'glow': '0 0 20px',
        'glow-sm': '0 0 10px',
        'glow-lg': '0 0 30px',
      },
    },
  },
  plugins: [],
}
