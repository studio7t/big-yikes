module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        leisure: ['leisure'],
        courier: ['Courier New', 'Courier', 'monospace'],
        ptsans: ['ptsans'],
        'ptsans-bold': ['ptsans-bold'],
      },
      colors: {
        primary: '#f20d0d',
      },
    },
  },
  plugins: [],
};
