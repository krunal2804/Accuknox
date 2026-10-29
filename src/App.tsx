import { FolderPlus } from 'lucide-react'
import { useEffect } from 'react'
import { CategorySection } from './components/dashboard/CategorySection'
import { SearchResults } from './components/dashboard/SearchResults'
import { StatsRow } from './components/dashboard/StatsRow'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { AddCategoryDialog } from './components/modals/AddCategoryDialog'
import { AddWidgetDialog } from './components/modals/AddWidgetDialog'
import { ManageWidgetsDrawer } from './components/modals/ManageWidgetsDrawer'
import { Button } from './components/ui/Button'
import { useDashboardStore } from './store/useDashboardStore'
import { useThemeStore } from './store/useThemeStore'
import { useUiStore } from './store/useUiStore'

export default function App() {
  const theme = useThemeStore((s) => s.theme)
  const categories = useDashboardStore((s) => s.categories)
  const searching = useDashboardStore((s) => s.searchQuery.trim() !== '')
  const setAddCategoryOpen = useUiStore((s) => s.setAddCategoryOpen)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-5 sm:px-6 lg:py-6 lg:pr-8 lg:pl-3">
        <Header />

        {searching ? (
          <SearchResults />
        ) : (
          <>
            <StatsRow />
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
            {categories.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-16">
                <p className="text-sm text-muted">No categories yet.</p>
                <Button variant="primary" onClick={() => setAddCategoryOpen(true)}>
                  <FolderPlus className="size-[18px]" aria-hidden="true" />
                  Create a category
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <ManageWidgetsDrawer />
      <AddWidgetDialog />
      <AddCategoryDialog />
    </div>
  )
}
