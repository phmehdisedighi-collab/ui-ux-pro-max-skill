'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'gold' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D] disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

    const variants = {
      default: 'bg-[#C9A84C] text-[#0D0D0D] hover:bg-[#E8C97A] active:bg-[#9A7D20]',
      gold: 'bg-gradient-to-r from-[#C9A84C] via-[#E8C97A] to-[#9A7D20] text-[#0D0D0D] hover:opacity-90 active:opacity-75',
      outline: 'border border-[rgba(201,168,76,0.35)] text-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)] active:bg-[rgba(201,168,76,0.15)]',
      ghost: 'text-[#D6D0C8] hover:text-[#F7F3EE] hover:bg-[rgba(255,255,255,0.05)]',
      destructive: 'bg-red-600 text-white hover:bg-red-500',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-sm',
      lg: 'h-13 px-8 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
