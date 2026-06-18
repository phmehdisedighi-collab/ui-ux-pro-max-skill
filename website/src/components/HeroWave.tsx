"use client"

import dynamic from "next/dynamic"

const Wave = dynamic(
  () => import("@/components/ui/wave").then((m) => ({ default: m.Wave })),
  { ssr: false }
)

export function HeroWave() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      <Wave
        style={{ width: "100%", height: "100%" }}
        speed={0.4}
        tiles={1.2}
        disablePointerTracking
      />
    </div>
  )
}
