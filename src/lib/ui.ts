import { Cloud, Container, Folder, type LucideIcon, Server } from 'lucide-react'

export interface Accent {
  /** Solid colour, e.g. small markers. */
  solid: string
  /** Text colour for icons (lime is darkened in light mode for contrast). */
  text: string
  /** Tinted tile behind a category icon. */
  tile: string
  /** Very light wash for a category's header (light mode only). */
  wash: string
}

/** One accent per category, cycling through the palette. */
const ACCENTS: Accent[] = [
  {
    solid: 'bg-accent-blue',
    text: 'text-accent-blue',
    tile: 'bg-accent-blue/12 dark:bg-accent-blue/18',
    wash: 'bg-accent-blue/[0.04] dark:bg-transparent',
  },
  {
    solid: 'bg-accent-lime',
    text: 'text-lime-700 dark:text-accent-lime',
    tile: 'bg-accent-lime/18 dark:bg-accent-lime/15',
    wash: 'bg-accent-lime/[0.06] dark:bg-transparent',
  },
  {
    solid: 'bg-accent-purple',
    text: 'text-accent-purple',
    tile: 'bg-accent-purple/12 dark:bg-accent-purple/18',
    wash: 'bg-accent-purple/[0.04] dark:bg-transparent',
  },
  {
    solid: 'bg-accent-pink',
    text: 'text-accent-pink',
    tile: 'bg-accent-pink/12 dark:bg-accent-pink/18',
    wash: 'bg-accent-pink/[0.04] dark:bg-transparent',
  },
]

export const accentFor = (index: number) => ACCENTS[index % ACCENTS.length]

/** Icon names a category can use in dashboard.json; anything else falls back to a folder. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  cloud: Cloud,
  server: Server,
  container: Container,
}

export const categoryIcon = (name?: string) => (name && CATEGORY_ICONS[name]) || Folder

/** Focuses whichever global search box is visible (top bar on desktop, page header on mobile). */
export function focusSearch() {
  const inputs = document.querySelectorAll<HTMLInputElement>('[data-global-search]')
  Array.from(inputs).find((input) => input.offsetParent !== null)?.focus()
}
