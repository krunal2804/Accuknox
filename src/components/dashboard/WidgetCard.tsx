import { Eye, X } from 'lucide-react'
import { useDashboardStore } from '../../store/useDashboardStore'
import type { Widget } from '../../types'
import { DonutWidget } from '../widgets/DonutWidget'
import { EmptyWidget } from '../widgets/EmptyWidget'
import { StackedBarWidget } from '../widgets/StackedBarWidget'
import { TextWidget } from '../widgets/TextWidget'

function WidgetBody({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'donut':
      return <DonutWidget widget={widget} />
    case 'bar':
      return <StackedBarWidget widget={widget} />
    case 'empty':
      return <EmptyWidget />
    case 'text':
      return <TextWidget widget={widget} />
  }
}

interface WidgetCardProps {
  categoryId: string
  widget: Widget
  /** Shown as a chip in search results, where widgets from every category are mixed. */
  categoryName?: string
}

export function WidgetCard({ categoryId, widget, categoryName }: WidgetCardProps) {
  const removeWidget = useDashboardStore((s) => s.removeWidget)
  const setWidgetVisibility = useDashboardStore((s) => s.setWidgetVisibility)

  return (
    <article
      className={`group relative flex min-h-64 flex-col gap-4 rounded-3xl border border-line bg-card p-5 ${
        widget.visible ? '' : 'opacity-60'
      }`}
      aria-label={widget.name}
    >
      <header className="flex items-start gap-3 pr-8">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold">{widget.name}</h3>
          {(categoryName || !widget.visible) && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {categoryName && (
                <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary dark:text-blue-300">
                  {categoryName}
                </span>
              )}
              {!widget.visible && (
                <span className="rounded-md bg-card-inner px-2 py-0.5 text-xs font-medium text-muted">
                  Hidden
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <button
        type="button"
        aria-label={`Remove ${widget.name}`}
        title="Remove widget"
        onClick={() => removeWidget(categoryId, widget.id)}
        className="absolute top-4 right-4 grid size-8 place-items-center rounded-lg text-muted transition hover:bg-danger-soft hover:text-danger-fg focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
      >
        <X className="size-4" />
      </button>

      <WidgetBody widget={widget} />

      {!widget.visible && (
        <button
          type="button"
          onClick={() => setWidgetVisibility({ [widget.id]: true })}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-card-inner px-3 py-1.5 text-sm font-medium hover:text-primary"
        >
          <Eye className="size-4" aria-hidden="true" />
          Show on dashboard
        </button>
      )}
    </article>
  )
}
