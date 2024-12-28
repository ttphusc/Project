/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        600: "600px",
      },
      fontFamily: {
        lobster: ["Lobster", "cursive"],
        wixmadefor: ['"Wix Madefor Text"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
