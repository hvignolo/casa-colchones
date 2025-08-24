/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff5e3a',
          light: '#ff7a56',
          dark: '#e5441f',
        },
        secondary: {
          DEFAULT: '#f8f9fa',
        },
        gradient: {
          start: '#ff5e3a',
          end: '#ff8a80',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ff5e3a 0%, #ff8a80 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #ff7a56 0%, #ffa726 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}