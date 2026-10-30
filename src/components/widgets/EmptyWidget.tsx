import { ChartNoAxesColumn } from 'lucide-react'

export function EmptyWidget() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1.5 text-center">
      <ChartNoAxesColumn className="mb-1 size-7 text-subtle" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-sm font-medium">No graph data available</p>
      <p className="text-xs text-subtle">Data appears once a source is connected.</p>
    </div>
  )
}
