import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useUiStore } from '../../store/useUiStore'
import type { WidgetType } from '../../types'
import { Button } from '../ui/Button'
import { Overlay, OverlayFooter, OverlayHeader } from '../ui/Overlay'

const TYPE_LABEL: Record<WidgetType, string> = {
  donut: 'Donut chart',
  bar: 'Bar chart',
  empty: 'Graph',
  text: 'Text',
  line: 'Line chart',
}

/**
 * "Add Widget" side drawer from the reference design: a tab per category and a
 * checkbox per widget. Unchecking hides a widget; Confirm applies every tab at once.
 */
export function ManageWidgetsDrawer() {
  const categoryId = useUiStore((s) => s.drawerCategoryId)
  const close = useUiStore((s) => s.closeDrawer)

  return (
    <Overlay open={categoryId !== null} onClose={close} variant="drawer" labelledBy="drawer-title">
      {categoryId !== null && <DrawerContent initialCategoryId={categoryId} onDone={close} />}
    </Overlay>
  )
}

function DrawerContent({ initialCategoryId, onDone }: { initialCategoryId: string; onDone: () => void }) {
  const categories = useDashboardStore((s) => s.categories)
  const setWidgetVisibility = useDashboardStore((s) => s.setWidgetVisibility)
  const openAddWidget = useUiStore((s) => s.openAddWidget)
  const [activeId, setActiveId] = useState(initialCategoryId)
  // Only the checkboxes the user touched; widgets created while the drawer is open keep their own state.
  const [draft, setDraft] = useState<Record<string, boolean>>({})

  const active = categories.find((c) => c.id === activeId) ?? categories[0]
  const isChecked = (id: string, visible: boolean) => draft[id] ?? visible
  const changes = Object.keys(draft).length
  const selectedCount = active?.widgets.filter((w) => isChecked(w.id, w.visible)).length ?? 0

  const confirm = () => {
    setWidgetVisibility(draft)
    onDone()
  }

  return (
    <>
      <OverlayHeader
        id="drawer-title"
        title="Manage widgets"
        subtitle="Personalise your dashboard by choosing which widgets to show."
        onClose={onDone}
      />

      <div role="tablist" aria-label="Categories" className="flex flex-wrap gap-x-5 border-b border-line px-4 sm:px-6">
        {categories.map((category) => {
          const selected = category.id === active?.id
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`tab-${category.id}`}
              aria-selected={selected}
              aria-controls="drawer-panel"
              onClick={() => setActiveId(category.id)}
              className={`-mb-px border-b-2 py-3 text-[13px] font-medium transition-colors ${
                selected ? 'border-primary text-primary-strong' : 'border-transparent text-muted hover:text-fg'
              }`}
            >
              {category.name}
            </button>
          )
        })}
      </div>

      <div
        id="drawer-panel"
        role="tabpanel"
        aria-labelledby={active ? `tab-${active.id}` : undefined}
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
      >
        {active && (
          <p className="mb-3 text-xs font-medium tracking-wide text-subtle uppercase">
            {selectedCount} of {active.widgets.length} shown
          </p>
        )}

        {active && active.widgets.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-muted">
            No widgets in this category yet.
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line">
            {active?.widgets.map((widget) => {
              const checked = isChecked(widget.id, widget.visible)
              return (
                <li key={widget.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-card-inner">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const value = e.target.checked
                        setDraft((d) => {
                          const next = { ...d }
                          if (value === widget.visible) delete next[widget.id]
                          else next[widget.id] = value
                          return next
                        })
                      }}
                      className="size-4 rounded accent-[var(--primary)]"
                    />
                    <span className={`flex-1 text-sm ${checked ? 'font-medium' : 'text-muted'}`}>{widget.name}</span>
                    <span className="rounded bg-card-inner px-1.5 py-0.5 text-[11px] font-medium text-subtle">
                      {TYPE_LABEL[widget.type]}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}

        {active && (
          <Button size="sm" variant="ghost" onClick={() => openAddWidget(active.id)} className="mt-3 text-primary-strong">
            <Plus className="size-3.5" aria-hidden="true" />
            Create widget in {active.name}
          </Button>
        )}
      </div>

      <OverlayFooter>
        {changes > 0 && (
          <span className="mr-auto text-xs text-muted">
            {changes} unsaved change{changes > 1 ? 's' : ''}
          </span>
        )}
        <Button onClick={onDone}>Cancel</Button>
        <Button variant="primary" onClick={confirm}>
          Confirm
        </Button>
      </OverlayFooter>
    </>
  )
}
