import { ChartNoAxesColumn } from 'lucide-react'

export function EmptyWidget() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line py-6 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-card-inner text-subtle">
        <ChartNoAxesColumn className="size-5" aria-hidden="true" />
      </span>
      <p className="text-sm text-muted">No graph data available!</p>
    </div>
  )
}
