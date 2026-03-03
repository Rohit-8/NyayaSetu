/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#FFF8F0",
          100: "#FFF0DB",
          200: "#FFE0B8",
          300: "#FFD094",
          400: "#FFC071",
          500: "#FF9933",
          600: "#E07800",
          700: "#AD5D00",
          800: "#7A4100",
          900: "#472600",
        },
        forest: {
          50: "#F0F9F0",
          100: "#D0EED0",
          200: "#A2DDA2",
          300: "#73CC73",
          400: "#45BB45",
          500: "#138808",
          600: "#0F6C06",
          700: "#0B5005",
          800: "#073403",
          900: "#031802",
        },
        navy: {
          50: "#F0F3F9",
          100: "#D9E0F0",
          200: "#B3C1E1",
          300: "#8DA2D2",
          400: "#6783C3",
          500: "#000080",
          600: "#000066",
          700: "#00004D",
          800: "#000033",
          900: "#00001A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
};
