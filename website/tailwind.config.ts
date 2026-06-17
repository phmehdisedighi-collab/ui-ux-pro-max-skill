import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'owj-gradient': 'linear-gradient(90deg, #E5A823 0%, #F2682C 100%)',
        'owj-gradient-tr': 'linear-gradient(135deg, #E5A823 0%, #F2682C 100%)',
      },
      borderRadius: {
        owj: '0.875rem',
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
