/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F6F4EB",
        "blue-dark": "#005187",
        "blue-medium": "#0c7cc7",
        "blue-light": "#84b6f4",
        "blue-lightest": "#c4dafa",
        "pink-dark": "#957698",
        "pink-medium": "#a080a3",
        "pink-light": "#aa8bad",
        "pink-lighter": "#b595b8",
        "pink-lightest": "#c0a0c3",
        "pink-soft": "#fccafcf",
        "pink-softest": "#d9c2db",
        "white-dark": "#e6d6e7",
        "white-light": "#f2ebf3",
        white: "#ffffff",
        "white-bright": "#feffff",
        red: "#be185d",
        "red-dark": "#c40e38",
        "red-light": "#9e4f61",
        yellow: "#9e8824",
        greenL: "#14a34a",
      },
      fontFamily: {
        Comfortaa: ["Comfortaa", "Helvetica"],
      },
    },
  },
  plugins: [],
};
