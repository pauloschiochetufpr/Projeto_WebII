/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        googleSansCode: ['"Google Sans Code"', "monospace"],
        sansation: ["Sansation", "sans-serif"],
        robotoFlex: ['"Roboto Flex"', "sans-serif"],
        lobster: ["Lobster", "cursive"],
      },
      colors: {
        "azul-main": "#2D85FF",
        "azul-suav": "#A5CAFC",
        "verde-sec": "#19FFA2",
        "verde-esc": "#00B56C",
        "verde-qua": "#54FEBA",
        "roxo-terc": "#6433FF",
      },
      keyframes: {
        dropdown: {
          "0%": { opacity: 0, transform: "scaleY(0.9)" },
          "100%": { opacity: 1, transform: "scaleY(1)" },
        },
      },
      animation: {
        dropdown: "dropdown 0.15s ease-out",
      },
    },
  },
  plugins: [],
};
