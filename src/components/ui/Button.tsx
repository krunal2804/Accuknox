import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-white shadow-xs hover:bg-primary-hover',
  secondary: 'border border-line bg-card text-fg shadow-xs hover:bg-card-inner',
  ghost: 'text-muted hover:bg-card-inner hover:text-fg',
}

const SIZES: Record<Size, { text: string; icon: string }> = {
  sm: { text: 'h-8 px-3 text-[13px]', icon: 'size-8' },
  md: { text: 'h-9 px-3.5 text-sm', icon: 'size-9' },
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Square icon-only button. Pass an aria-label. */
  icon?: boolean
}

export function Button({ variant = 'secondary', size = 'md', icon, className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 ${
        icon ? SIZES[size].icon : SIZES[size].text
      } ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
