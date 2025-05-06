/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brandcolor100: "#5B6FA9",
        brandcolor200: "#68FFA4",
        neutral100: "#FBF9F8",
        neutral200: "#E8EBED",
        neutral300: "#D5D9DB",
        neutral400: "#C0C9D0",
        neutral500: "#A6B5C0",
        neutral600: "#8596A4",
        neutral700: "#677681",
        neutral800: "#324655",
        neutral900: "#152838",
        neutral1000: "#020923",
        error: "#FF686B",
        warning: "#FFCB47",
        success: "#68FFA4",
        "kakao-container": "#FEE500",
        "kakao-symbol": "#000000",
        "kakao-label": "rgba(0, 0, 0, 0.85)",
      },
    },
  },
  plugins: [],
};
