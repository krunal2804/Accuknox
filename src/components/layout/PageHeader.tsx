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
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          <p className="mt-1 text-[13px] text-muted sm:text-sm">
            Cloud-native application protection overview across posture, workloads and registries.
          </p>
        </div>

        {/* Phones: range + reset on one row, the two actions sharing the next. From `sm` up: one inline row. */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <label className="flex-1 sm:flex-none">
              <span className="sr-only">Time range</span>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="h-9 w-full rounded-md border border-line bg-card pr-8 pl-3 text-sm font-medium shadow-xs focus:ring-3 focus:ring-ring focus:outline-none"
              >
                {RANGES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <Button icon aria-label="Reset dashboard" title="Reset dashboard" onClick={handleReset}>
              <RotateCcw className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
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
      </div>

      {/* The top bar search is hidden on small screens. */}
      <SearchInput className="md:hidden" />
    </div>
  )
}
