/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1},
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%, 70%': { transform: 'rotate(-5deg)' },
          '40%, 80%': { transform: 'rotate(5deg)' },
        },

      },

      animation: {
        fadeIn: 'fadeIn 0.15s ease-out forwards',
        shake: 'shake 0.5s ease-in-out',
      },

    },

  },
  plugins: [],
};
