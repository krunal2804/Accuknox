import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20',
  secondary: 'bg-card-inner text-fg border border-line hover:bg-card',
  ghost: 'text-muted hover:text-fg hover:bg-card-inner',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** Square icon-only button. Pass an aria-label. */
  icon?: boolean
}

export function Button({ variant = 'secondary', icon, className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
        icon ? 'size-10' : 'h-10 px-4'
      } ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
