module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        moon: "3em 2.5em 0 0em #D9FBFF inset, rgba(255,255,255,0.1) 0em -7em 0 -4.5em, rgba(255,255,255,0.1) 3em 7em 0 -4.5em",
        sun: "3em 3em 0 5em #fff inset, 0 -5em 0 -2.7em #fff, 3.5em -3.5em 0 -3em #fff",
      },
      colors: {
        nightBg: "#423966",
        dayBg: "#9ee3fb",
      },
    },
  },
  plugins: [],
};
