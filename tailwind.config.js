/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/pages/**/*.{js,ts,jsx,tsx}",
    "src/components/**/*.{js,ts,jsx,tsx}",
    "src/container/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  //   daisyui: {
  //   themes: ["cupcake", "dark", "cmyk"],
  // },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/line-clamp"),
    require("tailwindcss-rtl"),
  ],
};
