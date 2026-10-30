import { create } from 'zustand'

/** What the widget dialog is doing: adding to a category, or editing an existing widget. */
export type WidgetEditorTarget = { mode: 'add'; categoryId: string } | { mode: 'edit'; categoryId: string; widgetId: string }

interface UiState {
  /** Category tab the "Manage widgets" drawer opens on; null when the drawer is closed. */
  drawerCategoryId: string | null
  /** Open widget dialog; null when closed. */
  widgetEditor: WidgetEditorTarget | null
  addCategoryOpen: boolean
  sidebarOpen: boolean
  openDrawer: (categoryId: string) => void
  closeDrawer: () => void
  openAddWidget: (categoryId: string) => void
  openEditWidget: (categoryId: string, widgetId: string) => void
  closeWidgetEditor: () => void
  setAddCategoryOpen: (open: boolean) => void
  setSidebarOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  drawerCategoryId: null,
  widgetEditor: null,
  addCategoryOpen: false,
  sidebarOpen: false,
  openDrawer: (drawerCategoryId) => set({ drawerCategoryId }),
  closeDrawer: () => set({ drawerCategoryId: null }),
  openAddWidget: (categoryId) => set({ widgetEditor: { mode: 'add', categoryId } }),
  openEditWidget: (categoryId, widgetId) => set({ widgetEditor: { mode: 'edit', categoryId, widgetId } }),
  closeWidgetEditor: () => set({ widgetEditor: null }),
  setAddCategoryOpen: (addCategoryOpen) => set({ addCategoryOpen }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}))
