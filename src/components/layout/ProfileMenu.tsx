import { Check, Copy, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePopover } from '../../lib/usePopover'
import { Button } from '../ui/Button'

const EMAIL = 'krunalparikh08@gmail.com'

/** Top-right profile chip. Clicking it reveals a small "easter egg" contact card. */
export function ProfileMenu() {
  const { open, setOpen, ref } = usePopover()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
    } catch {
      // Clipboard API can be blocked; select the address and try the legacy copy command instead.
      const range = document.createRange()
      const node = document.getElementById('profile-email')
      if (node) {
        range.selectNodeContents(node)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
        if (document.execCommand('copy')) setCopied(true)
      }
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="profile-card"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-md py-1 pr-2 pl-1 transition-colors hover:bg-card-inner"
      >
        <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
          KP
        </span>
        <span className="text-left leading-tight max-sm:hidden">
          <span className="block text-[13px] font-semibold">Krunal Parikh</span>
          <span className="block text-xs text-muted">Developer</span>
        </span>
      </button>

      {open && (
        <div
          id="profile-card"
          role="dialog"
          aria-label="About the developer"
          className="absolute top-full right-0 z-40 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] animate-pop-in rounded-lg border border-line bg-card p-3 shadow-lg"
        >
          {/* Same bubble style as the Support message, with the caret pointing up at the name. */}
          <span
            className="absolute -top-1.5 right-6 size-3 rotate-45 border-t border-l border-line bg-card"
            aria-hidden="true"
          />
          <p className="text-[13px] font-semibold">Krunal this side 👋</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            If you liked what you saw, let&apos;s build something together.
          </p>

          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <Mail className="size-4 shrink-0 text-subtle" aria-hidden="true" />
            <a
              id="profile-email"
              href={`mailto:${EMAIL}`}
              className="min-w-0 flex-1 truncate text-[13px] font-medium text-primary-strong hover:underline"
            >
              {EMAIL}
            </a>
            <Button size="sm" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email'}>
              {copied ? <Check className="size-3.5 text-success-fg" /> : <Copy className="size-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="sr-only" aria-live="polite">
            {copied ? 'Email copied to clipboard' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
