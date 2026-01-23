/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{ts,tsx,js,jsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E9952',
        secondary: '#3A2C33',
        info: '#59B7CC',
        danger: '#f44336',
        warning: '#c0a520',
        light: '#FDFDFD',
        dark: '#181821',
        gray: {
          100: '#FDFDFD',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#181821',
          900: '#08080C'
        }
      },
      spacing: {
        'bs-1': '0.5rem',
        'bs-2': '1rem',
        'bs-3': '2rem',
        'bs-4': '3rem',
        'bs-5': '6rem',
        spacer: '2rem'
      },
      borderRadius: {
        'bs': '0.5rem',
        'bs-lg': '1rem'
      },
      boxShadow: {
        'bs-sm': '0 2px 4px rgba(0,0,0,0.05)',
        'bs': '0 8px 16px rgba(0,0,0,0.12)',
        'bs-lg': '0 1rem 3rem rgba(0,0,0,0.175)'
      },
      fontSize: {
        base: ['1.1rem', { lineHeight: '1.5' }]
      },
      fontFamily: {
        nunito: ['var(--font-nunito)'],
        fredoka: ['var(--font-fredoka)'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
