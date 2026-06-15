import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#C9A84C',
          600: '#B8962E',
          700: '#9A7D20',
          800: '#7C6318',
          900: '#5C4910',
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dark: '#9A7D20',
        },
        dark: {
          100: '#1A1A1A',
          200: '#141414',
          300: '#111111',
          400: '#0D0D0D',
          500: '#090909',
          DEFAULT: '#0D0D0D',
        },
        cream: {
          DEFAULT: '#F7F3EE',
          muted: '#D6D0C8',
        },
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
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Vazirmatn', 'system-ui', 'sans-serif'],
        vazir: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #9A7D20 100%)',
        'dark-gradient': 'linear-gradient(180deg, #090909 0%, #141414 100%)',
        'hero-radial': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.15) 0%, transparent 60%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gold-shimmer': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(201,168,76,0.3)' },
          '50%': { borderColor: 'rgba(201,168,76,0.8)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'gold-shimmer': 'gold-shimmer 3s linear infinite',
        'border-glow': 'border-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
