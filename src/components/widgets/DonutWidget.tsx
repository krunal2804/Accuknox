import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import type { Widget } from '../../types'

const formatNumber = (n: number) => n.toLocaleString('en-US')

export function DonutWidget({ widget }: { widget: Widget }) {
  const data = widget.data ?? []
  const total = widget.total ?? { value: data.reduce((sum, d) => sum + d.value, 0), label: 'Total' }

  return (
    <div className="@container flex flex-1 items-center">
      <div className="flex w-full flex-col items-center gap-5 @sm:flex-row @sm:gap-6">
        <div className="relative size-[150px] shrink-0">
          <PieChart width={150} height={150}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              cornerRadius={8}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.label} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatNumber(Number(value))}
              contentStyle={{
                background: 'var(--card-inner)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 12,
              }}
              itemStyle={{ color: 'var(--fg)' }}
            />
          </PieChart>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <span className="text-2xl font-semibold tracking-tight">{formatNumber(total.value)}</span>
            <span className="text-xs text-muted">{total.label}</span>
          </div>
        </div>

        <ul className="grid w-full gap-2">
          {data.map((d) => (
            <li key={d.label} className="flex items-center gap-2.5 rounded-lg bg-card-inner px-3 py-2 text-sm">
              <span className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: d.color }} />
              <span className="flex-1 truncate text-muted">{d.label}</span>
              <span className="font-semibold tabular-nums">{formatNumber(d.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
