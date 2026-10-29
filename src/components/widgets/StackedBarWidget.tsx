import type { Widget } from '../../types'

const formatNumber = (n: number) => n.toLocaleString('en-US')

export function StackedBarWidget({ widget }: { widget: Widget }) {
  const data = widget.data ?? []
  const sum = data.reduce((acc, d) => acc + d.value, 0)
  const total = widget.total ?? { value: sum, label: 'Total' }

  return (
    <div className="flex flex-1 flex-col justify-center gap-5">
      <p className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight">{formatNumber(total.value)}</span>
        <span className="text-sm text-muted">{total.label}</span>
      </p>

      <div
        className="flex h-4 w-full gap-1 overflow-hidden rounded-full bg-card-inner"
        role="img"
        aria-label={data.map((d) => `${d.label} ${d.value}`).join(', ')}
      >
        {data
          .filter((d) => d.value > 0)
          .map((d) => (
            <div
              key={d.label}
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${(d.value / sum) * 100}%`, minWidth: 8, backgroundColor: d.color }}
              title={`${d.label}: ${formatNumber(d.value)}`}
            />
          ))}
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2.5 rounded-lg bg-card-inner px-3 py-2 text-sm">
            <span className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: d.color }} />
            <span className="flex-1 truncate text-muted">{d.label}</span>
            <span className="font-semibold tabular-nums">{formatNumber(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
