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
          50: '#f2f9f4',
          100: '#e2f2e6',
          200: '#c7e5d1',
          300: '#9ed2b1',
          400: '#6bb688',
          500: '#3f9163', // Professional Forest Green
          600: '#31724f',
          700: '#295c41',
          800: '#214935',
          900: '#1b3d2c',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        }
      }
    },
  },
  plugins: [],
}
