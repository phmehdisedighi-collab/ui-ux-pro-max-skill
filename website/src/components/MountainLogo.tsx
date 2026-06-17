/**
 * لوگوی اوج — قله + خط رشد رو به بالا (مطابق برند گاید).
 */
export function MountainLogo({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="owjPeak" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E5A823" />
          <stop offset="100%" stopColor="#F2682C" />
        </linearGradient>
      </defs>
      {/* قلهٔ اصلی */}
      <path d="M30 8 L54 50 H6 Z" fill="url(#owjPeak)" />
      {/* قلهٔ کوچک پشتی */}
      <path d="M44 24 L62 50 H30 Z" fill="#E5A823" opacity="0.55" />
      {/* خط رشد رو به بالا */}
      <path
        d="M4 40 L18 30 L28 36 L46 14 L60 6"
        stroke="#9AA7BF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
