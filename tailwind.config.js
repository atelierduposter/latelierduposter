/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#BBD0CB',
          50: '#F0F5F3',
          100: '#E8F0ED',
          200: '#D5E5DF',
          300: '#BBD0CB',
          400: '#9BB5AD',
          500: '#7A9A8F',
          600: '#5F7F72',
          700: '#4A6358',
          800: '#3D5047',
          900: '#2F3D37',
        },
        secondary: {
          DEFAULT: '#F9FAFB',
        },
        accent: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        artisan: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
