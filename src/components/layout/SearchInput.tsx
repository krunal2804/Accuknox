import { Search, X } from 'lucide-react'
import { useDashboardStore } from '../../store/useDashboardStore'

export function SearchInput({ className = '' }: { className?: string }) {
  const searchQuery = useDashboardStore((s) => s.searchQuery)
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery)

  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">Search widgets</span>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
      <input
        data-global-search
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
        placeholder="Search widgets…"
        className="peer h-9 w-full rounded-md border border-line bg-card-inner pr-14 pl-9 text-sm placeholder:text-subtle focus:border-primary focus:bg-card focus:ring-3 focus:ring-ring focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {searchQuery ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setSearchQuery('')}
          className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted hover:text-fg"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-line bg-card px-1.5 py-px font-sans text-[11px] font-medium text-subtle peer-focus:hidden">
          Ctrl K
        </kbd>
      )}
    </label>
  )
}
