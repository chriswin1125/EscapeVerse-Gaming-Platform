/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        samsung: {
          blue: '#2189FF',
          hover: '#0D72EB',
          dark: '#000000',
          surface: '#0E0E10',
          card: '#161618',
          border: 'rgba(255, 255, 255, 0.12)',
          muted: '#86868B',
          light: '#F5F5F7'
        },
        cyber: {
          dark: '#000000',
          card: '#141416',
          border: 'rgba(255, 255, 255, 0.12)',
          purple: '#2189FF',
          cyan: '#2189FF',
          blue: '#2189FF',
          neon: '#10b981',
          rose: '#ef4444',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'samsung': '28px',
      }
    },
  },
  plugins: [],
}
