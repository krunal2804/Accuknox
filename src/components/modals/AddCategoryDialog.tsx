import { X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useUiStore } from '../../store/useUiStore'
import { Button } from '../ui/Button'
import { Overlay } from '../ui/Overlay'
import { fieldClass, labelClass } from './formStyles'

export function AddCategoryDialog() {
  const open = useUiStore((s) => s.addCategoryOpen)
  const setOpen = useUiStore((s) => s.setAddCategoryOpen)
  const close = () => setOpen(false)

  return (
    <Overlay open={open} onClose={close} labelledBy="add-category-title">
      {open && <AddCategoryForm onDone={close} />}
    </Overlay>
  )
}

function AddCategoryForm({ onDone }: { onDone: () => void }) {
  const categories = useDashboardStore((s) => s.categories)
  const addCategory = useDashboardStore((s) => s.addCategory)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Category name is required.')
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase()))
      return setError('A category with this name already exists.')

    const id = addCategory(trimmed, description)
    onDone()
    // Scroll to the new section once it has rendered.
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="add-category-title" className="text-lg font-semibold">
            New category
          </h2>
          <p className="mt-1 text-sm text-muted">Categories group related widgets on the dashboard.</p>
        </div>
        <Button variant="ghost" icon aria-label="Close" onClick={onDone} className="-mt-1 -mr-2">
          <X className="size-5" />
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-1.5">
          <span className={labelClass}>
            Category name <span className="text-danger-fg">*</span>
          </span>
          <input
            data-autofocus
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="e.g. Ticket Dashboard"
            maxLength={50}
            aria-invalid={!!error}
            aria-describedby={error ? 'category-name-error' : undefined}
            className={`${fieldClass} ${error ? 'border-danger-fg' : ''}`}
          />
          {error && (
            <span id="category-name-error" className="text-xs text-danger-fg">
              {error}
            </span>
          )}
        </label>
        <label className="grid gap-1.5">
          <span className={labelClass}>Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            maxLength={80}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary">
          Create category
        </Button>
      </div>
    </form>
  )
}
