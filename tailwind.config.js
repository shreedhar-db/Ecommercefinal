/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          black: '#1a1c1c',
          accent: '#9d431f',
        },
        text: {
          secondary: '#45464d',
          tertiary: '#76777d',
        },
        bg: {
          light: '#f3f4f3',
          lighter: '#eeeeed',
        },
        border: {
          DEFAULT: '#e2e2e2',
        },
        success: '#22c55e',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Hanken Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
