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
        brand: {
          orange: '#FF6702', // Primary Action
          blue: '#289BFF',   // Secondary/Interactive
          cyan: '#04DEB2',   // Accents
          black: '#020202',  // Base Background
          navy: '#0a0e27',   // Gradient Start
          white: '#FFFFFF',  // Text
        },
        dark: {
          950: '#020202', // Deep Black
          900: '#0a0e27', // Deep Navy
          850: '#131825',
          800: '#1a2030',
          700: '#232b3d',
          600: '#363649',
          500: '#484861',
          400: '#606080',
        },
        primary: {
          DEFAULT: '#FF6702',
          50: '#fff0e6',
          100: '#ffdbc2',
          200: '#ffbca3',
          300: '#ff966b',
          400: '#ff6702',
          500: '#e65100',
          600: '#c24100',
          700: '#9e3200',
          800: '#7a2400',
          900: '#5c1b00',
        },
        secondary: {
          DEFAULT: '#289BFF',
          50: '#eef7ff',
          100: '#dbebff',
          200: '#bddaff',
          300: '#94c2ff',
          400: '#63a3ff',
          500: '#289BFF',
          600: '#0077e6',
          700: '#005bb3',
          800: '#004280',
          900: '#002b52',
        },
        accent: {
          DEFAULT: '#04DEB2',
          cyan: '#04DEB2',
          blue: '#289BFF',
          orange: '#FF6702',
        },
      },
      fontFamily: {
        display: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'signature-gradient': 'linear-gradient(135deg, #0a0e27 0%, #020202 100%)',
        'glass-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'glass-hover': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
        'gradient-text-orange': 'linear-gradient(135deg, #FF6702 0%, #04DEB2 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 16px 48px 0 rgba(255, 103, 2, 0.2)',
        'glow-orange': '0 0 30px rgba(255, 103, 2, 0.5)',
        'glow-cyan': '0 0 30px rgba(4, 222, 178, 0.4)',
        'glow-blue': '0 0 30px rgba(40, 155, 255, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'float-rotate': 'floatRotate 20s linear infinite',
        'float-rotate-reverse': 'floatRotateReverse 25s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatRotate: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
          '100%': { transform: 'translateY(0) rotate(360deg)' },
        },
        floatRotateReverse: {
          '0%': { transform: 'translateY(0) rotate(360deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
          '100%': { transform: 'translateY(0) rotate(0deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
