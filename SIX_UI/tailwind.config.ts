import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // SIX dark backgrounds
        'six-black':  '#0A0A0A',
        'six-dark':   '#111111',
        'six-card':   '#1A1A1A',
        'six-border': '#2A2A2A',
        // SIX brand accent — official SIX red
        'six-gold':       '#D92525',
        'six-gold-light': '#E8341F',
        // Duolingo-style gamification palette
        'duo-green':       '#58CC02',
        'duo-green-dark':  '#46A302',
        'duo-blue':        '#D92525',
        'duo-purple':      '#CE82FF',
        'duo-red':         '#FF4B4B',
        'duo-orange':      '#FF9600',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'singlePing 2s ease-in-out infinite',
        'pulse-gold':  'pulseGold 2s ease-in-out infinite',
        'float':       'float 3s ease-in-out infinite',
      },
      keyframes: {
        singlePing: {
          '0%':      { transform: 'translateY(0)' },
          '10%':     { transform: 'translateY(-30%)' },
          '20%':     { transform: 'translateY(0)' },
          '100%':    { transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%':   { boxShadow: '0 0 0 0 rgba(217,37,37,0.5)' },
          '10%':  { boxShadow: '0 0 0 12px rgba(217,37,37,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(217,37,37,0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
