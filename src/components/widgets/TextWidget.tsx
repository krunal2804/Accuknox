import type { Widget } from '../../types'

export function TextWidget({ widget }: { widget: Widget }) {
  return (
    <div className="flex flex-1 rounded-xl bg-card-inner p-4">
      <p className="text-sm leading-relaxed whitespace-pre-line text-muted">{widget.text}</p>
    </div>
  )
}
