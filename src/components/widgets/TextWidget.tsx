import type { Widget } from '../../types'
import { EmptyWidget } from './EmptyWidget'

export function TextWidget({ widget }: { widget: Widget }) {
  if (!widget.text) return <EmptyWidget />

  return <p className="text-sm leading-relaxed whitespace-pre-line text-muted">{widget.text}</p>
}
