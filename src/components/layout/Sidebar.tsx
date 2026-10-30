import { FolderPlus, LayoutDashboard, LifeBuoy, Settings, X } from 'lucide-react'
import { accentFor } from '../../lib/ui'
import { usePopover } from '../../lib/usePopover'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useUiStore } from '../../store/useUiStore'
import { Button } from '../ui/Button'
import { CategoryIcon } from '../ui/CategoryIcon'

const navItem =
  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors'
const sectionLabel = 'px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-subtle uppercase'

export function Sidebar() {
  const categories = useDashboardStore((s) => s.categories)
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const setAddCategoryOpen = useUiStore((s) => s.setAddCategoryOpen)

  const scrollTo = (id: string) => {
    setSidebarOpen(false)
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 animate-fade-in bg-gray-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-sidebar transition-transform duration-300 lg:sticky lg:top-0 lg:bottom-auto lg:z-auto lg:h-screen lg:shrink-0 lg:translate-none lg:transition-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-5">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('top')
            }}
            aria-label="AccuKnox, back to top"
            className="mr-auto rounded-md"
          >
            {/* Dark mode uses a copy of the logo with white lettering. */}
            <img src={`${import.meta.env.BASE_URL}accuknox-logo.png`} alt="AccuKnox" width={136} height={33} className="h-8 w-auto dark:hidden" />
            <img src={`${import.meta.env.BASE_URL}accuknox-logo-dark.png`} alt="AccuKnox" width={136} height={33} className="hidden h-8 w-auto dark:block" />
          </a>
          <Button
            variant="ghost"
            size="sm"
            icon
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="-mr-2 lg:hidden"
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-3 py-5" aria-label="Dashboard sections">
          <div>
            <p className={sectionLabel}>Overview</p>
            <button
              type="button"
              onClick={() => scrollTo('top')}
              className={`${navItem} bg-primary-soft text-primary-strong`}
              aria-current="page"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Dashboard
            </button>
          </div>

          <div>
            <p className={sectionLabel}>Categories</p>
            <div className="flex flex-col gap-0.5">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => scrollTo(category.id)}
                  className={`${navItem} text-muted hover:bg-card-inner hover:text-fg`}
                >
                  <CategoryIcon name={category.icon} className={`size-4 shrink-0 ${accentFor(index).text}`} />
                  <span className="flex-1 truncate text-left">{category.name}</span>
                  <span className="text-xs text-subtle tabular-nums">
                    {category.widgets.filter((w) => w.visible).length}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(false)
                  setAddCategoryOpen(true)
                }}
                className={`${navItem} text-muted hover:bg-card-inner hover:text-fg`}
              >
                <FolderPlus className="size-4" aria-hidden="true" />
                New category
              </button>
            </div>
          </div>
        </nav>

        <div className="flex shrink-0 flex-col gap-0.5 border-t border-line p-3">
          <SupportButton />
          <span className={`${navItem} text-subtle`}>
            <Settings className="size-4" aria-hidden="true" />
            Settings
          </span>
        </div>
      </aside>
    </>
  )
}

/** Support item with a small message bubble above it. Closes on outside click or Esc. */
function SupportButton() {
  const { open, setOpen, ref } = usePopover()

  return (
    <div ref={ref} className="relative">
      {open && (
        <div
          id="support-bubble"
          role="status"
          className="absolute inset-x-0 bottom-full mb-2 animate-pop-in rounded-lg border border-line bg-card p-3 shadow-lg"
        >
          <p className="text-[13px] font-semibold">Hi, I&apos;m Krunal 👋</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            I&apos;ll support your company with anything you need on this dashboard. Just reach out!
          </p>
          <span
            className="absolute -bottom-1.5 left-6 size-3 rotate-45 border-r border-b border-line bg-card"
            aria-hidden="true"
          />
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="support-bubble"
        onClick={() => setOpen((o) => !o)}
        className={`${navItem} ${open ? 'bg-primary-soft text-primary-strong' : 'text-muted hover:bg-card-inner hover:text-fg'}`}
      >
        <LifeBuoy className="size-4" aria-hidden="true" />
        Support
      </button>
    </div>
  )
}
