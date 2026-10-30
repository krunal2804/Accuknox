import { FolderPlus, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useUiStore } from '../../store/useUiStore'
import { Button } from '../ui/Button'
import { SearchInput } from './SearchInput'

const RANGES = ['Last 2 days', 'Last 7 days', 'Last 30 days', 'This year']

export function PageHeader() {
  const title = useDashboardStore((s) => s.title)
  const categories = useDashboardStore((s) => s.categories)
  const resetDashboard = useDashboardStore((s) => s.resetDashboard)
  const openDrawer = useUiStore((s) => s.openDrawer)
  const setAddCategoryOpen = useUiStore((s) => s.setAddCategoryOpen)
  const [range, setRange] = useState(RANGES[0])

  const handleReset = () => {
    if (window.confirm('Reset the dashboard to the default widgets from dashboard.json?')) resetDashboard()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="mr-auto">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted">
            Cloud-native application protection overview across posture, workloads and registries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label>
            <span className="sr-only">Time range</span>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="h-9 rounded-md border border-line bg-card pr-8 pl-3 text-sm font-medium shadow-xs focus:ring-3 focus:ring-ring focus:outline-none"
            >
              {RANGES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <Button icon aria-label="Reset dashboard" title="Reset dashboard" onClick={handleReset}>
            <RotateCcw className="size-4" />
          </Button>
          <Button onClick={() => setAddCategoryOpen(true)}>
            <FolderPlus className="size-4" aria-hidden="true" />
            Add category
          </Button>
          <Button
            variant="primary"
            onClick={() => openDrawer(categories[0]?.id ?? '')}
            disabled={categories.length === 0}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add widget
          </Button>
        </div>
      </div>

      {/* The top bar search is hidden on small screens. */}
      <SearchInput className="md:hidden" />
    </div>
  )
}
