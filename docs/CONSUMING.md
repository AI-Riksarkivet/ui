# Using @riksarkivet/ui in an app

An app depends on this repository at a commit, compiles the package from source with its own Vite and Svelte, and
imports one stylesheet and one Vite plugin. The two apps it was made for, the workbench and rask's console, are
SvelteKit single-page apps built with Vite and bun; the steps below are written for that setup.

There is no release, tag or registry publish, and none is needed: the commit is the version.

## 1. The dependency

In the app's `package.json`, pinned to a full commit sha:

```json
{
	"dependencies": {
		"@riksarkivet/ui": "github:AI-Riksarkivet/ui#<full commit sha>",
		"bits-ui": "2.18.1",
		"svelte": "^5.56.8",
		"tailwindcss": "^4.3.3"
	},
	"devDependencies": {
		"@tailwindcss/vite": "^4.3.3",
		"vite": "^8.3.8"
	}
}
```

`bun install` clones the repository at that commit and installs it whole, `src/` included, and `bun.lock` records the
resolved commit. Pin a sha, never a branch: a branch moves under the lockfile. `git+https://github.com/AI-Riksarkivet/ui.git#<sha>`
is the same dependency spelled as a URL.

### Peer dependencies: the app owns one copy of each

| Package           | Why it is a peer                                                                                                                                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `svelte`          | The components are compiled by the app's Svelte; two copies of the runtime break reactivity and context.                                                                                                                                                                                                             |
| `bits-ui`         | Its dismissable and escape layers are registered in globals and its parts share context; two copies would let a dialog in one copy and a menu in the other each think it is on top. A patch the app applies to `bits-ui` (through `patchedDependencies` in its own root) applies to the one copy the components use. |
| `tailwindcss`     | The app's Tailwind compiles the package's classes along with its own.                                                                                                                                                                                                                                                |
| `vite`            | The plugin builds the boot script with the app's Vite.                                                                                                                                                                                                                                                               |
| `gsap` (optional) | Only `@riksarkivet/ui/motion` imports it; an app that does not import that subpath need not install it. GSAP registers its plugins globally, so the app's one copy must be the one used.                                                                                                                             |

### Dependencies the package brings itself

`@lucide/svelte` (icons), `@tanstack/table-core` (the data table's engine), `clsx`, `tailwind-merge`,
`tailwind-variants` (class composition), `tw-animate-css` (the enter and exit utilities the overlays use) and
`@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono` (the fonts). They hold no global state, so an app that
also depends on one of them at another version only pays for the second copy in size.

## 2. The stylesheet

The app's main stylesheet:

```css
@import 'tailwindcss';
@import '@riksarkivet/ui/styles.css';
```

`styles.css` brings the fonts (IBM Plex Sans and Mono, weight 400, self-hosted), `tw-animate-css`, the themes and the
tokens, and an `@source` that points Tailwind at the package's own sources, its stories and tests left out (their
classes lay out a demo and would only add rules to the app's stylesheet). Tailwind 4 skips `node_modules` when it
looks for classes, and an `@source` path is read relative to the stylesheet that declares it, so this one works
wherever the package is installed: the app writes no `@source` for the package. Were an app to import only
`@riksarkivet/ui/styles/tokens.css`, it would need the line itself, relative to its stylesheet, for example
`@source '../node_modules/@riksarkivet/ui/src';`.

A strict CSP needs `font-src 'self'` (the fonts are emitted as the app's own assets) and `style-src 'unsafe-inline'`
(Svelte and Bits UI set inline positioning and transition styles).

## 3. The Vite plugin and the boot script

Name the appearance options once, in a module both the config and the app import:

```ts
// src/lib/appearance-options.ts
import type { AppearanceOptions } from '@riksarkivet/ui/appearance';

export const APPEARANCE: AppearanceOptions = {
	storageKey: '<the app>-appearance', // where the choice is kept in localStorage
	defaults: { theme: 'ink', mode: 'dark' }, // what a first visit gets (default: ink, following the system)
};
```

```ts
// vite.config.ts
import { riksarkivetUi } from '@riksarkivet/ui/vite';
import { APPEARANCE } from './src/lib/appearance-options.ts';

export default defineConfig({
	plugins: [riksarkivetUi(APPEARANCE), tailwindcss(), sveltekit({/* … */})],
});
```

`riksarkivetUi` does two things:

- it leaves the package out of Vite's dependency pre-bundling, so the dev server compiles its `.svelte`, `.ts` and
  `.svelte.ts` sources with the app's own transforms (pre-bundled, a `.svelte.ts` module fails to parse);
- it emits `/appearance-boot.js` into the browser build and serves it from the dev server: one classic script, built
  from the same record definition the store reads, with the app's options inlined.

Load the script in `<head>`, before anything paints (`src/app.html` in SvelteKit):

```html
<script src="%sveltekit.assets%/appearance-boot.js"></script>
```

It is same-origin, so a strict CSP with `script-src 'self'` admits it with no hash. It puts the kept theme and mode on
`<html>` (`data-theme`, the `dark` class, `color-scheme`) before the first paint.

Then start the store once, in the root layout, with the same options:

```svelte
<script lang="ts">
	import '../app.css';
	import { appearance } from '@riksarkivet/ui/appearance';
	import { APPEARANCE } from '#lib/appearance-options.ts';

	let { children } = $props();
	$effect(() => appearance.start(APPEARANCE));
</script>

{@render children()}
```

`appearance.start()` takes over from the boot script: it derives a custom accent against the page's measured surfaces,
follows the system's mode when the mode is `system`, and keeps every change under the same key. A canvas that draws
with the tokens reads `appearance.resolved` to know when to read them again.

## 4. Using components

Import from the per-component subpaths:

```svelte
<script lang="ts">
	import { Button } from '@riksarkivet/ui/button';
	import * as Tabs from '@riksarkivet/ui/tabs';
	import { AppearanceMenu, AccentDialog } from '@riksarkivet/ui/appearance';
</script>
```

The root `@riksarkivet/ui` re-exports a few common pieces (button, badge, dialog, card, select, chip, sort-header,
utils) for convenience; the subpaths are canonical. The full list of subpaths is the `exports` map in `package.json`.

### A dock on horizon-layout 2.x (optional)

The package does not depend on horizon-layout. An app that docks with it imports its structural sheet and then the
package's theme for it, both under `layer(base)`, from the app's main stylesheet (so a popout window, which copies the
page's stylesheets, finds them):

```css
@import 'horizon-layout/horizon-layout.css' layer(base);
@import '@riksarkivet/ui/styles/horizon-layout.css' layer(base);
```

## 5. Upgrading

Change the sha in `package.json` to the new commit and run `bun install`; `bun.lock` records it. Read the commits in
between for anything a consumer must change (a renamed prop, a removed subpath); a change that breaks consumers says
so in its commit message.

## 6. What was proven, and how

A scratch SvelteKit 3 app outside this repository installed the package from a local clone as
`git+file://<clone>#<sha>` with bun 1.4.2: `node_modules/@riksarkivet/ui` held `src/`, `vite/` and the rest of the
repository, and the tree held one copy of `svelte` and of `bits-ui`. It imported `styles.css`, used `riksarkivetUi`,
built with `vite build` (adapter-static, a hashed CSP with `script-src 'self'`), passed `svelte-check`, and rendered
buttons, badges, tabs, a dialog, the copy button, the block mark and the appearance menu in a browser with no console
error, in the production build and on the dev server. With the app's own JavaScript blocked, a stored choice
(`moss`, dark) was on `<html>` from the boot script alone; with it allowed, the choice was there by the time the
document was interactive, before any module ran.

Not yet proven, because nothing is pushed: the `github:` and `git+https:` forms resolving from GitHub (bun documents
both; the commit-pinned `git+file:` form above is the same resolver with a local URL). Not tested: a
server-rendered consumer (both apps are single-page apps).
