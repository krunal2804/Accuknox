import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useUiStore } from '../../store/useUiStore'
import type { WidgetType } from '../../types'
import { Button } from '../ui/Button'
import { Overlay } from '../ui/Overlay'

const TYPE_LABEL: Record<WidgetType, string> = {
  donut: 'Donut chart',
  bar: 'Bar chart',
  empty: 'Graph',
  text: 'Text',
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

  const confirm = () => {
    setWidgetVisibility(draft)
    onDone()
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-line p-6">
        <div>
          <h2 id="drawer-title" className="text-lg font-semibold">
            Add Widget
          </h2>
          <p className="mt-1 text-sm text-muted">Personalise your dashboard by adding the following widgets.</p>
        </div>
        <Button variant="ghost" icon aria-label="Close" onClick={onDone} className="-mt-1 -mr-2">
          <X className="size-5" />
        </Button>
      </div>

      <div role="tablist" aria-label="Categories" className="flex gap-1 overflow-x-auto border-b border-line px-4">
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
              className={`relative shrink-0 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                selected ? 'text-primary' : 'text-muted hover:text-fg'
              }`}
            >
              {category.name}
              {selected && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
            </button>
          )
        })}
      </div>

      <div
        id="drawer-panel"
        role="tabpanel"
        aria-labelledby={active ? `tab-${active.id}` : undefined}
        className="flex-1 overflow-y-auto p-4"
      >
        {active && active.widgets.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
            No widgets in this category yet.
          </p>
        )}
        <ul className="grid gap-2">
          {active?.widgets.map((widget) => {
            const checked = isChecked(widget.id, widget.visible)
            return (
              <li key={widget.id}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                    checked ? 'border-primary/40 bg-primary/5' : 'border-line bg-card hover:bg-card-inner'
                  }`}
                >
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
                    className="size-4 accent-[var(--primary)]"
                  />
                  <span className="flex-1 text-sm font-medium">{widget.name}</span>
                  <span className="rounded-md bg-card-inner px-2 py-0.5 text-xs text-muted">
                    {TYPE_LABEL[widget.type]}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>

        {active && (
          <button
            type="button"
            onClick={() => openAddWidget(active.id)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line p-3 text-sm font-medium text-muted hover:border-primary hover:text-primary"
          >
            <Plus className="size-4" aria-hidden="true" />
            Create widget in {active.name}
          </button>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-line p-4">
        {changes > 0 && (
          <span className="mr-auto text-xs text-muted">
            {changes} unsaved change{changes > 1 ? 's' : ''}
          </span>
        )}
        <Button onClick={onDone}>Cancel</Button>
        <Button variant="primary" onClick={confirm}>
          Confirm
        </Button>
      </div>
    </>
  )
}
