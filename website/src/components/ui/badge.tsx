import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'outline' | 'success' | 'muted'
}

function Badge({ className, variant = 'gold', children, ...props }: BadgeProps) {
  const variants = {
    gold: 'bg-[rgba(201,168,76,0.12)] text-[#C9A84C] border border-[rgba(201,168,76,0.3)]',
    outline: 'border border-[rgba(201,168,76,0.25)] text-[#D6D0C8]',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    muted: 'bg-[rgba(255,255,255,0.05)] text-[#9B9489] border border-[rgba(255,255,255,0.08)]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
