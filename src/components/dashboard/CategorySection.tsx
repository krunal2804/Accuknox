import { Plus, SlidersHorizontal } from 'lucide-react'
import { useUiStore } from '../../store/useUiStore'
import type { Category } from '../../types'
import { WidgetCard } from './WidgetCard'

export function CategorySection({ category }: { category: Category }) {
  const openAddWidget = useUiStore((s) => s.openAddWidget)
  const openDrawer = useUiStore((s) => s.openDrawer)
  const visibleWidgets = category.widgets.filter((w) => w.visible)
  const hiddenCount = category.widgets.length - visibleWidgets.length

  return (
    <section id={category.id} aria-labelledby={`${category.id}-title`} className="scroll-mt-6">
      <div className="mb-3 flex flex-wrap items-end gap-x-3 gap-y-1">
        <div className="mr-auto">
          <h2 id={`${category.id}-title`} className="text-lg font-semibold tracking-tight">
            {category.name}
          </h2>
          {category.description && <p className="text-sm text-muted">{category.description}</p>}
        </div>
        {hiddenCount > 0 && <span className="text-xs text-subtle">{hiddenCount} hidden</span>}
        <button
          type="button"
          onClick={() => openDrawer(category.id)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-muted hover:bg-card hover:text-fg"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Manage
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleWidgets.map((widget) => (
          <WidgetCard key={widget.id} categoryId={category.id} widget={widget} />
        ))}
        <button
          type="button"
          onClick={() => openAddWidget(category.id)}
          className="group flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-line text-muted transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-card-inner transition-colors group-hover:bg-primary group-hover:text-white">
            <Plus className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium">Add Widget</span>
        </button>
      </div>
    </section>
  )
}
