/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      primary: 'Poppins',
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        lg: '2rem',
      },
    },
    screens: {
      xxs: '300px',
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1234px',
    },
    extend: {
      colors: {
        primary: '#101828',
        secondary: '#7F56D9',
      },
      boxShadow: {
        1: '0px 4px 30px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
