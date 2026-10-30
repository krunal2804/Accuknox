import { create } from 'zustand'
import config from '../data/dashboard.json'
import type { Category, ChartDatum, DashboardConfig, Widget, WidgetType } from '../types'

const dashboardConfig = config as DashboardConfig

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

const initialCategories = (): Category[] => structuredClone(dashboardConfig.categories)

/** What the add / edit widget form submits. */
export interface WidgetInput {
  name: string
  text: string
  type: Exclude<WidgetType, 'empty'>
  /** Chart rows; ignored for text widgets. */
  data?: ChartDatum[]
}

/** Builds a widget from form input, keeping id, visibility and total label when editing. */
const buildWidget = ({ name, text, type, data }: WidgetInput, existing?: Widget): Widget => ({
  id: existing?.id ?? createId('widget'),
  visible: existing?.visible ?? true,
  name: name.trim(),
  type,
  // An empty text widget renders the "No graph data available" state.
  text: text.trim() || undefined,
  data: type === 'text' ? undefined : (data ?? []),
  totalLabel: type === 'donut' || type === 'bar' ? existing?.totalLabel : undefined,
})

interface DashboardState {
  title: string
  categories: Category[]
  searchQuery: string
  addWidget: (categoryId: string, input: WidgetInput) => void
  /** Replaces a widget's content; moves it when `toCategoryId` differs from its current category. */
  updateWidget: (widgetId: string, toCategoryId: string, input: WidgetInput) => void
  removeWidget: (categoryId: string, widgetId: string) => void
  /** Map of widgetId → visible, applied when the drawer is confirmed. */
  setWidgetVisibility: (updates: Record<string, boolean>) => void
  addCategory: (name: string, description?: string) => string
  setSearchQuery: (query: string) => void
  resetDashboard: () => void
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  title: dashboardConfig.title,
  categories: initialCategories(),
  searchQuery: '',

  addWidget: (categoryId, input) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id !== categoryId
          ? category
          : { ...category, widgets: [...category.widgets, buildWidget(input)] },
      ),
    })),

  updateWidget: (widgetId, toCategoryId, input) =>
    set((state) => {
      const from = state.categories.find((c) => c.widgets.some((w) => w.id === widgetId))
      const existing = from?.widgets.find((w) => w.id === widgetId)
      if (!from || !existing) return state
      const updated = buildWidget(input, existing)

      return {
        categories: state.categories.map((category) => {
          if (from.id === toCategoryId && category.id === from.id)
            return { ...category, widgets: category.widgets.map((w) => (w.id === widgetId ? updated : w)) }
          if (category.id === from.id)
            return { ...category, widgets: category.widgets.filter((w) => w.id !== widgetId) }
          if (category.id === toCategoryId) return { ...category, widgets: [...category.widgets, updated] }
          return category
        }),
      }
    }),

  removeWidget: (categoryId, widgetId) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id !== categoryId
          ? category
          : { ...category, widgets: category.widgets.filter((w) => w.id !== widgetId) },
      ),
    })),

  setWidgetVisibility: (updates) =>
    set((state) => ({
      categories: state.categories.map((category) => ({
        ...category,
        widgets: category.widgets.map((widget) =>
          widget.id in updates ? { ...widget, visible: updates[widget.id] } : widget,
        ),
      })),
    })),

  addCategory: (name, description) => {
    const id = createId('category')
    set((state) => ({
      categories: [
        ...state.categories,
        { id, name: name.trim(), description: description?.trim() || undefined, widgets: [] },
      ],
    }))
    return id
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  resetDashboard: () => set({ categories: initialCategories(), searchQuery: '' }),
}))
