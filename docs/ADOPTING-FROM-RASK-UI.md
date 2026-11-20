# Switching an app from `@rask/ui` to `@riksarkivet/ui`

The exact steps for rask's console (`frontend/console` in `AI-Riksarkivet/rask`), which today compiles its own copy of
the design system, `@rask/ui` (`frontend/packages/ui`), from the workspace. After the switch the console depends on this
repository at a commit, the copy is deleted, and the app-specific pieces the copy held (its shell) move into the
console. Apart from the new look, what changes for a person is a few accessibility fixes, listed in
[What a person notices](#what-a-person-notices).

Everything below was derived from rask at `06442330a` (`git grep "@rask/ui" -- frontend/console/src`, and a diff of
every file the two copies share) and **applied to a scratch copy of rask's `frontend/`**. That copy type-checked with all
three of the console's `svelte-check` configs, passed its unit tests (140, up from 129 because the shell's breadcrumb
tests moved in), built, linted, and passed its Playwright suite, 267 of 267 (the specs that open rows into drawers
included) after the dock spec's three locator changes in step 7. The same copy pinned at this repository's first commit instead failed `svelte-check` with the 11 errors the
gap table predicts. What was not verified is marked **Not verified**.

## The gap table

Every subpath the console imports, the names it imports, and how this package compares. "The look" means a visual
difference only, which is the point of the switch.

| `@rask/ui/…`        | Imported names                                                                                                                                                                                                                                                                       | In `@riksarkivet/ui`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `alert-dialog`      | `AlertDialog`                                                                                                                                                                                                                                                                        | Same API. The look (a popover surface on the scrim, no zoom).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `badge`             | `Badge`                                                                                                                                                                                                                                                                              | Same variants. The look (a tag with a square of its tone).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `button`            | `Button`                                                                                                                                                                                                                                                                             | Same variants and sizes. The look; this package also styles `aria-pressed`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `card`              | `Card`                                                                                                                                                                                                                                                                               | Same. The look (a background step, no border or shadow).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `checkbox`          | `Checkbox`                                                                                                                                                                                                                                                                           | Same. The look; this package also styles the indeterminate state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `copy-button`       | `CopyButton`                                                                                                                                                                                                                                                                         | Identical.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `data-table`        | `DataTable`, `DataTableHeaderButton`, `DataTableTextFilter`, `createSvelteTable`, `getCoreRowModel`, `getFilteredRowModel`, `getPaginationRowModel`, `getSortedRowModel`, `renderComponent`, `renderSnippet`, `sortableHeader`, types `ColumnDef`, `PaginationState`, `SortingState` | All exported; `onrowclick` works unchanged and `rowLabel` is new and optional. **A row that opens is built differently** (step 3): the `<tr>` keeps its table semantics (rask's was `role="button"` with `tabindex="0"`, which flattened the cells and any link or field in them into one button), and the row opens from a real button the table puts in its first cell, visually hidden, named `Open <first column's value>`, its keyboard focus drawn as a ring around the whole row. A pointer click anywhere on the row still opens it, and a click on a control inside the row is that control's (rask's rule). This package also shows the pager whenever there is a second page, and its row-actions trigger keeps its click from the row. The look. |
| `dialog`            | `Dialog`                                                                                                                                                                                                                                                                             | Same. The look; the dialog keeps a 1 rem gutter at phone width.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `dropdown-menu`     | `* as DropdownMenu`                                                                                                                                                                                                                                                                  | A superset (`RadioGroup`, `RadioItem` added). An item passes `child` through in both. The look.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `input`             | `Input`                                                                                                                                                                                                                                                                              | Same. The look (a filled field with a bottom edge).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `motion`            | `enter`, `pop`                                                                                                                                                                                                                                                                       | Identical. `gsap` is an optional peer here: the console already depends on it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `popover`           | `* as Popover`                                                                                                                                                                                                                                                                       | Same. The look.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `select`            | `Select`                                                                                                                                                                                                                                                                             | Same props. **`aria-disabled="true"` on a disabled option was rask's and is now here** (Bits UI 2.18.1 and 2.21.0 set only `data-disabled`). The trigger is now named by its `ariaLabel` **and** the value it shows (`aria-labelledby`, "Sort by Created"), where both copies named it by `ariaLabel` alone, so a screen reader never heard the choice (WCAG 2.5.3). `getByLabel('<ariaLabel>')` still finds it. The listbox is at least as wide as its trigger. The look.                                                                                                                                                                                                                                                                                   |
| `sheet`             | `* as Sheet`                                                                                                                                                                                                                                                                         | Same parts. The look (the scrim, the drawer easing).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `skeleton`          | `Skeleton`                                                                                                                                                                                                                                                                           | Same. It stops pulsing under reduced motion. The look.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `table`             | `* as Table`                                                                                                                                                                                                                                                                         | Same. The look.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `tooltip`           | `* as Tooltip`                                                                                                                                                                                                                                                                       | Same. The look (no zoom).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `utils`             | `cn`, `formatZoned`                                                                                                                                                                                                                                                                  | **`formatZoned` (and `utcOffsetLabel`) were rask's and are now here**, with rask's tests. `cn` is identical.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `styles/tokens.css` | (stylesheet)                                                                                                                                                                                                                                                                         | Replaced by `@riksarkivet/ui/styles.css` (step 4). The tokens are a superset of rask's, the `--ink`/`--mut`/`--line`/`--panel` bridge included.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `shell`             | `AppShell`, `AppError`, types `PageNav`, `PageNavLeaf`, `ShellCrumb`                                                                                                                                                                                                                 | **Not in this package: moves into the console** (step 3).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

What the shell uses, which the console reached only through it:

| Used by the shell                                                                         | In `@riksarkivet/ui`                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sidebar` (the rail, `useSidebar`)                                                        | **Its phone-width sheet was rask's and is now here**: a title row on screen with the sheet's own close button, and no tooltip on its rows, so Escape on a row closes the sheet. Opening it puts focus on its first row, as rask's did (the close button is one Shift+Tab back), and closing it returns focus to the trigger. Its strings are props (`mobileTitle`, `mobileDescription`, `mobileCloseLabel`; defaults `Navigation`, `The pages you can go to.`, `Close`). |
| `IsMobile`, `SHELL_COLLAPSE_BREAKPOINT` (`hooks/is-mobile.svelte.js`, no subpath in rask) | **Now exported from `@riksarkivet/ui/sidebar`**, so the top bar folds at the width the sidebar does. `new IsMobile()` with no argument now folds there too (1024; the hook's old default was 768); the shell passes `SHELL_COLLAPSE_BREAKPOINT` explicitly, so it is unchanged.                                                                                                                                                                                          |
| `avatar`                                                                                  | Same parts. **The fallback's `data-slot` was rask's and is now here** (the root and the image carry one too).                                                                                                                                                                                                                                                                                                                                                            |
| `separator`, `collapsible`, `dropdown-menu`, `popover`, `button`, `utils`                 | As above.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `mode-watcher`'s `toggleMode` (rask's copy depended on `mode-watcher`)                    | Replaced by the appearance store (step 5).                                                                                                                                                                                                                                                                                                                                                                                                                               |

## 1. Dependencies

`frontend/console/package.json`, in `dependencies`:

```diff
-		"@rask/ui": "workspace:*",
+		"@riksarkivet/ui": "github:AI-Riksarkivet/ui#<full commit sha>",
+		"bits-ui": "2.18.1",
-		"horizon-layout": "1.0.5",
+		"horizon-layout": "2.0.2",
-		"mode-watcher": "^1.1.0",
-		"tw-animate-css": "^1.4.0",
```

Pin a full sha, never a branch (`docs/CONSUMING.md` § 1). `mode-watcher` goes because the appearance store owns the mode;
`tw-animate-css` goes because `styles.css` imports it.

`frontend/package.json` (the workspace root):

```diff
-	"workspaces": ["console", "packages/*"],
+	"workspaces": ["console"],
 	"scripts": {
-		"build-storybook": "bun --cwd=packages/ui run build-storybook",
-		"storybook": "bun --cwd=packages/ui run storybook",
 	},
 	"patchedDependencies": {
 		"apache-arrow@21.2.0": "patches/apache-arrow@21.2.0.patch",
-		"horizon-layout@1.0.5": "patches/horizon-layout@1.0.5.patch"
+		"bits-ui@2.18.1": "patches/bits-ui@2.18.1.patch"
 	},
```

Copy `patches/bits-ui@2.18.1.patch` from this repository into `frontend/patches/` and delete
`frontend/patches/horizon-layout@1.0.5.patch`. Then `bun install` from `frontend/`; `bun.lock` records the commit.

### Peers

The app now owns one copy of each (`docs/CONSUMING.md` § 1 says why):

| Peer              | Range     | The console                                                                               |
| ----------------- | --------- | ----------------------------------------------------------------------------------------- |
| `svelte`          | `^5.56.8` | `^5.57.3`, overridden to `5.57.3`. In range.                                              |
| `bits-ui`         | `^2.18.1` | Was a dependency of `@rask/ui` (`^2.21.0`, resolved 2.21.0) and is now the console's own. |
| `tailwindcss`     | `^4.3.3`  | `^4.3.5`. In range.                                                                       |
| `vite`            | `^8.3.8`  | `^8.3.8`. In range.                                                                       |
| `gsap` (optional) | `^3.15.0` | `^3.15.1`, which `@riksarkivet/ui/motion` and the shell use.                              |

**Why `bits-ui` 2.18.1 and its patch:** it is the version this package's tests and Storybook run on, and the one the
workbench ships. The patch keeps a closing dialog or menu from raising Svelte's `derived_inert` warning on every Escape.
2.21.0 is inside the peer range, but **not verified** against this package. The scratch run above used 2.18.1 with the
patch.

## 2. Imports

Every `@rask/ui/<x>` the console imports has the same subpath and the same names here, except `shell`:

```bash
cd frontend/console
grep -rl "@rask/ui/" src e2e | xargs sed -i "s#'@rask/ui/shell'#'\#lib/shell/index.ts'#; s#'@rask/ui/#'@riksarkivet/ui/#g"
```

| Before                           | After                                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `@rask/ui/shell`                 | `#lib/shell/index.ts` (step 3)                                                                       |
| `@rask/ui/styles/tokens.css`     | `@riksarkivet/ui/styles.css` (step 4)                                                                |
| `@rask/ui/<every other subpath>` | `@riksarkivet/ui/<same subpath>`                                                                     |
| `@rask/ui` (root barrel)         | Not imported by the console. Here it no longer re-exports `motion`; import `@riksarkivet/ui/motion`. |

Comments and e2e prose that still say `@rask/ui` read wrongly afterwards: `grep -rn "@rask/ui" frontend/console` should
come back empty.

## 3. What moves into the console: the shell

Move `frontend/packages/ui/src/lib/shell/` to `frontend/console/src/lib/shell/`: `app-shell.svelte`, `app-sidebar.svelte`,
`app-error.svelte`, `page-nav.svelte`, `navbar-user.svelte`, `activity-center.svelte`, `breadcrumb.ts`, `nav-config.ts`
and `index.ts`. Move `frontend/packages/ui/tests/breadcrumb.test.ts` to `frontend/console/src/lib/shell/breadcrumb.test.ts`
(the console's vitest runs `--dir src`). `activity-center.stories.svelte` has no Storybook to run in: delete it, or
keep the states it shows as a test.

Rewrite the shell's relative imports:

| In the shell                                                               | Becomes                                      |
| -------------------------------------------------------------------------- | -------------------------------------------- |
| `'../components/<x>/index.js'`                                             | `'@riksarkivet/ui/<x>'`                      |
| `'../components/sidebar/context.svelte.js'` (`useSidebar`)                 | `'@riksarkivet/ui/sidebar'`                  |
| `'../hooks/is-mobile.svelte.js'` (`IsMobile`, `SHELL_COLLAPSE_BREAKPOINT`) | `'@riksarkivet/ui/sidebar'`                  |
| `'../utils/cn.js'`, `'../utils/timestamp.js'`                              | `'@riksarkivet/ui/utils'`                    |
| `'../src/lib/shell/breadcrumb.js'` (the test)                              | `'./breadcrumb.ts'`                          |
| `'./<file>.js'`                                                            | `'./<file>.ts'` (the console's own spelling) |

Two edits keep what a person sees and does:

- **The sheet's title.** rask's sheet read "Pages" with the description "The console's pages."; this package's defaults
  are neutral. In `app-sidebar.svelte`:
  `<Sidebar.Root collapsible="icon" mobileTitle="Pages" mobileDescription="The console's pages.">`.
- **The theme toggle.** `navbar-user.svelte` toggled with `mode-watcher`. Replace the import with
  `import { appearance } from '@riksarkivet/ui/appearance';` and the item's handler with
  `onclick={() => appearance.set({ mode: appearance.dark ? 'light' : 'dark' })}`. Its Sun/Moon icons follow `.dark`, which
  the store sets. (`AppearanceMenu` offers the themes and a custom accent as well; that is a new feature, not part of the
  switch.)

### A row that opens

`onrowclick` works unchanged: the console's five clickable tables (`DlqPanel`, `NamespaceRegistry`, `TableHistory`,
`TableRegistry`, `WarehouseAdmin`) compile and run without an edit. Each row now gets a visually hidden button in its
first cell (the first column that is not the selection checkbox), named `Open <that column's value>`:
`Open <run id>`, `Open <namespace>`, `Open 3`, `Open <table id>`, `Open <warehouse id>`. One prop is worth adding where
that name reads badly: in `TableHistory`, ``rowLabel={(row) => `Show version ${row.version}`}``.

Why: rask's row was a `<tr role="button" tabindex="0">`. A button's children are presentational, so a screen reader
heard the whole row (and any link or field in it) flattened into one button's name, and the role override took the
row out of the table (axe `nested-interactive`, WCAG 4.1.2). This package keeps the table a table and gives the row
one real control, the WAI-ARIA Authoring Practices' data-table pattern: interactive things in a static table are
controls in its cells, and the table is not made a grid. The row's pointer click is a convenience on top.

What a person notices: Tab still stops once per row before that row's own links and fields, now on the row's button,
and a ring is drawn around the whole row (rask's row had no focus ring of its own). Enter and Space open the row from
there, as they did. A click anywhere on the row still opens it.

Lint and knip follow the move. In `frontend/.oxlintrc.json`, the override that turns off
`svelte/no-navigation-without-resolve` for `packages/ui/**` (root hrefs a library cannot `resolve()`) now names
`console/src/lib/shell/**`, or the shell's links call `resolve()` now that it is app code. In `frontend/knip.json`, the
`packages/ui` workspace block goes.

## 4. The stylesheet

`frontend/console/src/app.css`:

```diff
 @import 'tailwindcss';
-@import 'tw-animate-css';
-@import '@rask/ui/styles/tokens.css';
+@import '@riksarkivet/ui/styles.css';
 …
 @import 'horizon-layout/horizon-layout.css' layer(base);
-@import './lib/dock/theme.css' layer(base);
+@import '@riksarkivet/ui/styles/horizon-layout.css' layer(base);
 …
-/* Scan the shared @rask/ui component library so its Tailwind classes are generated —
-   Tailwind 4 ignores node_modules by default. */
-@source '../../packages/ui/src';
```

`styles.css` brings the fonts, `tw-animate-css`, the themes and tokens, and its own `@source` over the package's
sources, its stories and tests excluded. Delete `frontend/console/src/lib/dock/theme.css` (the package's dock theme
replaces it and also themes a floating group and a popout), and fix the app.css comment that names it. Svelte Flow's
sheet and `./lib/flow/styles.css` stay as they are.

## 5. Appearance: the Vite plugin, the boot script and the store

Today the console runs `<ModeWatcher defaultMode="dark" />`: a first visit is dark whatever the system says, and the
choice is kept under mode-watcher's default key, `mode-watcher-mode`. The options that keep that:

```ts
// frontend/console/src/lib/appearance-options.ts
import type { AppearanceOptions } from '@riksarkivet/ui/appearance';

export const APPEARANCE: AppearanceOptions = {
	storageKey: 'rask-console-appearance',
	defaults: { theme: 'ink', mode: 'dark' },
};
```

- `vite.config.ts`: `import { riksarkivetUi } from '@riksarkivet/ui/vite';` and
  `import { APPEARANCE } from './src/lib/appearance-options.ts';`, then `riksarkivetUi(APPEARANCE)` in `plugins`, after
  `consoleConfig()` and before `tailwindcss()`.
- `src/app.html`, in `<head>` before `%sveltekit.head%`:
  `<script src="%sveltekit.assets%/appearance-boot.js"></script>`. The console's CSP has `script-src 'self'`, which
  admits it with no hash.
- `src/routes/+layout.svelte`: drop `import { ModeWatcher } from 'mode-watcher'` and `<ModeWatcher defaultMode="dark" />`,
  import `appearance` and `APPEARANCE`, and add `$effect(() => appearance.start(APPEARANCE));`.

A person who chose light under mode-watcher gets the default, dark, once, and their next choice is kept under the new
key. The old `mode-watcher-mode` entry is not read. `ink` is this package's default theme; rask's palette is not
carried over, because it is the old look.

## 6. The image build

`.docker/frontend.dockerfile` copies each workspace package's manifest before the install and its sources after. With
`frontend/packages/` gone, both copies have nothing to copy:

```diff
 COPY frontend/console/package.json console/package.json
-COPY --parents frontend/./packages/*/package.json /src/
 …
 COPY frontend/console console
-COPY frontend/packages packages
```

`bun install --frozen-lockfile` now fetches `@riksarkivet/ui` from GitHub at the locked commit, so the builder needs
network access to github.com at install time. The workbench's image installs with `--ignore-scripts`; this package
runs no install script either way. Also fix the comment that says the console compiles `@rask/ui` from source.
**Not verified:** the image build (it goes through Dagger, which this check did not run).

## 7. horizon-layout 2.0.2, and the dock spec

rask's `horizon-layout@1.0.5.patch` added the tab-list ARIA ids (each tab names its panel, the panel names its tab) and
moved focus to the group a moved tab landed in. 2.0.2 does both itself: its tab list points at the active tab with
`aria-activedescendant` and owns its tabs by `aria-owns`, and the layout moves focus to the receiving group's tab list.
The console's dock code type-checks against 2.0.2 unchanged.

Three things in `e2e/workbench/dock.spec.ts` read 1.0.5's DOM and need changing for 2.0.2. The behaviour they check holds:

- A tab list's tabs are no longer its DOM descendants. `lists.first().getByRole('tab')` and
  `lists.filter({ has: tab(page, 'Events') })` find nothing. Read the ids in the list's `aria-owns` instead (the scratch
  run used a small `ownedTabs(list)` and `focusedListOwns(page)` that map those ids to the tabs' text).
- The resizer is a focusable `separator` (the window-splitter pattern), not a `slider`:
  `getByRole('separator', { name: 'Resize pane 1' })`. Its `aria-valuenow` steps as before.

## 8. What to delete, reword or leave

Every hit of `git grep -nE "packages/ui|@rask/ui|make storybook|storybook|Storybook"` over the whole of rask at
`06442330a`, outside `frontend/packages/ui` itself and `frontend/bun.lock` (which `bun install` rewrites):

| Where                                                                                                                                                                                                                                                                               | What to do                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `frontend/packages/ui/` (with `components.json`, its tests, its `README.md`), and the empty `frontend/packages/`                                                                                                                                                                    | Delete.                                                                                                                                                                  |
| `frontend/package.json` `:12`, `:22` (the `storybook` scripts), `workspaces`                                                                                                                                                                                                        | Step 1.                                                                                                                                                                  |
| `frontend/console/package.json:24`                                                                                                                                                                                                                                                  | Step 1.                                                                                                                                                                  |
| `frontend/console/src/**` (62 files: imports, and comments naming `@rask/ui` in `ProjectGallery`, `AccessGraph`, `AccessGraphNode`, `NamespaceRegistry`, `RowDrawer`, `TableHistory`, `TablePreview`, `TableProperties`, `TableRegistry`, `flow/index.ts`, `routes/+layout.svelte`) | Imports: step 2. Comments: reword to "the design system" or `@riksarkivet/ui`.                                                                                           |
| `frontend/console/src/app.css` (3 hits)                                                                                                                                                                                                                                             | Step 4.                                                                                                                                                                  |
| `frontend/console/e2e/admin/data-grants.spec.ts:90`, `data-namespace-detail.spec.ts:121`, `data-namespaces.spec.ts:167` and `:228`, `tables-detail.spec.ts:400`, `:763` and `:949`, `catalog/shell-responsive.spec.ts:4`                                                            | Comments: reword (`:228` and `shell-responsive.spec.ts:4` describe the shell, now the console's own).                                                                    |
| `frontend/.oxlintrc.json:68-71`                                                                                                                                                                                                                                                     | Step 3 (the override names `console/src/lib/shell/**`). `:90` (`storybook-static` ignore): delete.                                                                       |
| `frontend/knip.json:23`                                                                                                                                                                                                                                                             | Step 3 (delete the block).                                                                                                                                               |
| `frontend/.gitignore:7`, `frontend/.oxfmtrc.json:12` (`storybook-static`)                                                                                                                                                                                                           | Delete: nothing builds one in rask any more.                                                                                                                             |
| `frontend/README.md:36-37`, `:80-86`                                                                                                                                                                                                                                                | Reword: one workspace member; the design system is `@riksarkivet/ui`; drop the Storybook row.                                                                            |
| `frontend/TOOLING.md:73`                                                                                                                                                                                                                                                            | Reword.                                                                                                                                                                  |
| `.docker/frontend.dockerfile:45`                                                                                                                                                                                                                                                    | Step 6.                                                                                                                                                                  |
| `.github/workflows/docs.yml:39`, `:53-57`                                                                                                                                                                                                                                           | Delete the Storybook comment and the "Build Storybook" and "Copy Storybook into docs site" steps, with "Install Bun" and "Install dependencies", which served only them. |
| `Makefile:1` (`.PHONY`), `:5` (help), `:100-101` (the target)                                                                                                                                                                                                                       | Delete. `:114` (`clean` removes `**/storybook-static`): delete that path. `:337` (comment naming `frontend/packages/ui`): reword.                                        |
| `README.md:57` (layout entry), `:154` (`make storybook` row)                                                                                                                                                                                                                        | Reword the layout entry; delete the row.                                                                                                                                 |
| `CLAUDE.md:156` (Storybook command row), `:314-315` (layout entry), `:333` and `:336` (workspace glob and the sentence on `frontend/packages/`), `:415` (members), `:489` (skill routing)                                                                                           | Delete `:156`; reword the rest to one member and `@riksarkivet/ui`.                                                                                                      |
| `docs/getting-started/index.md:74`                                                                                                                                                                                                                                                  | Delete the Storybook row.                                                                                                                                                |
| `docs/architecture/layout.md:39`                                                                                                                                                                                                                                                    | Delete the row (the shell is under `frontend/console/src/lib/shell`).                                                                                                    |
| `docs/architecture/deployment.md:262` (the shared `@rask/ui` shell), `:414` (docs.yml builds Storybook)                                                                                                                                                                             | Reword: the shell is the console's; docs.yml builds the docs site only.                                                                                                  |
| `docs/packages/index.md:9`                                                                                                                                                                                                                                                          | Delete the row.                                                                                                                                                          |
| `docs/contributions/CONTRIBUTING.md:11` (points at `frontend/packages/ui/README.md`, which is deleted)                                                                                                                                                                              | Point at `AI-Riksarkivet/ui`'s `README.md` and `DESIGN.md`.                                                                                                              |
| `.gitignore:41` (comment naming the `@rask/ui` harness)                                                                                                                                                                                                                             | Reword. `.gitignore:25` (`storybook-static/`): delete.                                                                                                                   |
| `.claude/README.md:12`, `.claude/skills/rask-styling/**` (all of it describes `@rask/ui`), `.claude/skills/rask-frontend/SKILL.md` (18 hits), `.claude/skills/rask-architecture/SKILL.md:58`, `:145`                                                                                | Rewrite `rask-styling` as how the console uses `@riksarkivet/ui` (or drop it in favour of this repository's `DESIGN.md`); reword the others.                             |
| `docs/adr/0201-…` (11 hits), `0202-…` (3), `0200-…:40`, `docs/adr/README.md:210`                                                                                                                                                                                                    | Leave: ADRs are history. Add an ADR that supersedes 0201's "`@rask/ui` is the one package", and mark 0201 superseded in `docs/adr/README.md`.                            |
| `.dagger/{gitops,images,install,release,scan}.go` (`**/storybook-static` in comments that mirror `.dockerignore`), `.dockerignore:49`, `.vscode/settings.json:25`, `:35`                                                                                                            | Leave: harmless excludes of a directory nothing creates any more. The Dagger comments mirror `.dockerignore`, so change both or neither.                                 |
| `tests/unit/test_comment_history_gate.py:97` (`frontend/packages/ui/src/lib/x.ts` as a sample path)                                                                                                                                                                                 | Reword to a console path (`frontend/console/src/lib/x.ts`); the test passes either way.                                                                                  |

## What a person notices

Apart from the look:

- **A clickable table row** reads as a row of cells with a button `Open …` in its first cell, and shows a focus ring
  around the whole row when that button has the keyboard (step 3).
- **A select** is announced with its value as well as its label ("Sort by Created", where it was "Sort by").
- **The phone-width sheet** is unchanged in behaviour: title row "Pages" with a close button, focus on the first row
  when it opens, Escape from a row closes it, and focus returns to the trigger.
- **A first visit** is dark, as before; an earlier light/dark choice made under mode-watcher is not carried over
  (step 5).

## 9. Checklist

Run from `frontend/` unless noted:

- [ ] From the repository root, `git grep -nE "packages/ui|@rask/ui|make storybook|[Ss]torybook" -- . ':!docs/adr'` lists only the
      excludes step 8 chooses to leave (no source, prose, workflow or skill names the old package).
- [ ] `bun install --frozen-lockfile` succeeds from a clean checkout; `bun.lock` names `@riksarkivet/ui` at the pinned sha
      and has one `bits-ui` and one `svelte`.
- [ ] `bun run check` (the console's three `svelte-check` configs) is clean.
- [ ] `bun run test`: the console's suites plus the shell's breadcrumb tests.
- [ ] `bun run lint`, `bun run fmt:check`, `bun run knip`. knip's "unlisted binary `serve.ts`" in
      `console/e2e/console-config.spec.ts` is there before the switch too (measured on `06442330a`).
- [ ] `bun run test:e2e`, every spec green, `catalog/shell-responsive.spec.ts` included: at phone width the sheet has a
      visible Close button that closes it, Escape on a row closes it, and picking a page closes it. The Account menu's
      Toggle theme switches light and dark, and the choice survives a reload.
- [ ] A first visit in a fresh profile is dark, with no flash of light before the app's script runs (the boot script).
- [ ] Every list of moments still prints `YYYY-MM-DD HH:mm:ss UTC+01:00` (`formatZoned`).
- [ ] A click on a link, a button or a checkbox inside a clickable table row does that control's thing only; a click
      elsewhere on the row opens it. Tab reaches each row's button (a ring around the row), and Enter or Space opens
      it. A screen reader reads the table as rows and cells, with a button named `Open …` in each row's first cell.
- [ ] A disabled option in a select is announced as unavailable, and a select is announced with its value
      ("Sort by Created").
- [ ] The dock: a tab moves with Ctrl+Arrow and splits with Alt+Arrow, the keyboard follows it, a popout window is
      themed, and a floating group is themed.
- [ ] The console image builds through `scripts/dagger-image.sh --name frontend` and the deployed console renders signed
      in (**not verified** by this guide's scratch run).
