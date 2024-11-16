/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    screens: {
      xs: "480px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        coffee: {
          50: "#E8D6D0",
          200: "#C89F94",
          400: "#A25F4B",
          600: "#744B38",
        },
      },
      keyframes: {
        sliceDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        sliceDown: "sliceDown 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
