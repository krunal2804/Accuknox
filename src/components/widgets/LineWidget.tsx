import { useId } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { Widget } from '../../types'

const formatNumber = (n: number) => n.toLocaleString('en-US')
const LINE_COLOR = '#3b82f6'

export function LineWidget({ widget }: { widget: Widget }) {
  const data = widget.data ?? []
  const gradientId = useId()
  const last = data.at(-1)
  const previous = data.at(-2)
  const change = last && previous && previous.value !== 0 ? ((last.value - previous.value) / previous.value) * 100 : null

  return (
    <div className="flex flex-1 flex-col gap-2">
      {last && (
        <p className="flex items-baseline gap-2">
          <span className="text-2xl leading-none font-semibold tracking-tight tabular-nums">
            {formatNumber(last.value)}
          </span>
          <span className="text-[13px] text-muted">Latest · {last.label}</span>
          {change !== null && (
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                change >= 0 ? 'bg-success-soft text-success-fg' : 'bg-danger-soft text-danger-fg'
              }`}
            >
              {change >= 0 ? '+' : ''}
              {change.toFixed(1)}%
            </span>
          )}
        </p>
      )}

      <div className="h-28 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.3} />
                <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tick={{ fontSize: 11, fill: 'var(--subtle)' }}
            />
            <Tooltip
              cursor={{ stroke: 'var(--border)' }}
              formatter={(value) => [formatNumber(Number(value)), 'Value']}
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 12,
                boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
              }}
              labelStyle={{ color: 'var(--muted)' }}
              itemStyle={{ color: 'var(--fg)' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={LINE_COLOR}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
