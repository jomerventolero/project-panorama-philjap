/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,css}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
        gray: {
          900: '#121212',
          800: '#212529',
          600: '#495057',
        },
        blue: {
          500: '#007BFF',
          600: '#0069D9',
        },
        green: {
          500: '#28A745',
        },
        red: {
          500: '#DC3545',
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      fontSize: {
        xs: "6px",
        ss: "8px",
        sm: "10px",
        md: "12px",
        lg: "15px",
        xl: "18px",
      },
      backgroundImage: {
        "background": "url('src/assets/container.webp')",
        "gradient": "url('src/assets/mesh-275.png')"
      }
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1600px",
    },

  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};