/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0099FF",
        secondary: "#F1F5FB",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        custom: "0px 3px 8px rgba(0, 0, 0, 0.24)",
      },
      screens: {
        xxl: "1350px",
      },
    },
  },
  plugins: [],
};
