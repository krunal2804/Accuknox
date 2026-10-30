export type WidgetType = 'donut' | 'bar' | 'line' | 'empty' | 'text'

export interface ChartDatum {
  label: string
  value: number
  color: string
}

export interface Widget {
  id: string
  name: string
  type: WidgetType
  /** Unchecking a widget in the "Add Widget" drawer hides it without deleting it. */
  visible: boolean
  text?: string
  /** Label under the total; the total itself is always the sum of `data`. */
  totalLabel?: string
  data?: ChartDatum[]
}

export interface Category {
  id: string
  name: string
  description?: string
  /** Icon name: "cloud" | "server" | "container" (anything else shows a folder). */
  icon?: string
  widgets: Widget[]
}

export interface DashboardConfig {
  title: string
  categories: Category[]
}
