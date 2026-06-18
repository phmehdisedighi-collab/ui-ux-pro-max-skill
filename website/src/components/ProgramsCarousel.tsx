"use client";

import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

interface ProgramCard {
  title: string;
  subtitle?: string;
  desc: string;
  image: string;
  href: string;
  badge?: string;
}

const programs: ProgramCard[] = [
  {
    title: "سیستم‌سازی کلینیک",
    subtitle: "مشاوره تخصصی",
    desc: "ساختار عملیاتی کلینیکت را از صفر تا صد بنا کن",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80&fit=crop",
    href: "/booking",
    badge: "محبوب‌ترین",
  },
  {
    title: "رشد فروش پزشکی",
    subtitle: "کارگاه آموزشی",
    desc: "افزایش درآمد کلینیک بدون افزایش هزینه‌های تبلیغات",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&fit=crop",
    href: "/services",
  },
  {
    title: "مدیریت تیم درمانی",
    subtitle: "دوره آنلاین",
    desc: "یاد بگیر تیمی بسازی که بدون حضورت کار کند",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&fit=crop",
    href: "/services",
    badge: "به‌زودی",
  },
  {
    title: "برندسازی کلینیک",
    subtitle: "مشاوره استراتژیک",
    desc: "از رقبا متمایز شو و در ذهن بیمار ماندگار بمان",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop",
    href: "/services",
  },
  {
    title: "بازاریابی دیجیتال",
    subtitle: "کارگاه عملی",
    desc: "جذب بیمار جدید از شبکه‌های اجتماعی با روش‌های اثبات‌شده",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80&fit=crop",
    href: "/services",
    badge: "به‌زودی",
  },
];

export function ProgramsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 340;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="py-16">
      {/* هدر */}
      <div className="section mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-surmei sm:text-3xl">
            برنامه‌های اوج
          </h2>
          <Link
            href="/services"
            className="flex items-center gap-1 text-sm font-bold text-orange hover:underline"
          >
            مشاهده همه
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* دکمه‌های ناوبری */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="قبلی"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/15 bg-white shadow-sm transition
                       hover:border-surmei hover:bg-surmei hover:text-white
                       disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="بعدی"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/15 bg-white shadow-sm transition
                       hover:border-surmei hover:bg-surmei hover:text-white
                       disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* اسلایدر */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth px-5 pb-4 sm:px-8
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {programs.map((prog, i) => (
          <Link
            key={i}
            href={prog.href}
            className="group relative flex-shrink-0 overflow-hidden rounded-2xl"
            style={{
              width: "280px",
              height: "380px",
              scrollSnapAlign: "start",
            }}
          >
            {/* تصویر */}
            <img
              src={prog.image}
              alt={prog.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            {/* گرادیان */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* بج */}
            {prog.badge && (
              <span className="absolute top-4 ltr:left-4 rtl:right-4 rounded-full bg-orange px-3 py-1 text-xs font-black text-white">
                {prog.badge}
              </span>
            )}

            {/* متن */}
            <div className="absolute bottom-0 inset-x-0 p-5">
              {prog.subtitle && (
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/60">
                  {prog.subtitle}
                </p>
              )}
              <h3 className="text-xl font-black leading-tight text-white">
                {prog.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {prog.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-orange transition group-hover:gap-2">
                بیشتر بدان
                <ChevronLeft className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
