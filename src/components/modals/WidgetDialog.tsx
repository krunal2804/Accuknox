import { ChartBarStacked, ChartPie, ChartSpline, type LucideIcon, Plus, TextAlignStart, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useDashboardStore, type WidgetInput } from '../../store/useDashboardStore'
import { useUiStore, type WidgetEditorTarget } from '../../store/useUiStore'
import type { Widget } from '../../types'
import { Button } from '../ui/Button'
import { Overlay, OverlayFooter, OverlayHeader } from '../ui/Overlay'
import { fieldBase, fieldClass, labelClass } from './formStyles'

type EditableType = WidgetInput['type']
interface Row {
  label: string
  value: string
  color: string
}

const TYPES: { value: EditableType; label: string; icon: LucideIcon }[] = [
  { value: 'text', label: 'Text', icon: TextAlignStart },
  { value: 'donut', label: 'Donut', icon: ChartPie },
  { value: 'bar', label: 'Bar', icon: ChartBarStacked },
  { value: 'line', label: 'Line', icon: ChartSpline },
]

/** Default segment colours for donut / bar rows, in order. */
const ROW_COLORS = ['#3b82f6', '#84cc16', '#a855f7', '#ec4899', '#f59e0b', '#14b8a6', '#ef4444', '#64748b']
const MAX_ROWS = ROW_COLORS.length

const sampleRows = (type: Exclude<EditableType, 'text'>): Row[] => {
  const rows: [string, number][] =
    type === 'line'
      ? [['Mon', 12], ['Tue', 18], ['Wed', 15], ['Thu', 22], ['Fri', 30], ['Sat', 26], ['Sun', 34]]
      : [['Critical', 12], ['High', 30], ['Medium', 45], ['Low', 60]]
  return rows.map(([label, value], i) => ({ label, value: String(value), color: ROW_COLORS[i % ROW_COLORS.length] }))
}

const nextColor = (rows: Row[]) => ROW_COLORS.find((c) => !rows.some((r) => r.color === c)) ?? ROW_COLORS[0]

/** Add / edit widget dialog. */
export function WidgetDialog() {
  const target = useUiStore((s) => s.widgetEditor)
  const close = useUiStore((s) => s.closeWidgetEditor)
  const categories = useDashboardStore((s) => s.categories)
  const editing =
    target?.mode === 'edit'
      ? categories.flatMap((c) => c.widgets).find((w) => w.id === target.widgetId)
      : undefined

  return (
    <Overlay open={target !== null} onClose={close} labelledBy="widget-dialog-title">
      {/* Keyed so the form resets each time the dialog opens. */}
      {target && (
        <WidgetForm
          key={target.mode === 'edit' ? target.widgetId : `add-${target.categoryId}`}
          target={target}
          widget={editing}
          onDone={close}
        />
      )}
    </Overlay>
  )
}

interface WidgetFormProps {
  target: WidgetEditorTarget
  /** The widget being edited; undefined when adding. */
  widget?: Widget
  onDone: () => void
}

function WidgetForm({ target, widget, onDone }: WidgetFormProps) {
  const categories = useDashboardStore((s) => s.categories)
  const addWidget = useDashboardStore((s) => s.addWidget)
  const updateWidget = useDashboardStore((s) => s.updateWidget)
  const isEdit = target.mode === 'edit'

  // "empty" preset widgets are edited as text widgets without text.
  const initialType: EditableType = !widget || widget.type === 'empty' ? 'text' : widget.type
  const [categoryId, setCategoryId] = useState(target.categoryId)
  const [type, setType] = useState<EditableType>(initialType)
  const [name, setName] = useState(widget?.name ?? '')
  const [text, setText] = useState(widget?.text ?? '')
  const [rows, setRows] = useState<Row[]>(
    widget?.data?.map((d) => ({ label: d.label, value: String(d.value), color: d.color })) ?? [],
  )
  const [rowsEdited, setRowsEdited] = useState(rows.length > 0)
  const [nameError, setNameError] = useState('')
  const [dataError, setDataError] = useState('')

  const isChart = type !== 'text'

  const changeType = (next: EditableType) => {
    setType(next)
    setDataError('')
    // Swap in sample rows for the new chart type unless there is real data to keep.
    if (next !== 'text' && (!rowsEdited || rows.length === 0)) {
      setRows(sampleRows(next))
      setRowsEdited(false)
    }
  }

  const updateRow = (index: number, patch: Partial<Row>) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)))
    setRowsEdited(true)
    setDataError('')
  }

  const validateRows = () => {
    if (rows.length === 0) return 'Add at least one data row.'
    if (rows.some((r) => !r.label.trim())) return 'Every row needs a label.'
    if (rows.some((r) => r.value.trim() === '' || Number.isNaN(Number(r.value)) || Number(r.value) < 0))
      return 'Values must be numbers of 0 or more.'
    if (type !== 'line' && rows.every((r) => Number(r.value) === 0)) return 'At least one value must be above 0.'
    return ''
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextNameError = name.trim() ? '' : 'Widget name is required.'
    const nextDataError = isChart ? validateRows() : ''
    setNameError(nextNameError)
    setDataError(nextDataError)
    if (nextNameError || nextDataError) return

    const input: WidgetInput = {
      name,
      text,
      type,
      data: isChart ? rows.map((r) => ({ label: r.label.trim(), value: Number(r.value), color: r.color })) : undefined,
    }
    if (target.mode === 'edit') updateWidget(target.widgetId, categoryId, input)
    else addWidget(categoryId, input)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-col">
      <OverlayHeader
        id="widget-dialog-title"
        title={isEdit ? 'Edit widget' : 'Add widget'}
        subtitle={isEdit ? 'Update the widget content, type or data.' : 'Create a custom widget and add it to a category.'}
        onClose={onDone}
      />

      <div className="grid grid-cols-1 gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
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

        <fieldset className="grid min-w-0 grid-cols-1 gap-1.5">
          <legend className={`${labelClass} mb-1.5`}>Widget type</legend>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2" role="radiogroup">
            {TYPES.map(({ value, label, icon: Icon }) => {
              const selected = type === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => changeType(value)}
                  className={`flex min-w-0 flex-col items-center gap-1.5 rounded-md border px-1 py-2.5 text-xs font-medium transition-colors ${
                    selected
                      ? 'border-primary bg-primary-soft text-primary-strong'
                      : 'border-line text-muted hover:bg-card-inner hover:text-fg'
                  }`}
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                  {label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="grid gap-1.5">
          <span className={labelClass}>
            Widget name <span className="text-danger-fg">*</span>
          </span>
          <input
            data-autofocus
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError('')
            }}
            placeholder="e.g. Open Findings"
            maxLength={60}
            aria-invalid={!!nameError}
            aria-describedby={nameError ? 'widget-name-error' : undefined}
            className={`${fieldClass} ${nameError ? 'border-danger-fg' : ''}`}
          />
          {nameError && (
            <span id="widget-name-error" className="text-xs text-danger-fg">
              {nameError}
            </span>
          )}
        </label>

        {isChart && (
          <fieldset className="grid min-w-0 grid-cols-1 gap-2">
            <legend className={`${labelClass} mb-1.5`}>
              Data{' '}
              <span className="font-normal text-subtle">({type === 'line' ? 'x-axis label' : 'segment'}, value)</span>
            </legend>
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                {type === 'line' ? (
                  <span className="w-6 text-center text-xs text-subtle tabular-nums">{i + 1}</span>
                ) : (
                  <label
                    className="relative size-6 shrink-0 cursor-pointer overflow-hidden rounded-md ring-1 ring-line"
                    style={{ backgroundColor: row.color }}
                    title="Change colour"
                  >
                    <span className="sr-only">Row {i + 1} colour</span>
                    <input
                      type="color"
                      value={row.color}
                      onChange={(e) => updateRow(i, { color: e.target.value })}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </label>
                )}
                <input
                  aria-label={`Row ${i + 1} label`}
                  value={row.label}
                  onChange={(e) => updateRow(i, { label: e.target.value })}
                  placeholder="Label"
                  maxLength={24}
                  className={`${fieldBase} min-w-0 flex-1`}
                />
                <input
                  aria-label={`Row ${i + 1} value`}
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={row.value}
                  onChange={(e) => updateRow(i, { value: e.target.value })}
                  placeholder="0"
                  className={`${fieldBase} w-20 shrink-0 px-2.5 tabular-nums sm:w-24 sm:px-3`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon
                  aria-label={`Remove row ${i + 1}`}
                  onClick={() => {
                    setRows((current) => current.filter((_, j) => j !== i))
                    setRowsEdited(true)
                  }}
                  disabled={rows.length === 1}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRows((current) => [...current, { label: '', value: '', color: nextColor(current) }])
                  setRowsEdited(true)
                }}
                disabled={rows.length >= MAX_ROWS}
                className="-ml-3 text-primary-strong"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                Add row
              </Button>
              <span className="text-xs text-subtle">
                {type === 'line' ? `${rows.length}/${MAX_ROWS} points` : `Total ${rows.reduce((s, r) => s + (Number(r.value) || 0), 0).toLocaleString('en-US')}`}
              </span>
            </div>
            {dataError && <span className="text-xs text-danger-fg">{dataError}</span>}
          </fieldset>
        )}

        <label className="grid gap-1.5">
          <span className={labelClass}>{isChart ? 'Description' : 'Widget text'}</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={isChart ? 2 : 4}
            placeholder={
              isChart ? 'Optional, shown under the widget title' : 'Optional. Empty widgets show "No graph data available"'
            }
            className={`${fieldClass} h-auto resize-none py-2`}
          />
        </label>
      </div>

      <OverlayFooter>
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary">
          {isEdit ? 'Save changes' : 'Add widget'}
        </Button>
      </OverlayFooter>
    </form>
  )
}
