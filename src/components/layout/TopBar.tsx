import { ChevronRight, Menu, Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { useThemeStore } from '../../store/useThemeStore'
import { useUiStore } from '../../store/useUiStore'
import { Button } from '../ui/Button'
import { focusSearch } from '../../lib/ui'
import { ProfileMenu } from './ProfileMenu'
import { SearchInput } from './SearchInput'

export function TopBar() {
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  // Ctrl/Cmd + K focuses the global search.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        focusSearch()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-sidebar px-4 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        icon
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(true)}
        className="-ml-2 lg:hidden"
      >
        <Menu className="size-5" />
      </Button>

      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm text-muted">
        <span className="max-sm:hidden">Home</span>
        <ChevronRight className="size-4 text-subtle max-sm:hidden" aria-hidden="true" />
        <span className="truncate font-medium text-fg" aria-current="page">
          Dashboard V2
        </span>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <SearchInput className="w-72 max-md:hidden xl:w-80" />
        <Button
          variant="ghost"
          icon
          aria-label={`Switch to ${nextTheme} theme`}
          title={`Switch to ${nextTheme} theme`}
          onClick={() => setTheme(nextTheme)}
        >
          {theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </Button>
        <span className="mx-1 h-6 w-px bg-line max-sm:hidden" aria-hidden="true" />
        <ProfileMenu />
      </div>
    </header>
  )
}
