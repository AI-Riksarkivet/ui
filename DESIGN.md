# Design

This is the design system in words: what it looks like, what each token is for, and the rules a change to it must keep.
It is written from `src/lib/styles/tokens.css`, `src/lib/styles/themes.css` and the components as they are. Where this
document and the CSS disagree, the CSS is what ships and this document is wrong: fix one of them in the same change.

## Principles

- **Quiet surfaces, one loud colour.** Pages are near-neutral; the accent marks what can be acted on and what is
  selected. Status colours appear only where there is a status.
- **Hierarchy from size and colour, never from weight.** One weight of one family is loaded.
- **Sharp geometry.** Corners are square or nearly so. Round is kept for what is round by nature (an avatar, a dot).
- **Flat until it floats.** Containers are told apart by their background step, not by borders or shadows. Only what
  floats over the page (a dialog, a popover, a menu, a floating panel) casts a shadow, and there is one shadow.
- **Colour is the person's.** Five themes ship, and a person may pick an accent of their own. Every colour on the page
  derives from a few seeds, so a choice restyles everything, the shadow and the mark included.
- **Readable first.** Every text and control pair meets WCAG 2.2 AA in every theme and mode, and a chosen accent is
  corrected until it does.
- **Motion is short and optional.** It explains a change; it never decorates. Reduced motion turns it off.

## Geometry

`--radius` is `0px`. Tailwind's radius steps are remapped so a screen that writes `rounded-lg` still gets the
geometry:

| Utility                                     | Radius                                    |
| ------------------------------------------- | ----------------------------------------- |
| `rounded-xs`, `rounded-sm`                  | 0px                                       |
| `rounded-md`                                | 1px                                       |
| `rounded-lg`, `rounded-xl`                  | 2px                                       |
| `rounded-2xl`, `rounded-3xl`, `rounded-4xl` | 3px                                       |
| `rounded-full`                              | round (avatars, dots, the switch's thumb) |

Components write `rounded-none` where a corner must be square whatever the scale says.

## Type

- **Families.** IBM Plex Sans for text (`font-sans`), IBM Plex Mono for code, ids and figures that must align
  (`font-mono`), both self-hosted from `@fontsource` and imported by `@riksarkivet/ui/styles.css`. Fallbacks are the
  system's sans and monospace.
- **One weight, 400.** `font-medium`, `font-semibold`, `font-bold`, `font-extrabold` and `font-black` all resolve to
  400, so nothing synthesises a bold from the one face. `<strong>` and `<b>` carry emphasis by colour (the foreground),
  not weight.
- **The scale.** Data sizes stay dense; headings take a few large steps with tight leading and negative tracking.

| Token       | Size      | Line height | Tracking |
| ----------- | --------- | ----------- | -------- |
| `text-xs`   | 0.75rem   | 1rem        |          |
| `text-sm`   | 0.875rem  | 1.25rem     |          |
| `text-base` | 1rem      | 1.5rem      |          |
| `text-lg`   | 1.1875rem | 1.3         | -0.01em  |
| `text-xl`   | 1.5rem    | 1.15        | -0.018em |
| `text-2xl`  | 2rem      | 1.05        | -0.028em |
| `text-3xl`  | 2.75rem   | 1           | -0.034em |
| `text-4xl`  | 3.5rem    | 0.98        | -0.04em  |

- **Uppercase is a label.** Anything set `uppercase` tracks at 0.07em unless a utility says otherwise. Buttons, tab
  labels, table heads, group labels and badges are small uppercase labels (0.6875rem to 0.75rem). Uppercase is CSS
  only (`text-transform`): the text in the markup, and so the accessible name, is written in sentence case.
- Headings (`h1` to `h4`) balance their lines.

## Colour

### Seeds

A theme sets only seeds, on `[data-theme]` on `<html>`:

| Seed                                    | What it sets                                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `--tone-h`, `--tone-c`                  | The hue and chroma the neutrals are tinted with                                                 |
| `--accent-h`                            | The accent's hue                                                                                |
| `--accent-c-light`, `--accent-c-dark`   | The accent's chroma in each mode                                                                |
| `--accent-l-light`, `--accent-l-dark`   | The accent's lightness in each mode                                                             |
| `--on-accent-light`, `--on-accent-dark` | The text drawn on the accent (optional; near-white or near-black in the accent's hue otherwise) |

The mode (`.dark` on `<html>`, light otherwise) picks one of each pair (`--accent-l`, `--accent-c`, `--on-accent`) and
sets `--ramp-dir` (1 in light, -1 in dark), the direction "one step away from the page" moves.

### What is derived

Every other colour token is computed from the seeds in OKLCH:

- **Surfaces**: `--background` (the page), `--card` (a raised surface), `--popover` (what floats), `--muted` (a quiet
  band), `--sidebar`, `--input` (a field's fill), each a fixed lightness tinted by `--tone-c`.
- **Text**: `--foreground`, `--muted-foreground` (secondary text; in dark at L 0.74 so it clears 4.5:1 on every dark
  surface, a hovered row included).
- **The accent family**: `--primary` (the accent itself), `--primary-foreground` (`--on-accent`), `--primary-hover`
  (one step away from the page), `--secondary` and `--secondary-foreground` (a soft tint of the accent and the text on
  it), `--secondary-hover`, `--accent` (the hover and selected surface of a row or item, a faint tint), `--ring` (the
  focus ring, the accent), `--sidebar-accent`.
- **Lines**: `--border` (a hairline between things, 10% of the foreground), `--border-strong`, and `--field-line`, the
  3:1 edge a control needs to be found (WCAG 2.2 § 1.4.11).
- **Status**, fixed hues, not derived from the accent: `--destructive` (and `--destructive-ink`, the destructive colour
  as text on the page and on its own tint), `--success`, `--warning`, each with its foreground. Each pair is 4.5:1 or
  better, and each colour is 3:1 or better as a mark on the page.
- **The block ramp**: `--block-1` to `--block-5`, five steps of the accent walking from the page toward it (lighter
  steps in light mode, darker in dark), each with a small hue shift; `--block-4` is `--primary`.
- **The shadow tint**: `--shadow-tint`, a dark colour in the accent's hue, which the elevated shadow and the scrim are
  made from.

Every token is exposed to Tailwind as a colour (`bg-card`, `text-muted-foreground`, `border-field-line`,
`bg-block-3`, `bg-scrim`, …).

### The shipped themes

| Theme           | Surfaces             | Accent                                                                                         |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| `ink` (default) | Neutral greys        | Blue-violet                                                                                    |
| `fjord`         | Cool blue-grey       | Sea-glass teal                                                                                 |
| `paper`         | Warm paper           | Sealing-wax red                                                                                |
| `moss`          | Green-grey           | Forest green                                                                                   |
| `contrast`      | Pure black and white | Saturated blue; also sets the surfaces, secondary text and lines a hue cannot reach (7:1 text) |

Every shipped accent is in the sRGB gamut at both lightnesses. Measured in the browser, every pair below passes in
every theme and mode (the least value across the five themes is given):

| Pair                        | Light | Dark  | Floor |
| --------------------------- | ----- | ----- | ----- |
| Text on the page            | 16.64 | 16.90 | 4.5   |
| Muted text on the page      | 6.48  | 8.35  | 4.5   |
| Muted text on a hovered row | 5.73  | 6.07  | 4.5   |
| Text on the primary button  | 6.21  | 8.94  | 4.5   |
| Accent as text              | 5.90  | 8.87  | 4.5   |
| Destructive text            | 5.61  | 7.18  | 4.5   |
| A field's edge              | 4.73  | 4.32  | 3     |
| The focus ring              | 5.90  | 8.87  | 3     |

### A custom accent

A person may pick any colour as the accent (`AccentDialog`). It is kept as one strict `#rrggbb` and never as CSS; the
seeds it amounts to are derived on the page (`appearance.ts`) and set inline on `<html>`:

1. The hue is the chosen hue. A grey keeps a trace of chroma (0.02) so its tints still read as tints.
2. The surfaces it must read on are **measured** from the tokens of the active theme, in light and in dark, by a hidden
   probe: `--background`, `--card`, `--popover`, `--muted`, `--accent`, `--secondary`, `--sidebar`, `--sidebar-accent`,
   `--input`, plus the accent's own 10% tint over each (a selected chip is the accent at a tenth over its surface).
3. In each mode the chosen lightness is kept when every pair reads. Otherwise it is clamped, darker in light mode and
   lighter in dark, in steps of 0.0025, until the accent reads at 4.58:1 (AA's 4.5 plus room for the browser rounding a
   channel the other way) as text on the worst surface and tint, and the text on it (near-white or near-black,
   whichever reads better at rest and hovered) reads at 4.58:1 too. Chroma follows the sRGB gamut at each lightness.
4. The surfaces are measured again with the derived chroma until nothing moves.

Measured across the five themes with deliberately hard picks (`#ff00ff`, `#ffe94d`, `#888888`, `#0000ff`, `#000000`,
`#ffffff`), the corrected accent's least contrast as text was 4.59 in light (on `--sidebar-accent`, or `--secondary` in
`contrast`, under a 10% tint) and 4.58 in dark (on `--secondary` under a 10% tint); the text on the accent was at least 6.77 in light and 7.58 in dark.
Black as the accent, in dark mode, is lifted until it reads (4.60); white in light mode is darkened (4.63).

## Surfaces and borders

Containers are told apart by their background step: page (`bg-background`), raised (`bg-card`), quiet band
(`bg-muted`), field (`bg-input` with a bottom `border-field-line`). `* { border-color: var(--border) }` is the default,
so a bare `border` is the hairline. A control that must be found by its edge (an outline button, a checkbox, a field)
uses `--field-line` or `--border-strong`, never the hairline.

## Elevation

One shadow, `--shadow-elevated`: a 1px edge and three layers cast to the lower left, tinted with the theme's accent hue
rather than grey, stronger in dark. `shadow-sm` and below are `none`; `shadow`, `shadow-md` to `shadow-2xl` and
`shadow-float` are all the one shadow. A modal dims the page with `--scrim`, the shadow's tint at 42% (light) or 62%
(dark). A card is a surface, not a raised box.

## Motion

| Token              | Value                                |
| ------------------ | ------------------------------------ |
| `--duration-fast`  | 120ms (hover, press, colour changes) |
| `--duration-base`  | 180ms                                |
| `--duration-slow`  | 260ms (sheets, the odometer)         |
| `--ease-ui-out`    | `cubic-bezier(0.16, 1, 0.3, 1)`      |
| `--ease-ui-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)`    |
| `--ease-drawer`    | `cubic-bezier(0.32, 0.72, 0, 1)`     |

Under `prefers-reduced-motion: reduce` the three durations are 0ms, so anything that reads the tokens stops moving;
components also write `motion-reduce:` utilities where a transition is not token-driven. A theme or mode switch
repaints at once: `.appearance-switching` suppresses every transition for two frames. The GSAP attachments in
`@riksarkivet/ui/motion` check reduced motion themselves.

## The block mark and the block meter

The block motif is a row of small squares stepping through the accent's ramp (`--block-1` … `--block-5`), so it takes
whatever colour the person chose.

- **`BlockMark`** is a product's mark: up to five blocks, `sm`/`md`/`lg`. It is decoration (`aria-hidden`) unless it is
  given a `label`, which makes it an image. A product's name beside it is the consumer's text, set small and uppercase.
- **`Progress`** is the block meter: a row of `segments` squares (16 by default), filled from the start along the
  ramp so a full meter shows the whole ramp; unfilled blocks are `--field-line` at 22%. Bits UI keeps the
  `progressbar` role and its values; the blocks are decoration on it.

## Component conventions

- **One directory per component** under `src/lib/components/<name>/`, its parts in their own `.svelte` files, an
  `index.ts` that exports them (both as `Root`/`Trigger`/… and as prefixed names), and a subpath export
  `@riksarkivet/ui/<name>` in `package.json`. Subpaths are the canonical import; the root barrel is a short
  convenience list.
- **`data-slot`.** Every rendered part carries `data-slot="<component>-<part>"`, so a consumer can target a part
  without a class of its own and tests can find it.
- **`tv()` and `cn()`.** Variants are declared with `tailwind-variants` (`tv({ base, variants, defaultVariants })`)
  and exported (`buttonVariants`), so a link or a Bits UI trigger can take a button's look. A caller's `class` is
  merged last with `cn()` (`clsx` + `tailwind-merge`), so it wins over the component's own utilities.
- **Variants and sizes.** Buttons: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`; sizes `xs`,
  `sm`, `default`, `lg` and the square `icon`, `icon-xs`, `icon-sm`, `icon-lg`. Badges: `default`, `secondary`,
  `outline`, `destructive`, `success`, `warning`, each with a small square in its tone. New components reuse these
  names before inventing others.
- **Bits UI for behaviour.** Anything with focus management, a portal, a roving tabindex or a dismissable layer is
  built on a Bits UI primitive, which owns its keyboard and ARIA behaviour.
- **Props, not mirrors.** A control whose truth may live in the caller's prop offers a change callback
  (`onValueChange`, `onCheckedChange`) beside its bindable value, so the caller never mirrors a prop into state.
- **No app state.** A component never fetches, never imports an API client, and never reads a route. What it needs
  comes in as props, snippets and callbacks.

## Accessibility

- **Contrast floors**: 4.5:1 for text and for text on a filled control; 3:1 for a control's edge, the focus ring and a
  status mark. Every shipped theme meets them in both modes, `contrast` meets 7:1 for text, and a custom accent is
  corrected to meet them (see Colour).
- **Focus** is always visible: a 2px ring in `--ring` (the accent) with a 1px offset in the page colour
  (`focus-visible:ring-2 ring-offset-1`), or the destructive colour on a destructive control. Never remove an outline
  without putting the ring in its place.
- **Keyboard**: everything a pointer can do, a keyboard can. Menus, selects, tabs, dialogs, sheets and tooltips get
  their keys from Bits UI. A clickable table row is focusable and opens on Enter.
- **Hold to confirm** (`HoldToConfirm`) fires a destructive action only after a press held for its duration (pointer,
  Space or Enter) **or two presses**, the first of which arms it for a few seconds: the second path is what a screen
  reader in browse mode, voice control or a switch can send. Its accessible name says both ("Clear — hold, or press
  twice"), and arming and the outcome are announced.
- **Gated actions** (`GatedAction`) are shown disabled with their reason, never hidden: the control stays
  focusable with `aria-disabled` and its click and Enter or Space blocked, and the reason is its tooltip on hover and
  focus and its accessible description.
- **Decoration is hidden**: the block mark without a label, the meter's blocks, a theme swatch are `aria-hidden`.
- **Uppercase is CSS**, so screen readers read the words as written.

## Minimum browsers

The theme CSS has no fallback: it uses relative colour syntax (`oklch(from …)`) and `clamp()` inside `oklch()`. That
sets the floor at **Chromium 119, Firefox 128 and Safari 16.4** (Safari 18 recommended), as the browsers' release notes
give them. Only Chromium is exercised in this repository.

## What does not belong here

- **App code**: routes, navigation, an app's frame or shell, data fetching, API clients, anything that knows a URL.
- **A consumer's name** anywhere in the package: identifiers, class names, storage keys, copy, comments, stories. A
  value only a consumer knows (a storage key, a product name) is a prop or an option.
- **Domain views**: a component that renders one app's records (an access list, a catalog hierarchy, a search over
  one kind of item) lives in that app.
- **Decoration on working surfaces**: gradients, glows, textures and ornamental animation. `RainbowButton` is the one
  deliberate exception, for an entry point that summons a model; its hues are fixed, and it
  respects reduced motion.
- **WebGL or WebGPU**, and any runtime dependency that evaluates code (`eval`, `new Function`): consumers run a
  strict CSP without `unsafe-eval`.
- **Colours outside the tokens**: a component never writes a hex, `rgb()` or a Tailwind palette colour
  (`bg-blue-500`); it uses a token.

## Adding a component

1. Create `src/lib/components/<name>/` with the component, its parts and an `index.ts`.
2. Add the subpath `./<name>` to `exports` in `package.json` (`types` and `svelte` both naming the `index.ts`).
3. Write `<name>.stories.svelte` covering every variant, size and state; check it in every theme, light and dark, from
   the Storybook toolbar.
4. Add a test under `tests/` for any logic that is not markup (a state machine, a formatter, a reducer).
5. Run the Svelte autofixer on every `.svelte` and `.svelte.ts` file you wrote or changed, and fix what it reports.
6. Use tokens only for colour, the radius scale for corners, the type scale and one weight for text, and the motion
   tokens for any transition.
7. Run `make check`.

## Third-party code

- **Baby UI** (Apache-2.0) may be copied in, adapted to the tokens. Each adapted component is listed in
  `THIRD_PARTY.md` with what was taken and what was changed, and the licence text stays there in full.
- **shadcn-svelte** (MIT) is where the Bits UI wrappers started; its notice stays in `THIRD_PARTY.md`.
- **Svelte Bits may never be copied into this repository**, not one component and not a port of one. Its licence (MIT
  with the Commons Clause) forbids redistributing its components alone or in a bundle, and a shared library is a
  bundle.
- Anything else is copied in only under a licence that permits redistribution, with its notice added to
  `THIRD_PARTY.md` in the same change.
