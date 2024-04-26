/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        akkurat: ["var(--font-akkurat)", "sans-serif"],
        system: ["-apple-system", "sans-serif"],
      },
      colors: {
        background: {
          dark: "#0C0C0C",
          light: "#FCFCFC",
        },
        text: {
          dark: {
            header: "#E5E5EF",
            headerDark: "#A0A0A0",
            body: "#E5E5E5",
          },
          light: {
            header: "#0D0D0B",
            headerLight: "#363636",
            body: "#6D6D6D",
          },
        },
      },
    },
  },
  plugins: [],
};
