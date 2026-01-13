/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f5a8ba',
          400: '#ed7592',
          500: '#BE3455',
          600: '#b82d50',
          700: '#9b2341',
          800: '#82203a',
          900: '#6f1f35',
          950: '#3e0c1a',
        },
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        progress: 'progress linear forwards',
      },
    },
  },
  plugins: [],
}
