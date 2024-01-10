/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      blaka: 'var(--font-blaka), sans-serif',
      mySoul: 'var(--font-mySoul), sans-serif',
      rock3D: 'var(--font-rock3D), sans-serif',
      rubikBeastly: 'var(--font-rubikBeastly), sans-serif',
      rubikBubbles: 'var(--font-rubikBubbles), sans-serif',
      rubikDistressed: 'var(--font-rubikDistressed), sans-serif',
      rubikGlitch: 'var(--font-rubikGlitch), sans-serif',
      rubikMicrobe: 'var(--font-rubikMicrobe), sans-serif',
    },
    colors: {
      military: '#3c4d39',
      yellow: '#fff267'
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [{ pattern: /font-/ }]
}
