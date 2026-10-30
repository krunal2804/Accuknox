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
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-3 sm:px-5 ${accent.wash}`}>
        <span className={`grid size-9 shrink-0 place-items-center rounded-md ${accent.tile} ${accent.text}`}>
          <CategoryIcon name={category.icon} className="size-[18px]" />
        </span>
        <div className="mr-auto min-w-0">
          <h2 id={`${category.id}-title`} className="flex items-center gap-2 text-[15px] font-semibold">
            {category.name}
            <span className="rounded-full bg-card px-2 py-px text-xs font-medium text-muted tabular-nums ring-1 ring-line">
              {visibleWidgets.length}
            </span>
          </h2>
          {category.description && <p className="text-[13px] text-muted">{category.description}</p>}
        </div>
        {hiddenCount > 0 && <span className="text-xs text-subtle">{hiddenCount} hidden</span>}
        <Button size="sm" onClick={() => openDrawer(category.id)}>
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Manage
        </Button>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
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
