import { useState } from 'react'
import type { Widget } from '../../types'

const formatNumber = (n: number) => n.toLocaleString('en-US')

export function StackedBarWidget({ widget }: { widget: Widget }) {
  const data = widget.data ?? []
  const sum = data.reduce((acc, d) => acc + d.value, 0)
  const total = { value: sum, label: widget.totalLabel ?? 'Total' }
  // Hovering a segment or legend row highlights the pair.
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="flex flex-1 flex-col justify-center gap-3" onMouseLeave={() => setActive(null)}>
      <p className="flex items-baseline gap-2">
        <span className="text-2xl leading-none font-semibold tracking-tight tabular-nums">
          {formatNumber(total.value)}
        </span>
        <span className="text-[13px] text-muted">{total.label}</span>
      </p>

      <div
        className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-card-inner"
        role="img"
        aria-label={data.map((d) => `${d.label} ${d.value}`).join(', ')}
      >
        {data
          .filter((d) => d.value > 0)
          .map((d) => (
            <div
              key={d.label}
              onMouseEnter={() => setActive(d.label)}
              className="h-full cursor-pointer transition-opacity first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${(d.value / sum) * 100}%`,
                minWidth: 6,
                backgroundColor: d.color,
                opacity: active === null || active === d.label ? 1 : 0.3,
              }}
            />
          ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[13px]">
        {data.map((d) => (
          <li
            key={d.label}
            onMouseEnter={() => setActive(d.label)}
            className={`flex items-center gap-2 rounded px-1.5 py-0.5 transition-colors ${
              active === d.label ? 'bg-card-inner' : ''
            }`}
          >
            <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className={`min-w-0 flex-1 truncate ${active === d.label ? 'text-fg' : 'text-muted'}`}>
              {d.label}
            </span>
            <span className="font-medium tabular-nums">{formatNumber(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
