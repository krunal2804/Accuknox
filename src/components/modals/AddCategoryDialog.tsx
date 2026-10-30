import { useState, type FormEvent } from 'react'
import { useDashboardStore } from '../../store/useDashboardStore'
import { useUiStore } from '../../store/useUiStore'
import { Button } from '../ui/Button'
import { Overlay, OverlayFooter, OverlayHeader } from '../ui/Overlay'
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
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-col">
      <OverlayHeader
        id="add-category-title"
        title="New category"
        subtitle="Categories group related widgets on the dashboard."
        onClose={onDone}
      />

      <div className="grid grid-cols-1 gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
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

      <OverlayFooter>
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary">
          Create category
        </Button>
      </OverlayFooter>
    </form>
  )
}
