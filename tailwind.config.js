/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.hbs",
    "./client/src/**/*.{jsx,tsx,js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#5098e5",
          DEFAULT: "#4e91d8",
          dark: "#3e78b7"
        }
      }
    },
  },
  plugins: [],
}

