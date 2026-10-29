import { Eye, EyeOff, Layers, LayoutGrid, type LucideIcon } from 'lucide-react'
import { useDashboardStore } from '../../store/useDashboardStore'

interface Stat {
  label: string
  value: number
  icon: LucideIcon
  note?: string
}

export function StatsRow() {
  const categories = useDashboardStore((s) => s.categories)
  const widgets = categories.flatMap((c) => c.widgets)
  const visible = widgets.filter((w) => w.visible).length
  const custom = widgets.filter((w) => w.type === 'text').length

  const stats: Stat[] = [
    { label: 'Categories', value: categories.length, icon: Layers },
    { label: 'Total widgets', value: widgets.length, icon: LayoutGrid, note: custom ? `${custom} custom` : undefined },
    { label: 'Visible', value: visible, icon: Eye, note: widgets.length ? `${Math.round((visible / widgets.length) * 100)}%` : undefined },
    { label: 'Hidden', value: widgets.length - visible, icon: EyeOff },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, note }) => (
        <div key={label} className="rounded-3xl border border-line bg-card p-5">
          <span className="grid size-10 place-items-center rounded-xl bg-card-inner">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm text-muted">{label}</p>
          <p className="mt-1 flex items-center gap-2">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
            {note && (
              <span className="rounded-md bg-success-soft px-1.5 py-0.5 text-xs font-semibold text-success-fg">
                {note}
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  )
}
