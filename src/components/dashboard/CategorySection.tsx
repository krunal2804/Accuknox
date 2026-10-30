import { Plus, SlidersHorizontal } from 'lucide-react'
import { accentFor } from '../../lib/ui'
import { useUiStore } from '../../store/useUiStore'
import type { Category } from '../../types'
import { Button } from '../ui/Button'
import { CategoryIcon } from '../ui/CategoryIcon'
import { WidgetCard } from './WidgetCard'

export function CategorySection({ category, index }: { category: Category; index: number }) {
  const openAddWidget = useUiStore((s) => s.openAddWidget)
  const openDrawer = useUiStore((s) => s.openDrawer)
  const visibleWidgets = category.widgets.filter((w) => w.visible)
  const hiddenCount = category.widgets.length - visibleWidgets.length
  const accent = accentFor(index)

  return (
    <section
      id={category.id}
      aria-labelledby={`${category.id}-title`}
      className="scroll-mt-24 overflow-hidden rounded-lg border border-line bg-card shadow-sm"
    >
      <div className={`flex items-center gap-3 border-b border-line px-3 py-3 sm:px-5 ${accent.wash}`}>
        <span className={`grid size-8 shrink-0 place-items-center rounded-md sm:size-9 ${accent.tile} ${accent.text}`}>
          <CategoryIcon name={category.icon} className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${category.id}-title`} className="flex items-center gap-2 text-[15px] font-semibold">
            <span className="truncate">{category.name}</span>
            <span className="shrink-0 rounded-full bg-card px-2 py-px text-xs font-medium text-muted tabular-nums ring-1 ring-line">
              {visibleWidgets.length}
            </span>
          </h2>
          {category.description && <p className="truncate text-[13px] text-muted">{category.description}</p>}
        </div>
        {hiddenCount > 0 && <span className="shrink-0 text-xs text-subtle max-sm:hidden">{hiddenCount} hidden</span>}
        <Button
          size="sm"
          onClick={() => openDrawer(category.id)}
          aria-label={`Manage ${category.name} widgets`}
          className="max-sm:size-8 max-sm:px-0"
        >
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          <span className="max-sm:hidden">Manage</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleWidgets.map((widget) => (
          <WidgetCard key={widget.id} categoryId={category.id} widget={widget} />
        ))}
        <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-line dark:bg-raised/40">
          <Button onClick={() => openAddWidget(category.id)}>
            <Plus className="size-4" aria-hidden="true" />
            Add Widget
          </Button>
        </div>
      </div>
    </section>
  )
}
