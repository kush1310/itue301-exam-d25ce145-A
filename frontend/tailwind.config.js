/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zomato: {
          red: '#cb202d',
          darkred: '#a81723',
          lightred: '#fef2f2',
          mineshaft: '#2d2d2d',
          desertstorm: '#f4f4f2',
          muted: '#828282',
          green: '#24963f',
          lightgreen: '#edf7ed',
          border: '#e8e8e8',
        }
      },
      fontFamily: {
        sans: ['Okra', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'default': '8px',
        'md': '12px',
        'lg': '16px',
      }
    },
  },
  plugins: [],
}
