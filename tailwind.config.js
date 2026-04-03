/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sino-dark': '#1a472a',
        'sino-gold': '#d4af37',
        'sino-light': '#f5f7f6',
        'risk-high': '#ef4444',
        'risk-medium': '#f97316',
        'risk-low': '#84cc16',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
