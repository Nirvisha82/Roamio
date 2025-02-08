/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        NavyBlue: "#38496a",
        Teal: "#4A7C88",
        Black: "#000000",
        Button: "#E5E1DA",
        Bg: "#F1F0E8",
      },
    },
  },
  plugins: [],
}
