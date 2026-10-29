import { SearchX } from 'lucide-react'
import { useMemo } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
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
    <section aria-live="polite">
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Search results</h2>
        <span className="text-sm text-muted">
          {results.length} widget{results.length === 1 ? '' : 's'} matching “{query.trim()}”
        </span>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-16 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-card text-muted">
            <SearchX className="size-6" aria-hidden="true" />
          </span>
          <p className="text-sm text-muted">No widgets found. Try another name.</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map(({ category, widget }) => (
            <WidgetCard key={widget.id} categoryId={category.id} widget={widget} categoryName={category.name} />
          ))}
        </div>
      )}
    </section>
  )
}
