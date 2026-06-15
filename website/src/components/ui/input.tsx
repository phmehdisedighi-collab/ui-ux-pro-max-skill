import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#D6D0C8]"
          >
            {label}
            {props.required && <span className="text-[#C9A84C] ms-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full h-11 px-4 rounded-sm bg-[#141414] border text-[#F7F3EE] placeholder:text-[#6B6560]',
            'focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-1 focus:ring-offset-[#0D0D0D]',
            'transition-colors duration-150',
            error
              ? 'border-red-500/60 focus:ring-red-500'
              : 'border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.4)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400 mt-0.5">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-[#6B6560]">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
