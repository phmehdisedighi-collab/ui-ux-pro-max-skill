# وب‌سایت آکادمی اوج

وب‌سایت برند شخصی **مهدی صدیقی** — آکادمی رشد کلینیک «اوج».
ساخته‌شده با **Next.js (App Router) + TypeScript + Tailwind + Supabase + زرین‌پال**، دو زبانه (فارسی RTL / انگلیسی)، آمادهٔ استقرار روی **Vercel**.

طراحی کاملاً مطابق **برند گاید اوج**: رنگ‌های سرمه‌ای/طلایی/نارنجی، فونت Vazirmatn، لوگوی قله، گرادیان امضای اوج.

## امکانات

- صفحات: خانه (لندینگ Trust & Authority)، درباره من، خدمات، ثبت‌نام/ورود، رزرو مشاوره، داشبورد کاربر، پنل ادمین.
- احراز هویت ایمیل + رمز عبور (Supabase Auth).
- رزرو مشاوره: انتخاب پکیج → انتخاب زمان از تقویم → پرداخت زرین‌پال → تأیید خودکار + ساخت رویداد Google Calendar با لینک Meet.
- دیتابیس آمادهٔ توسعه برای وبینار و کلاس آنلاین.

## راه‌اندازی محلی

```bash
cd website
npm install
cp .env.example .env.local   # مقادیر را پر کنید
npm run dev
```

سایت روی http://localhost:3000 بالا می‌آید (به‌صورت خودکار به `/fa` ری‌دایرکت می‌شود).

## دیتابیس Supabase

۱. یک پروژهٔ Supabase بسازید.
۲. محتوای `supabase/migrations/0001_init.sql` را در SQL Editor اجرا کنید (جداول، RLS، تریگر، و پکیج‌های نمونه).
۳. کلیدها را در `.env.local` بگذارید (`NEXT_PUBLIC_SUPABASE_URL`، `NEXT_PUBLIC_SUPABASE_ANON_KEY`، `SUPABASE_SERVICE_ROLE_KEY`).
۴. برای دادن نقش مدیر به خودتان:
   ```sql
   update public.profiles set role = 'admin' where id = 'YOUR-USER-UUID';
   ```

## پرداخت (زرین‌پال)

- `ZARINPAL_MERCHANT_ID` را تنظیم کنید. برای تست `ZARINPAL_SANDBOX=true` بگذارید.
- تغییر وضعیت پرداخت‌ها فقط سمت سرور با service role انجام می‌شود (امن).

## Google Calendar + Meet (اختیاری)

اگر اعتبارنامهٔ گوگل تنظیم نشود، جریان پرداخت سالم می‌ماند و فقط رویداد ساخته نمی‌شود.
یکی از دو روش `.env.example` را تکمیل کنید (OAuth Refresh Token یا Service Account).

## استقرار روی Vercel

۱. ریشهٔ پروژه (Root Directory) را روی `website` تنظیم کنید.
۲. همهٔ متغیرهای `.env.example` را در Project Settings → Environment Variables وارد کنید.
۳. `NEXT_PUBLIC_SITE_URL` را برابر دامنهٔ نهایی بگذارید.
۴. Deploy.
