/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#08090C',
          secondary: '#0F1117',
          card: '#151820',
          elevated: '#1A1E27',
          hover: '#20242F',
        },
        text: {
          primary: '#F5F7FA',
          secondary: '#8B92A5',
          tertiary: '#5C6273',
        },
        border: {
          subtle: '#1F232E',
          DEFAULT: '#262B38',
          strong: '#353B4A',
        },
        success: {
          DEFAULT: '#10B981',
          soft: '#34D399',
          muted: '#064E3B',
        },
        danger: {
          DEFAULT: '#F43F5E',
          soft: '#FB7185',
          muted: '#4C0519',
        },
        accent: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
          violet: '#8B5CF6',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.02)',
        elevated: '0 8px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        glow: '0 0 24px rgba(16,185,129,0.25)',
        'glow-blue': '0 0 24px rgba(59,130,246,0.25)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
