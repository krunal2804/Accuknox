import { Calendar, ChevronDown, ChevronRight, FolderPlus, Menu, Plus, RotateCcw, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useUiStore } from '../../store/useUiStore'
import { Button } from '../ui/Button'
import { SEARCH_INPUT_ID } from './Sidebar'

const RANGES = ['Last 2 days', 'Last 7 days', 'Last 30 days', 'This year']

export function Header() {
  const title = useDashboardStore((s) => s.title)
  const categories = useDashboardStore((s) => s.categories)
  const searchQuery = useDashboardStore((s) => s.searchQuery)
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery)
  const resetDashboard = useDashboardStore((s) => s.resetDashboard)
  const openDrawer = useUiStore((s) => s.openDrawer)
  const setAddCategoryOpen = useUiStore((s) => s.setAddCategoryOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const [range, setRange] = useState(RANGES[0])

  const handleReset = () => {
    if (window.confirm('Reset the dashboard to the default widgets from dashboard.json?')) resetDashboard()
  }

  return (
    <header className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
          className="-ml-1 grid size-9 place-items-center rounded-lg hover:bg-card hover:text-fg lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-white">
            H
          </span>
          <span>Home</span>
          <ChevronRight className="size-4 text-subtle" aria-hidden="true" />
          <span className="font-medium text-fg" aria-current="page">
            Dashboard V2
          </span>
        </nav>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-semibold tracking-tight">{title}</h1>

        {/* Search across every widget */}
        <label className="relative order-last w-full sm:order-none sm:w-72">
          <span className="sr-only">Search widgets</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-muted" />
          <input
            id={SEARCH_INPUT_ID}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
            placeholder="Search widgets…"
            className="h-10 w-full rounded-xl border border-line bg-card pr-9 pl-10 text-sm placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-ring focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-fg"
            >
              <X className="size-4" />
            </button>
          )}
        </label>

        <label className="relative">
          <span className="sr-only">Time range</span>
          <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-10 appearance-none rounded-xl border border-line bg-card-inner pr-9 pl-9 text-sm font-medium focus:ring-4 focus:ring-ring focus:outline-none"
          >
            {RANGES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
        </label>

        <Button icon aria-label="Reset dashboard" title="Reset dashboard" onClick={handleReset}>
          <RotateCcw className="size-[18px]" />
        </Button>
        <Button onClick={() => setAddCategoryOpen(true)}>
          <FolderPlus className="size-[18px]" aria-hidden="true" />
          <span className="max-sm:sr-only">Add category</span>
        </Button>
        <Button
          variant="primary"
          onClick={() => openDrawer(categories[0]?.id ?? '')}
          disabled={categories.length === 0}
        >
          <Plus className="size-[18px]" aria-hidden="true" />
          Add Widget
        </Button>
      </div>
    </header>
  )
}
