// tailwind.config.ts
import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin'; // برای تعریف پلاگین‌های سفارشی
import tailwindAnimate from "tailwindcss-animate";
const config: Config = {
  darkMode: "class", // فعال کردن حالت تاریک بر اساس کلاس 'dark'
  content: [
    // این مسیرها به Tailwind می‌گویند کجا را برای استایل‌های استفاده شده جستجو کند
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // اگر از pages router استفاده می‌کردی
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",   // برای App Router در پوشه src
    "./app/**/*.{js,ts,jsx,tsx,mdx}",      // برای App Router در ریشه پروژه (اگر src نداشتی)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // کامپوننت‌های شما (اگر در پوشه components باشند)
    // ... هر مسیر دیگری که فایل‌های React شما در آن قرار دارند
  ],
  theme: {
    container: {
      // تنظیمات پیش‌فرض برای کانتینر، مانند عرض و padding
      center: true,
      padding: {
        DEFAULT: "1rem", // padding پیش‌فرض برای همه اندازه‌ها
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      // فونت سفارشی وزیرمتن که در layout.tsx تعریف کردیم
      fontFamily: {
        sans: ["Vazirmatn UI", "Vazirmatn", "sans-serif"],
        // می‌توانید فونت‌های دیگر را هم اینجا تعریف کنید
        // serif: ["var(--font-vazirmatn-serif)", ...],
      },
      // رنگ‌های سفارشی برای تم لوکس
      colors: {
        primary: "#FACC15", // طلایی/زرد (مثلا برای دکمه‌ها، لینک‌های مهم)
        secondary: "#0EA5E9", // آبی/فیروزه‌ای (برای تاکید ثانویه)
        // رنگ‌های مخصوص تم تاریک
        "dark-bg": "#0F172A",     // پس‌زمینه اصلی (Zinc-950)
        "dark-card": "#1E293B",   // کارت‌ها و المان‌های داخلی (Zinc-800)
        "dark-text": "#E2E8F0",   // متن اصلی (Zinc-200)
        "dark-text-muted": "#94A3B8", // متن کم‌رنگ (Zinc-500)
        // اگر رنگ‌های پیش‌فرض Tailwind را هم می‌خواهید، کافی است extend کنید:
        // slate: { // برای مثال، اگر خواستید slate را هم سفارشی کنید
        //   ...require("tailwindcss/colors").slate,
        //   "950": "#0f172a",
        // },
      },
      // Shadowهای سفارشی برای ایجاد عمق و حس لوکس بودن
      boxShadow: {
        "card-dark": "0 4px 10px rgba(0, 0, 0, 0.2)", // سایه برای کارت‌ها
        "card-dark-hover": "0 8px 20px rgba(0, 0, 0, 0.3)", // سایه قوی‌تر هنگام هاور
        "input-focus": "0 0 0 3px rgba(250, 204, 21, 0.5)", // سایه برای فوکوس ورودی‌ها (رنگ primary)
      },
      // انیمیشن‌های سفارشی (اختیاری)
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', // انیمیشن چشمک‌زن
        'spin-slow': 'spin 3s linear infinite', // چرخش کند
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      }
    },
  },
  plugins: [
    // پلاگین‌های Tailwind CSS
    tailwindAnimate, // برای انیمیشن‌های shadcn/ui و ...
    plugin(function({ addUtilities, theme }) {
      // اضافه کردن کلاس‌های سفارشی (مثلا برای فوکوس دکمه)
      const newUtilities = {
        ".focus-ring": {
          outline: "none",
          boxShadow: theme("boxShadow.input-focus"),
        },
        ".dark .dark-mode-important": { // کلاسی که در حالت dark override کند
           // مثال:
           // backgroundColor: theme("colors.red.500"),
        }
      };
      addUtilities(newUtilities);
    }),
    // اگر از shadcn/ui استفاده می‌کنی، این پلاگین را هم اضافه کن:
    // require("shadcn-ui-tailwindcss-plugin"), // این را باید نصب کنی
  ],
};

export default config;
