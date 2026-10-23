/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ivory: '#FAF8F4', pearl: '#F4F1EC', champagne: '#C9AE7A', sage: '#B9C2B0', olive: '#59604C', charcoal: '#35332F' },
    fontFamily: { editorial: ['Cormorant Garamond', 'serif'], body: ['Lato', 'sans-serif'], arabic: ['Amiri', 'serif'], urdu: ['Noto Nastaliq Urdu', 'serif'] }
  }},
  plugins: []
}