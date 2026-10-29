# CNAPP Dashboard

A dynamic, JSON-driven security dashboard built for the **Frontend Trainee Assignment**.
Categories and widgets are loaded from a JSON file, and users can add, remove, hide and search widgets (and add categories) — all managed in a Zustand store.
The visual style (dark / light themes, rounded cards, sidebar layout, lime/blue/purple/pink chart palette) is inspired by the BoardUI marketing template.

## Tech stack

| Purpose          | Library                                   |
| ---------------- | ----------------------------------------- |
| UI               | React 19 + TypeScript                     |
| Build tool       | Vite                                      |
| State management | Zustand (theme persisted to localStorage) |
| Styling          | Tailwind CSS v4                           |
| Charts           | Recharts                                  |
| Icons            | lucide-react                              |

## Run locally

Prerequisites: **Node.js 20.19+ (or 22.12+)** and npm.

```bash
# 1. Go into the project folder
cd cnapp-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

Other scripts:

```bash
npm run build     # type-check and build for production into dist/
npm run preview   # serve the production build locally
```

## Features (mapped to the assignment)

| # | Requirement | Where |
|---|-------------|-------|
| 1 | Build the dashboard from JSON with categories → widgets | `src/data/dashboard.json`, loaded by `src/store/useDashboardStore.ts` |
| 2 | Add / remove widgets in a category | Zustand actions `addWidget`, `removeWidget` |
| 3 | Widgets show random text | Custom widgets show the text entered, or random placeholder text if left empty. Preset widgets render charts from their JSON data |
| 4 | "+ Add Widget" → enter name and text → added to that category | Dashed **Add Widget** card in each category opens `AddWidgetDialog` with the category preselected |
| 5 | ✕ icon removes a widget, or uncheck it in the category list | ✕ on each card (hover on desktop). Header **Add Widget** opens the side drawer with a tab per category: uncheck → **Confirm** hides the widget |
| 6 | Search all widgets | Header search (or **Ctrl/Cmd + K**) filters every widget, including hidden ones, by name, text or category |

Extras: dark / light theme toggle (remembered across reloads), sidebar that jumps to each category, **Add category**, dashboard summary stats, **Reset** to the original JSON, responsive layout down to mobile, keyboard-accessible modals (Esc to close, focus trap).

## Project structure

```
src/
  data/dashboard.json            # Dashboard definition (categories → widgets)
  types.ts                       # Category / Widget types
  store/
    useDashboardStore.ts         # Categories, widgets, search query + actions
    useThemeStore.ts             # Light / dark theme (persisted)
    useUiStore.ts                # Which drawer / dialog is open
  components/
    layout/      Sidebar, Header
    dashboard/   CategorySection, WidgetCard, StatsRow, SearchResults
    widgets/     DonutWidget, StackedBarWidget, EmptyWidget, TextWidget
    modals/      ManageWidgetsDrawer, AddWidgetDialog, AddCategoryDialog
    ui/          Button, Overlay (shared modal shell)
  App.tsx, main.tsx, index.css   # App shell, theme tokens
```

## JSON format

```jsonc
{
  "title": "CNAPP Dashboard",
  "categories": [
    {
      "id": "cspm",
      "name": "CSPM Executive Dashboard",
      "description": "optional",
      "widgets": [
        {
          "id": "cloud-accounts",
          "name": "Cloud Accounts",
          "type": "donut",          // "donut" | "bar" | "empty" | "text"
          "visible": true,          // false = hidden via the drawer
          "total": { "value": 2, "label": "Total" },
          "data": [{ "label": "Connected", "value": 2, "color": "#3b82f6" }],
          "text": "used by text widgets"
        }
      ]
    }
  ]
}
```

To add, change or remove widgets or categories, edit `src/data/dashboard.json`. The dashboard renders whatever is there.

## Store actions (`useDashboardStore`)

- `addWidget(categoryId, { name, text })` adds a text widget to a category.
- `removeWidget(categoryId, widgetId)` deletes a widget (the ✕ button).
- `setWidgetVisibility({ [widgetId]: boolean })` shows or hides widgets (the drawer checkboxes).
- `addCategory(name, description?)` creates an empty category.
- `setSearchQuery(query)` filters widgets.
- `resetDashboard()` restores the original JSON.

Widget changes are kept in memory, as the assignment asks ("add widget and remove widget locally"). A page refresh restores the JSON defaults.
