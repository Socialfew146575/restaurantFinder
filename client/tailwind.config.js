/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customPurpleLight: "#D6A1ED",
        customPurpleDark: "#8B54BF",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(180deg, #D6A1ED, #8B54BF)",
      },
    },
  },
  plugins: [],
};
