import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm cream / ivory — page background
        cream: {
          50: '#FDFAF5',
          100: '#F8F2E6',
          200: '#F2E8D4',
        },
        // Timber amber — Hinoki / wood accent
        timber: {
          300: '#D4A96A',
          400: '#C49255',
          500: '#A97B3E',
          600: '#8B6330',
          700: '#6E4D22',
        },
        // Deep forest — primary text / dark surfaces
        forest: {
          800: '#2C2A26',
          900: '#1A1814',
          950: '#0F0E0C',
        },
        // Muted stone — secondary text
        stone: {
          400: '#A89F94',
          500: '#8C8278',
          600: '#6B6259',
        },
      },
      fontFamily: {
        serif: ['Space Mono', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3.5s ease-in-out infinite',
        'scale-in': 'scaleIn 0.9s cubic-bezier(0.16,1,0.3,1) both',
        'drift-up': 'driftUp 1.2s ease-out both',
        'ken-burns': 'kenBurns 16s ease-in-out infinite alternate',
        'underline-grow': 'underlineGrow 1.1s cubic-bezier(0.16,1,0.3,1) 0.6s both',
        'motif-spin': 'motifSpin 90s linear infinite',
        'ring-glow-pulse': 'ringGlowPulse 2.2s ease-in-out infinite',
        'pop-in': 'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        'gold-shimmer': 'goldShimmer 3s linear infinite',
        'sparkle-pulse': 'sparklePulse 2.8s ease-in-out infinite',
        'header-drop': 'headerDrop 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'rotate(var(--rot,0deg)) translateY(0px)' },
          '50%': { transform: 'rotate(var(--rot,0deg)) translateY(-22px)' },
        },
        glowPulse: {
          '0%, 100%': {
            opacity: '0.65',
            filter: 'drop-shadow(0 0 10px rgba(200,150,90,0.18)) drop-shadow(0 0 40px rgba(200,150,90,0.06))',
          },
          '50%': {
            opacity: '1',
            filter: 'drop-shadow(0 0 28px rgba(200,150,90,0.55)) drop-shadow(0 0 70px rgba(200,150,90,0.22))',
          },
        },
        scaleIn: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        driftUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.12) translate(-1.5%, -1%)' },
        },
        underlineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        motifSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ringGlowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(169,123,62,0.38), 0 25px 50px -12px rgba(0,0,0,0.25)' },
          '50%': { boxShadow: '0 0 0 9px rgba(169,123,62,0.14), 0 25px 50px -12px rgba(0,0,0,0.25)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '60%': { opacity: '1', transform: 'scale(1.08)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        sparklePulse: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        headerDrop: {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
