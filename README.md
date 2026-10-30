# AccuKnox CNAPP Dashboard

A dynamic, JSON-driven security dashboard built with React for the **AccuKnox Frontend Trainee Assignment**.

**Live demo:** https://krunal2804.github.io/Accuknox/

The dashboard is built entirely from a JSON file of **categories**, each holding several **widgets**. You can add, edit, remove, hide and search widgets, and create new categories. All of it is managed locally with a Zustand store.

## Features

### Assignment requirements

| # | Requirement | How it works |
|---|-------------|--------------|
| 1 | Build the dashboard from JSON (categories → widgets) | `src/data/dashboard.json` defines every category and widget, and the UI renders whatever is in it |
| 2 | Add / remove widgets in a category | Zustand store actions `addWidget` and `removeWidget` |
| 3 | Widgets show text | Text widgets show the text you enter. Without text they show a "No graph data available" state |
| 4 | **+ Add Widget** → name + text → added to that category | Each category has a dashed **Add Widget** card that opens a form with the category preselected |
| 5 | ✕ removes a widget, or uncheck it in the category list | ✕ on every widget. **Add widget** / **Manage** opens a drawer with a tab per category, where unchecking + **Confirm** hides widgets |
| 6 | Search all widgets | Search box in the top bar (or **Ctrl / Cmd + K**) searches every widget, including hidden ones |

### Extras

- **Widget types:** Text, Donut, Bar and Line charts. Chart widgets have an editable data table with custom colours.
- **Edit widgets:** the ✏️ icon changes the name, text, type or data, or moves a widget to another category.
- **Add categories** from the page header or the sidebar.
- **Accurate totals:** chart totals are always calculated from the data.
- **Interactive charts:** hovering a slice or legend row highlights it, and donut charts show the value in the centre.
- **Dark / light theme:** a GitHub-style dark mode, remembered across reloads.
- **Responsive layout:** three columns on desktop down to one column on mobile, with a slide-in sidebar.
- **Accessible:** keyboard-friendly dialogs (Esc to close, focus trap) and labelled buttons.
- **Reset** button restores the original JSON data.

## Technologies

| Purpose | Technology |
|---------|------------|
| UI library | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build tool / dev server | [Vite](https://vite.dev) |
| State management | [Zustand](https://zustand.docs.pmnd.rs) (the theme is persisted to localStorage) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) with CSS design tokens for both themes |
| Charts | [Recharts](https://recharts.org) |
| Icons | [lucide-react](https://lucide.dev) |
| Linting | [oxlint](https://oxc.rs) |
| Hosting | GitHub Pages, deployed by GitHub Actions |

## Getting started

### Prerequisites

- **Node.js 20.19+** (or 22.12+). Check with `node -v`
- **npm** (comes with Node.js)
- **Git**

### Run locally

```bash
# 1. Clone the repository
git clone https://github.com/krunal2804/Accuknox.git

# 2. Go into the project folder
cd Accuknox

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Available scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Type-checks and builds a production version into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Lints the code with oxlint |

## How to use the dashboard

1. **Browse:** the dashboard has three categories (CSPM, CWPP, Registry Scan). Use the sidebar to jump to one.
2. **Add a widget:** click the dashed **+ Add Widget** card in a category. Pick a type (Text, Donut, Bar or Line), enter a name, and for charts edit the data rows. Then click **Add widget**.
3. **Edit a widget:** click the ✏️ icon on any widget, change what you need, then click **Save changes**.
4. **Remove a widget:** click the ✕ icon on the widget.
5. **Show / hide widgets:** click **Add widget** in the page header (or **Manage** on a category). Pick a category tab, tick or untick widgets, then click **Confirm**.
6. **Search:** type in the top-bar search (or press **Ctrl + K**). Results include hidden widgets, which you can show again from there.
7. **Add a category:** click **Add category** in the page header or **New category** in the sidebar.
8. **Theme:** switch between light and dark mode with the sun / moon icon in the top bar.
9. **Reset:** the ↺ button restores the original data from `dashboard.json`.

> Widget changes are kept **in memory**, as the assignment asks ("add / remove widget locally"). Refreshing the page restores the JSON defaults.

## Project structure

```
├── .github/workflows/deploy.yml   # Builds and publishes the site to GitHub Pages
├── public/                        # Logos and favicon
├── src/
│   ├── data/dashboard.json        # Dashboard definition (categories → widgets)
│   ├── types.ts                   # Category / Widget TypeScript types
│   ├── store/
│   │   ├── useDashboardStore.ts   # Categories, widgets, search + actions
│   │   ├── useThemeStore.ts       # Light / dark theme (persisted)
│   │   └── useUiStore.ts          # Which drawer / dialog is open
│   ├── components/
│   │   ├── layout/                # Sidebar, TopBar, ProfileMenu, PageHeader, SearchInput
│   │   ├── dashboard/             # CategorySection, WidgetCard, SearchResults
│   │   ├── widgets/               # DonutWidget, StackedBarWidget, LineWidget, EmptyWidget, TextWidget
│   │   ├── modals/                # WidgetDialog (add + edit), ManageWidgetsDrawer, AddCategoryDialog
│   │   └── ui/                    # Button, Overlay (modal shell), CategoryIcon
│   ├── lib/                       # Shared helpers (accent colours, icons, popover hook)
│   ├── App.tsx                    # App shell
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind + light / dark design tokens
├── index.html
├── package.json
└── vite.config.ts
```

## Dashboard JSON format

`src/data/dashboard.json` drives the whole dashboard:

```jsonc
{
  "title": "CNAPP Dashboard",
  "categories": [
    {
      "id": "cspm",
      "name": "CSPM Executive Dashboard",
      "description": "Cloud security posture across connected accounts",
      "icon": "cloud",                // "cloud" | "server" | "container" (anything else shows a folder)
      "widgets": [
        {
          "id": "cloud-accounts",
          "name": "Cloud Accounts",
          "type": "donut",            // "donut" | "bar" | "line" | "text" | "empty"
          "visible": true,            // false = hidden (can be shown again from the drawer)
          "totalLabel": "Total",      // the total value is always the sum of the data
          "data": [
            { "label": "Connected", "value": 2, "color": "#3b82f6" },
            { "label": "Not Connected", "value": 2, "color": "#c084fc" }
          ]
        }
      ]
    }
  ]
}
```

Edit this file to add, change or remove categories and widgets. No code changes are needed.

## State management

All dashboard state lives in one Zustand store (`src/store/useDashboardStore.ts`):

| Action | Purpose |
|--------|---------|
| `addWidget(categoryId, input)` | Adds a text, donut, bar or line widget |
| `updateWidget(widgetId, toCategoryId, input)` | Edits a widget and can move it to another category |
| `removeWidget(categoryId, widgetId)` | Deletes a widget (✕ button) |
| `setWidgetVisibility({ [widgetId]: boolean })` | Shows or hides widgets (drawer checkboxes) |
| `addCategory(name, description?)` | Creates a new, empty category |
| `setSearchQuery(query)` | Filters widgets by name, text or category |
| `resetDashboard()` | Restores the original JSON data |

## Deployment

Every push to `main` runs the **Deploy to GitHub Pages** workflow (`.github/workflows/deploy.yml`). It installs dependencies, builds the app, and publishes `dist/` to the `gh-pages` branch, which GitHub Pages serves at https://krunal2804.github.io/Accuknox/.

If the site isn't live after the first run, open the repository's **Settings → Pages** and set **Source** to **Deploy from a branch**, branch **`gh-pages`**, folder **`/ (root)`**.

## Author

**Krunal Parikh**: [krunalparikh08@gmail.com](mailto:krunalparikh08@gmail.com)

© 2026 Krunal Parikh. All rights reserved.
