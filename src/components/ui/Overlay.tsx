import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

let openCount = 0

interface OverlayProps {
  open: boolean
  onClose: () => void
  /** "dialog" is centred; "drawer" slides in from the right. */
  variant?: 'dialog' | 'drawer'
  labelledBy: string
  className?: string
  children: ReactNode
}

/** Modal shell: portal, backdrop click and Esc to close, focus trap, scroll lock. */
export function Overlay({ open, onClose, variant = 'dialog', labelledBy, className = '', children }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
    ;(panel.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0])?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    panel.addEventListener('keydown', onKeyDown)
    openCount += 1
    document.body.style.overflow = 'hidden'
    return () => {
      panel.removeEventListener('keydown', onKeyDown)
      openCount -= 1
      if (openCount === 0) document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex ${
        variant === 'drawer' ? 'justify-end' : 'items-center justify-center p-4'
      }`}
    >
      <div
        className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative border border-line bg-bg shadow-2xl ${
          variant === 'drawer'
            ? 'flex h-full w-full max-w-lg animate-slide-in-right flex-col sm:rounded-l-3xl'
            : 'w-full max-w-md animate-pop-in rounded-3xl'
        } ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
