import {
  ChevronsUpDown,
  FolderPlus,
  Hash,
  LayoutDashboard,
  LifeBuoy,
  Moon,
  PanelLeft,
  Search,
  Settings,
  Sun,
} from 'lucide-react'
import { useEffect } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useThemeStore } from '../../store/useThemeStore'
import { useUiStore } from '../../store/useUiStore'

export const SEARCH_INPUT_ID = 'global-search'

const navItem =
  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors'

const focusSearch = () => {
  useUiStore.getState().setSidebarOpen(false)
  document.getElementById(SEARCH_INPUT_ID)?.focus()
}

export function Sidebar() {
  const categories = useDashboardStore((s) => s.categories)
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const setAddCategoryOpen = useUiStore((s) => s.setAddCategoryOpen)
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  // Ctrl/Cmd + K focuses the header search.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        focusSearch()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const scrollTo = (id: string) => {
    setSidebarOpen(false)
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 animate-fade-in bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 p-3 transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col rounded-3xl border border-line bg-sidebar p-3">
          {/* Workspace header */}
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="grid size-9 place-items-center rounded-full bg-card-inner text-sm font-semibold text-muted">
              C
            </span>
            <span className="flex-1 truncate text-[15px] font-semibold">CNAPP Console</span>
            <ChevronsUpDown className="size-4 text-muted" aria-hidden="true" />
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="ml-1 grid size-8 place-items-center rounded-lg text-muted hover:bg-card-inner hover:text-fg lg:hidden"
            >
              <PanelLeft className="size-[18px]" />
            </button>
          </div>

          {/* Quick search */}
          <button
            type="button"
            onClick={focusSearch}
            className="mt-3 flex h-11 w-full items-center gap-2.5 rounded-xl bg-card-inner px-3 text-sm text-muted hover:text-fg"
          >
            <Search className="size-[18px]" aria-hidden="true" />
            <span className="flex-1 text-left">Quick Search</span>
            <kbd className="rounded-md border border-line px-1.5 py-0.5 font-sans text-[11px] font-semibold">
              Ctrl K
            </kbd>
          </button>

          <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto" aria-label="Dashboard sections">
            <button
              type="button"
              onClick={() => scrollTo('top')}
              className={`${navItem} bg-primary text-white shadow-sm shadow-primary/30`}
              aria-current="page"
            >
              <LayoutDashboard className="size-[18px]" aria-hidden="true" />
              Dashboard
            </button>

            <p className="mt-4 mb-1 px-3 text-[11px] font-semibold tracking-wider text-subtle uppercase">
              Categories
            </p>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => scrollTo(category.id)}
                className={`${navItem} text-muted hover:bg-card-inner hover:text-fg`}
              >
                <Hash className="size-[18px] shrink-0" aria-hidden="true" />
                <span className="flex-1 truncate text-left">{category.name}</span>
                <span className="rounded-md bg-card-inner px-1.5 text-xs text-muted">
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
              <FolderPlus className="size-[18px]" aria-hidden="true" />
              New category
            </button>
          </nav>

          {/* Theme toggle */}
          <div
            role="radiogroup"
            aria-label="Theme"
            className="mt-3 flex w-fit gap-1 rounded-full bg-card-inner p-1"
          >
            {(['light', 'dark'] as const).map((value) => {
              const Icon = value === 'light' ? Sun : Moon
              const active = theme === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`${value} theme`}
                  onClick={() => setTheme(value)}
                  className={`grid size-9 place-items-center rounded-full transition-colors ${
                    active ? 'bg-bg text-fg shadow-sm' : 'text-muted hover:text-fg'
                  }`}
                >
                  <Icon className="size-[18px]" />
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <span className={`${navItem} text-muted`}>
              <LifeBuoy className="size-[18px]" aria-hidden="true" />
              Support
            </span>
            <span className={`${navItem} text-muted`}>
              <Settings className="size-[18px]" aria-hidden="true" />
              Settings
            </span>
          </div>

          {/* Account card */}
          <div className="mt-2 flex items-center gap-3 rounded-2xl bg-card-inner p-3">
            <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
              ST
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Security Team</p>
              <p className="truncate text-xs text-muted">Trainee workspace</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
