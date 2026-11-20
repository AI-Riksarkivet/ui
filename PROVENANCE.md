# Provenance

The first version of this repository is the design system the workbench carried as `@workbench/ui`, taken from the
workbench repository (`AI-Riksarkivet/workbench`) at commit `2a83eb10bd6f5be7aada28ef1aef0c6abab64a32`
(`frontend/packages/ui`, 2026-11-18), with one component from rask's copy, `@rask/ui`, taken from the rask repository
at commit `bf247003e` (`frontend/packages/ui`; unchanged at `fa749b38c`).

## Carried over

The tokens and themes (`src/lib/styles/`), the appearance store, its record definition and its picker
(`src/lib/appearance/`), the color-mode hook, the motion attachments, the utilities, every design-system component with
its story and tests, `THIRD_PARTY.md`, and the Storybook setup.

From rask's copy: `copy-button` and its story.

## Ported from rask's copy before its console adopts the package

Taken from rask's `frontend/packages/ui` at `06442330a`, each rewritten in this package's look and with a test of its
own (`docs/ADOPTING-FROM-RASK-UI.md` has the full comparison):

- `formatZoned` and `utcOffsetLabel` in `@riksarkivet/ui/utils`.
- The data table's rule that a click on a control inside a row is the control's. rask's row was `role="button"` with
  `tabindex="0"`; here the row keeps its table semantics and opens from a real button in its first cell instead.
- The sidebar's phone-width sheet: a title row on screen with its own close button, focus on the first row when it
  opens, no tooltip on its rows, and its strings as props (`mobileTitle`, `mobileDescription`, `mobileCloseLabel`)
  where rask's copy wrote its own.
- `aria-disabled` on a select's disabled option. The trigger's name holding its value is this package's own fix; neither
  copy had it.
- The avatar fallback's `data-slot` (and the root's and the image's, which neither copy had).

## Changed on the way

- The package is `@riksarkivet/ui`, at the repository root.
- The appearance's localStorage key and first-visit defaults are the consuming app's (`AppearanceOptions`): the key
  that named the workbench is gone, and the package's own defaults are the key `appearance` and the `ink` theme
  following the system's mode.
- The boot script's source moved from the workbench app's `vite.config.ts` (its `appearanceBoot` plugin) into the
  package as `@riksarkivet/ui/vite` (`riksarkivetUi`), which also leaves the package out of Vite's pre-bundling. The
  `./appearance-boot` subpath is gone; `bootAppearance` in `core.ts` is what the script runs.
- One stylesheet entry, `@riksarkivet/ui/styles.css` (fonts, `tw-animate-css`, themes, tokens, and the `@source` of
  the package), replaces the `@import` and `@source` lines each app wrote.
- The horizon-layout dock theme moved from the workbench app (`frontend/app/src/lib/dock/theme.css`) into the package
  as `@riksarkivet/ui/styles/horizon-layout.css`.
- `resizable-split`'s default storage key is `resizable-split`.
- The root barrel no longer re-exports `motion` (it needs the optional peer `gsap`), `search-bar` or `grants-panel`.
- Comments, stories and tests that named an app, its routes or its services were rewritten to state their rationale
  without them.
- Stories were written for every exported component that had none, and Storybook gained a theme and mode toolbar.
- `THIRD_PARTY.md` gained the shadcn-svelte MIT notice.
- The `bits-ui@2.18.1` patch the workbench applies is applied here too, for this repository's own Storybook and tests.

## Left behind, and where it lives instead

| Left behind                                                                                                                           | Why                                                                                            | Where it lives                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/shell/` (app shell, top navbar, zone nav, nav config, breadcrumbs, project switcher, navbar user, error and forbidden pages) | App code: an app's frame, its routes and its zones                                             | Each app's own shell (the workbench app already has `frontend/app/src/lib/shell`; rask's console imports `@rask/ui/shell` today and moves it into the console when it adopts this package) |
| `components/hierarchy`                                                                                                                | A project › warehouse › namespace › table view drawn on `@workbench/flow` and `@xyflow/svelte` | The app that renders it (rask moved its own into the console under ADR 0201)                                                                                                               |
| `components/grants-panel`, `components/grant-form`                                                                                    | An access-review panel over one catalog's grants API                                           | The app that governs those grants                                                                                                                                                          |
| `components/identity` (`Subject`)                                                                                                     | Displays an authorization subject (`type:id`, an OIDC subject)                                 | The app that lists members (the workbench's project members panel)                                                                                                                         |
| `components/search-bar`                                                                                                               | A dataset search with match reasons, typed to one app's hits                                   | The app that searches                                                                                                                                                                      |
| `tests/nav-config.test.ts`, `tests/breadcrumb.test.ts`                                                                                | Tests of the shell                                                                             | With the shell                                                                                                                                                                             |
| Dependencies `@workbench/flow`, `@xyflow/svelte`                                                                                      | Used only by `hierarchy`                                                                       | The app                                                                                                                                                                                    |
