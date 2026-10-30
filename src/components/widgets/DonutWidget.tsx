import { useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import type { Widget } from '../../types'

const formatNumber = (n: number) => n.toLocaleString('en-US')

export function DonutWidget({ widget }: { widget: Widget }) {
  const data = widget.data ?? []
  const sum = data.reduce((acc, d) => acc + d.value, 0)
  const total = { value: sum, label: widget.totalLabel ?? 'Total' }
  // Hovering a slice or legend row shows that slice in the centre instead of a floating tooltip.
  const [active, setActive] = useState<number | null>(null)
  const highlighted = active === null ? null : data[active]

  return (
    // Chart and legend sit side by side; they only stack when the card is very narrow.
    <div className="@container flex flex-1 items-center">
      <div className="flex w-full flex-col items-center gap-4 @[16rem]:flex-row @[16rem]:gap-5">
        <div className="relative size-[116px] shrink-0">
          <PieChart width={116} height={116}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={40}
              outerRadius={56}
              paddingAngle={2}
              cornerRadius={3}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
              onMouseEnter={(_, index) => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((d, i) => (
                <Cell
                  key={d.label}
                  fill={d.color}
                  fillOpacity={active === null || active === i ? 1 : 0.25}
                  className="cursor-pointer outline-none"
                />
              ))}
            </Pie>
          </PieChart>
          <div className="pointer-events-none absolute inset-0 grid place-content-center px-6 text-center">
            <span className="text-lg leading-tight font-semibold tabular-nums">
              {formatNumber(highlighted ? highlighted.value : total.value)}
            </span>
            <span className="truncate text-[11px] text-muted">{highlighted ? highlighted.label : total.label}</span>
          </div>
        </div>

        <ul className="grid w-full max-w-60 min-w-0 gap-0.5 text-[13px]" onMouseLeave={() => setActive(null)}>
          {data.map((d, i) => (
            <li
              key={d.label}
              onMouseEnter={() => setActive(i)}
              className={`flex items-center gap-2 rounded px-1.5 py-0.5 transition-colors ${
                active === i ? 'bg-card-inner' : ''
              }`}
            >
              <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: d.color }} />
              <span className={`min-w-0 flex-1 truncate ${active === i ? 'text-fg' : 'text-muted'}`}>{d.label}</span>
              <span className="font-medium tabular-nums">{formatNumber(d.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
