import { SearchX } from 'lucide-react'
import { useMemo } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { Button } from '../ui/Button'
import { WidgetCard } from './WidgetCard'

/** Searches every widget (including hidden ones) by name, text and category. */
export function SearchResults() {
  const categories = useDashboardStore((s) => s.categories)
  const query = useDashboardStore((s) => s.searchQuery)
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return categories.flatMap((category) =>
      category.widgets
        .filter((widget) =>
          [widget.name, widget.text ?? '', category.name].some((field) => field.toLowerCase().includes(q)),
        )
        .map((widget) => ({ category, widget })),
    )
  }, [categories, query])

  return (
    <section aria-live="polite" className="rounded-lg border border-line bg-card shadow-xs">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-5 py-4">
        <h2 className="text-[15px] font-semibold">Search results</h2>
        <span className="text-[13px] text-muted">
          {results.length} widget{results.length === 1 ? '' : 's'} matching “{query.trim()}”
        </span>
        <Button size="sm" variant="ghost" onClick={() => setSearchQuery('')} className="ml-auto">
          Clear search
        </Button>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="mb-1 grid size-10 place-items-center rounded-md border border-line bg-card-inner text-subtle">
            <SearchX className="size-5" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium">No widgets found</p>
          <p className="text-xs text-subtle">Try a different widget or category name.</p>
        </div>
      ) : (
        <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map(({ category, widget }) => (
            <WidgetCard key={widget.id} categoryId={category.id} widget={widget} categoryName={category.name} />
          ))}
        </div>
      )}
    </section>
  )
}
