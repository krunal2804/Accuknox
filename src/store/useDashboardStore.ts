import { create } from 'zustand'
import config from '../data/dashboard.json'
import type { Category, DashboardConfig } from '../types'

const dashboardConfig = config as DashboardConfig

const PLACEHOLDER_TEXT = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
  'Monitoring data for this widget will appear here once a data source is connected.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
  'Quick summary of findings, trends and recommended next steps for your team.',
]

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

const initialCategories = (): Category[] => structuredClone(dashboardConfig.categories)

interface DashboardState {
  title: string
  categories: Category[]
  searchQuery: string
  addWidget: (categoryId: string, input: { name: string; text: string }) => void
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

  addWidget: (categoryId, { name, text }) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id !== categoryId
          ? category
          : {
              ...category,
              widgets: [
                ...category.widgets,
                {
                  id: createId('widget'),
                  name: name.trim(),
                  type: 'text',
                  visible: true,
                  text:
                    text.trim() ||
                    PLACEHOLDER_TEXT[Math.floor(Math.random() * PLACEHOLDER_TEXT.length)],
                },
              ],
            },
      ),
    })),

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
