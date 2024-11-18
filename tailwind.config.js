/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        'apple-gray': '#f5f5f7',
        'apple-dark': '#1d1d1f',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#0071e3",
          secondary: "#86868b",
          accent: "#2997ff",
          neutral: "#1d1d1f",
          "base-100": "#ffffff",
        },
      },
    ],
  },
}