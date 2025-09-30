/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // <- pega todos os templates e components
  ],
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
        "verde-sec": "#19FFA2",
        "roxo-terc": "#6433FF",
      },
    },
  },
  plugins: [],
};
