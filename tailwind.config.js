const colors = require('tailwindcss/colors')

const primaryDefault = '#4357adff'
const secondaryDefault = '#48a9a6ff'
const tertiaryDefault = '#e0c5aa'

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{html,ts}'
    ]
  },
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: primaryDefault,
          background: primaryDefault,
          foreground: colors.white,
        },
        secondary: {
          DEFAULT: secondaryDefault,
          background: secondaryDefault,
          foreground: colors.black,
        },
        tertiary: {
          DEFAULT: tertiaryDefault,
          background: tertiaryDefault,
          foreground: colors.black,
        },

        warning: {
          'very-light': colors.amber['100'],
          light: colors.amber['300'],
          DEFAULT: colors.amber['500'],
          dark: colors.amber['700'],
          'very-dark': colors.amber['900'],
        },
        error: {
          'very-light': colors.rose['100'],
          light: colors.rose['300'],
          DEFAULT: colors.rose['500'],
          dark: colors.rose['700'],
          'very-dark': colors.rose['900'],
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
