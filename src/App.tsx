import { FolderPlus } from 'lucide-react'
import { useEffect } from 'react'
import { CategorySection } from './components/dashboard/CategorySection'
import { SearchResults } from './components/dashboard/SearchResults'
import { PageHeader } from './components/layout/PageHeader'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { AddCategoryDialog } from './components/modals/AddCategoryDialog'
import { ManageWidgetsDrawer } from './components/modals/ManageWidgetsDrawer'
import { WidgetDialog } from './components/modals/WidgetDialog'
import { Button } from './components/ui/Button'
import { useDashboardStore } from './store/useDashboardStore'
import { useThemeStore } from './store/useThemeStore'
import { useUiStore } from './store/useUiStore'

const YEAR = new Date().getFullYear()

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

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-5 px-3 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <PageHeader />

          {searching ? (
            <SearchResults />
          ) : (
            <>
              {categories.map((category, index) => (
                <CategorySection key={category.id} category={category} index={index} />
              ))}
              {categories.length === 0 && (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line bg-card py-16">
                  <p className="text-sm text-muted">No categories yet.</p>
                  <Button variant="primary" onClick={() => setAddCategoryOpen(true)}>
                    <FolderPlus className="size-4" aria-hidden="true" />
                    Create a category
                  </Button>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="border-t border-line px-3 py-4 text-center text-xs text-subtle sm:px-6 sm:text-left lg:px-8">
          © {YEAR} Krunal Parikh. All rights reserved.
        </footer>
      </div>

      <ManageWidgetsDrawer />
      <WidgetDialog />
      <AddCategoryDialog />
    </div>
  )
}
