import { create } from 'zustand'

interface UiState {
  /** Category tab the "Add Widget" drawer opens on; null when the drawer is closed. */
  drawerCategoryId: string | null
  /** Category the "Create widget" dialog adds to; null when the dialog is closed. */
  addWidgetCategoryId: string | null
  addCategoryOpen: boolean
  sidebarOpen: boolean
  openDrawer: (categoryId: string) => void
  closeDrawer: () => void
  openAddWidget: (categoryId: string) => void
  closeAddWidget: () => void
  setAddCategoryOpen: (open: boolean) => void
  setSidebarOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()((set) => ({
  drawerCategoryId: null,
  addWidgetCategoryId: null,
  addCategoryOpen: false,
  sidebarOpen: false,
  openDrawer: (drawerCategoryId) => set({ drawerCategoryId }),
  closeDrawer: () => set({ drawerCategoryId: null }),
  openAddWidget: (addWidgetCategoryId) => set({ addWidgetCategoryId }),
  closeAddWidget: () => set({ addWidgetCategoryId: null }),
  setAddCategoryOpen: (addCategoryOpen) => set({ addCategoryOpen }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}))
