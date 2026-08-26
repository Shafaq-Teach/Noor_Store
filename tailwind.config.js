/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sky: {
          primary: '#1E88E5',
          secondary: '#00A8CC',
          tertiary: '#00B4D8',
          bgLight: '#DDF0F9',
          surfaceLight: '#EBF6FD',
          surfaceVariantLight: '#D2E8F6',
          textLight: '#0B2E46',
          bgDark: '#0B1E2C',
          surfaceDark: '#132F45',
          surfaceVariantDark: '#1E425E',
          textDark: '#E2F3FD',
        },
        gold: {
          primary: '#D49A00',
          secondary: '#1E5B84',
          tertiary: '#B8860B',
          bgLight: '#FAF7EE',
          surfaceLight: '#FFFDF5',
          surfaceVariantLight: '#F4ECDB',
          textLight: '#2C2411',
          bgDark: '#1C1914',
          surfaceDark: '#2A241B',
          surfaceVariantDark: '#3D3425',
          textDark: '#FDF6E3',
        },
        emerald: {
          primary: '#059669',
          secondary: '#F59E0B',
          tertiary: '#10B981',
          bgLight: '#F0FDF4',
          surfaceLight: '#FFFFFF',
          surfaceVariantLight: '#DCFCE7',
          textLight: '#062C1E',
          bgDark: '#062117',
          surfaceDark: '#0D3526',
          surfaceVariantDark: '#154D38',
          textDark: '#ECFDF5',
        },
        amethyst: {
          primary: '#7C3AED',
          secondary: '#EC4899',
          tertiary: '#8B5CF6',
          bgLight: '#FAF5FF',
          surfaceLight: '#FFFFFF',
          surfaceVariantLight: '#F3E8FF',
          textLight: '#2E1065',
          bgDark: '#140C24',
          surfaceDark: '#22143D',
          surfaceVariantDark: '#321E59',
          textDark: '#FAF5FF',
        }
      },
      fontFamily: {
        uyghur: ['"UKIJEkran"', '"UKIJ Ekran"', '"UKIJ Tuz"', 'Tahoma', 'sans-serif'],
        arabic: ['"Readex Pro"', '"Cairo"', '"Tajawal"', '"Scheherazade New"', 'Tahoma', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wave: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '22px' },
        }
      }
    },
  },
  plugins: [],
}
