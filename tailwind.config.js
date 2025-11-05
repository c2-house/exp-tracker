/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'primary-1': '#0061FF',
        'primary-2': '#E5EFFF',
        'primary-3': '#F2F7FF',
        'black-1': '#191D31',
        'black-2': '#666876',
        'black-3': '#8C8E98',
        background: '#FCFCFC',
        status: {
          safe: '#34C759',
          warning: '#FF9500',
          danger: '#FF3B30',
        },
      },
      height: {
        header: 60,
      },
    },
  },
  plugins: [],
};
