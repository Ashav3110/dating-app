/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#f97316',
        slate: {
          950: '#0f172a',
        },
      },
      boxShadow: {
        card: '0 20px 70px -35px rgba(15,23,42,0.35)',
      },
    },
  },
  plugins: [],
}
