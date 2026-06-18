import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // shadcn CSS variable tokens
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // پالت برند اوج (مطابق برند گاید)
        // پالت برند اوج (مطابق برند گاید)
        surmei: {
          DEFAULT: '#0E1E3C', // سرمه‌ای پایه
          mid: '#1C3258',     // سرمه‌ای متوسط
        },
        gold: '#E5A823',      // طلایی قله
        orange: '#F2682C',    // نارنجی اوج
        teal: '#0FA3A3',      // فیروزه‌ای درمان
        graylight: '#F4F6FA', // خاکستری روشن
        ink: '#1B2330',       // ذغالی متن
      },
      fontFamily: {
        sans: ['IRANSans', 'Vazirmatn', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'owj-gradient': 'linear-gradient(90deg, #E5A823 0%, #F2682C 100%)',
        'owj-gradient-tr': 'linear-gradient(135deg, #E5A823 0%, #F2682C 100%)',
      },
      borderRadius: {
        owj: '0.875rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        owj: '0 18px 40px -12px rgba(14, 30, 60, 0.45)',
        'owj-gold': '0 14px 32px -10px rgba(242, 104, 44, 0.5)',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
};

export default config;
