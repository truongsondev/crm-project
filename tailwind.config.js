/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0099FF",
        secondary: "#F1F5FB"
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"]
      }
    }
  },
  plugins: []
};
