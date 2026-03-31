/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F1419',
        },
        cyan: {
          400: '#00D9FF',
          500: '#00D9FF',
        },
        red: {
          400: '#FF6B6B',
          500: '#FF6B6B',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
