module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    extend: {
      colors: {
        primary: {
          light: "#64ffda",
          DEFAULT: "#009688",
          dark: "#004d40",
        },
        background: {
          light: "#f5f5f5",
          dark: "#212121",
        },
        surface: {
          light: "#ffffff",
          dark: "#263238",
        },
        text: {
          light: "#212121",
          dark: "#ffffff",
          subtleDark: "#b0bec5",
          subtleLight: "#757575",
        },
        accent: {
          dark: "#80cbc4",
          light: "#00796b",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
