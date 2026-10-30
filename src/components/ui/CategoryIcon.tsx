import { createElement } from 'react'
import { categoryIcon } from '../../lib/ui'

/** Renders the icon named in a category's JSON ("cloud", "server", "container", …). */
export function CategoryIcon({ name, className }: { name?: string; className?: string }) {
  return createElement(categoryIcon(name), { className, 'aria-hidden': true })
}
