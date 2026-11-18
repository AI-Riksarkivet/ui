# CLAUDE.md

Guidance for agents working in this repository.

## What this is

`@riksarkivet/ui`, a Svelte 5 + Bits UI + Tailwind 4 design system, consumed by apps from source (exports name `src/`),
pinned to a commit of this repository. One package at the root. `DESIGN.md` is the specification; `docs/CONSUMING.md`
is the contract with the apps.

## Rules that are easy to break

- **No consumer's name**, anywhere in the package: identifiers, classes, storage keys, copy, comments, stories, tests.
  A value only an app knows is an option or a prop. (`PROVENANCE.md` and `docs/CONSUMING.md` may name the apps as
  examples.)
- **No app code**: no routes, no fetching, no API client, no domain view of one app's records.
- **Tokens only** for colour; the radius scale for corners; the type scale and ONE weight (400) for text; the motion
  tokens for transitions, and reduced motion respected.
- **Never copy Svelte Bits** (its licence forbids redistribution in a bundle). Baby UI (Apache-2.0) may be adapted, with
  a row in `THIRD_PARTY.md` saying what changed.
- **No runtime code evaluation** (`eval`, `new Function`) and no WebGL/WebGPU: consumers run a strict CSP.
- **Every component** has its subpath export in `package.json`, a story covering its variants and states, and a test
  for any logic that is not markup.
- **Svelte autofixer on every component** you write or change (`bunx @sveltejs/mcp svelte-autofixer <file>`, or the
  Svelte MCP), and load the Svelte skills before editing `.svelte` or `.svelte.ts`.
- **The appearance record** (`src/lib/appearance/core.ts`) is read by both the store and the boot script the Vite
  plugin (`vite/index.js`) builds; change it in one place and both follow. `vite/index.js` stays plain JavaScript
  (Node loads it from `node_modules`, where it strips no types).
- A change to tokens or themes re-checks the contrast floors in `DESIGN.md` in the browser, every theme, both modes.

## Commands

Bun only (`bun`, `bunx`); never npm, npx or pnpm.

| Goal      | Command                                                    |
| --------- | ---------------------------------------------------------- |
| Install   | `make install`                                             |
| All gates | `make check` (fmt:check, lint, svelte-check, knip, vitest) |
| Format    | `bun run fmt`                                              |
| Tests     | `bun run test`                                             |
| Storybook | `make storybook` (port 6006); `bun run build-storybook`    |

Storybook telemetry is off in `.storybook/main.ts` and through `STORYBOOK_DISABLE_TELEMETRY=1` in the scripts.
