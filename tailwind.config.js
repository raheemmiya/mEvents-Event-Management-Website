/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './views/**/*.ejs',
    './public/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        logoFont: ["Rubik Vinyl"],
        mainFont: ["Inter"],
        profileFont: ["Acme"],
      },
    },
  },
  plugins: [],
};
