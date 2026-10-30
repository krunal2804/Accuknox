import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

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
        variant === 'drawer' ? 'justify-end' : 'items-end justify-center sm:items-center sm:p-4'
      }`}
    >
      <div
        className="absolute inset-0 animate-fade-in bg-gray-950/50 dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative flex flex-col border-line bg-card shadow-2xl ${
          variant === 'drawer'
            ? 'h-full w-full max-w-md animate-slide-in-right border-l'
            : // Bottom sheet on phones, centred card from `sm` up.
              'max-h-[92dvh] w-full max-w-lg animate-sheet-up overflow-hidden rounded-t-2xl border sm:max-h-[calc(100dvh-2rem)] sm:animate-pop-in sm:rounded-xl'
        } ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

/** Standard header row for dialogs and drawers. */
export function OverlayHeader({ id, title, subtitle, onClose }: { id: string; title: string; subtitle?: string; onClose: () => void }) {
  return (
    <div className="flex items-start gap-4 border-b border-line px-4 py-4 sm:px-6">
      <div className="min-w-0 flex-1">
        <h2 id={id} className="text-base font-semibold">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      <Button variant="ghost" size="sm" icon aria-label="Close" onClick={onClose} className="-mr-2">
        <X className="size-4" />
      </Button>
    </div>
  )
}

/** Standard footer row (actions right-aligned). */
export function OverlayFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-line bg-card-inner px-4 py-3 max-sm:[&>button]:flex-1 sm:px-6">
      {children}
    </div>
  )
}
