import { Eye, Pencil, X } from 'lucide-react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useUiStore } from '../../store/useUiStore'
import type { Widget } from '../../types'
import { Button } from '../ui/Button'
import { DonutWidget } from '../widgets/DonutWidget'
import { EmptyWidget } from '../widgets/EmptyWidget'
import { LineWidget } from '../widgets/LineWidget'
import { StackedBarWidget } from '../widgets/StackedBarWidget'
import { TextWidget } from '../widgets/TextWidget'

function WidgetBody({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'donut':
      return <DonutWidget widget={widget} />
    case 'bar':
      return <StackedBarWidget widget={widget} />
    case 'line':
      return <LineWidget widget={widget} />
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
  const openEditWidget = useUiStore((s) => s.openEditWidget)

  return (
    <article
      className={`flex min-h-48 flex-col rounded-lg border border-line bg-raised shadow-xs ${
        widget.visible ? '' : 'opacity-70'
      }`}
      aria-label={widget.name}
    >
      <header className="flex items-center gap-2 py-2 pr-2 pl-4">
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold" title={widget.name}>
          {widget.name}
        </h3>
        {categoryName && (
          <span className="shrink-0 rounded bg-primary-soft px-1.5 py-0.5 text-[11px] font-medium text-primary-strong max-sm:hidden">
            {categoryName}
          </span>
        )}
        {!widget.visible && (
          <span className="shrink-0 rounded bg-card-inner px-1.5 py-0.5 text-[11px] font-medium text-muted">
            Hidden
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          icon
          aria-label={`Edit ${widget.name}`}
          title="Edit widget"
          onClick={() => openEditWidget(categoryId, widget.id)}
          className="-mr-1.5 text-subtle hover:text-fg"
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon
          aria-label={`Remove ${widget.name}`}
          title="Remove widget"
          onClick={() => removeWidget(categoryId, widget.id)}
          className="text-subtle hover:bg-danger-soft hover:text-danger-fg"
        >
          <X className="size-4" />
        </Button>
      </header>

      <div className="flex flex-1 flex-col px-4 pb-4">
        {/* Chart widgets can carry an optional description; text widgets render their text as the body. */}
        {widget.type !== 'text' && widget.text && (
          <p className="-mt-1 mb-3 line-clamp-2 text-xs text-muted">{widget.text}</p>
        )}
        <WidgetBody widget={widget} />
      </div>

      {!widget.visible && (
        <div className="border-t border-line px-4 py-2.5">
          <Button size="sm" onClick={() => setWidgetVisibility({ [widget.id]: true })}>
            <Eye className="size-3.5" aria-hidden="true" />
            Show on dashboard
          </Button>
        </div>
      )}
    </article>
  )
}
