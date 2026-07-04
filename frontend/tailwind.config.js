/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0D1220',
          900: '#131A2C',
          800: '#1B2438',
          700: '#273349',
          600: '#39465F'
        },
        peri: {
          300: '#B3C0FF',
          400: '#8B9DFF',
          500: '#6C82F5'
        }
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
