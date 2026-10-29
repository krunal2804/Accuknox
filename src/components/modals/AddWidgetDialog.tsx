import { X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useUiStore } from '../../store/useUiStore'
import { Button } from '../ui/Button'
import { Overlay } from '../ui/Overlay'
import { fieldClass, labelClass } from './formStyles'

export function AddWidgetDialog() {
  const categoryId = useUiStore((s) => s.addWidgetCategoryId)
  const close = useUiStore((s) => s.closeAddWidget)

  return (
    <Overlay open={categoryId !== null} onClose={close} labelledBy="add-widget-title">
      {/* Keyed so the form resets each time the dialog opens. */}
      {categoryId !== null && <AddWidgetForm key={categoryId} initialCategoryId={categoryId} onDone={close} />}
    </Overlay>
  )
}

function AddWidgetForm({ initialCategoryId, onDone }: { initialCategoryId: string; onDone: () => void }) {
  const categories = useDashboardStore((s) => s.categories)
  const addWidget = useDashboardStore((s) => s.addWidget)
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Widget name is required.')
      return
    }
    addWidget(categoryId, { name, text })
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="add-widget-title" className="text-lg font-semibold">
            Add widget
          </h2>
          <p className="mt-1 text-sm text-muted">Give the widget a name and some text.</p>
        </div>
        <Button variant="ghost" icon aria-label="Close" onClick={onDone} className="-mt-1 -mr-2">
          <X className="size-5" />
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-1.5">
          <span className={labelClass}>Category</span>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={fieldClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>
            Widget name <span className="text-danger-fg">*</span>
          </span>
          <input
            data-autofocus
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="e.g. Open Findings"
            maxLength={60}
            aria-invalid={!!error}
            aria-describedby={error ? 'widget-name-error' : undefined}
            className={`${fieldClass} ${error ? 'border-danger-fg' : ''}`}
          />
          {error && (
            <span id="widget-name-error" className="text-xs text-danger-fg">
              {error}
            </span>
          )}
        </label>

        <label className="grid gap-1.5">
          <span className={labelClass}>Widget text</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Leave empty to use placeholder text"
            className={`${fieldClass} h-auto resize-none py-2.5`}
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary">
          Add widget
        </Button>
      </div>
    </form>
  )
}
