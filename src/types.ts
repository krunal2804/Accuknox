export type WidgetType = 'donut' | 'bar' | 'empty' | 'text'

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
  total?: { value: number; label: string }
  data?: ChartDatum[]
}

export interface Category {
  id: string
  name: string
  description?: string
  widgets: Widget[]
}

export interface DashboardConfig {
  title: string
  categories: Category[]
}
