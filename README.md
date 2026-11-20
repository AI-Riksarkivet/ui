# @riksarkivet/ui

A Svelte 5 design system on Bits UI and Tailwind 4: tokens and five themes, an appearance a person picks (theme, mode,
an accent of their own corrected for contrast), the components, and the Vite plugin and stylesheet an app needs to use
them. Apps install it from this repository pinned to a commit and compile it from source; there is no build step and
no registry release.

- [`DESIGN.md`](DESIGN.md): the look and its rules. Read it before changing a token or a component.
- [`docs/CONSUMING.md`](docs/CONSUMING.md): how an app depends on it, imports it and upgrades it.
- [`docs/ADOPTING-FROM-RASK-UI.md`](docs/ADOPTING-FROM-RASK-UI.md): switching an app that carries rask's older copy.
- [`THIRD_PARTY.md`](THIRD_PARTY.md): code from elsewhere and its licences.
- [`PROVENANCE.md`](PROVENANCE.md): where the first version came from.

## Develop

Bun only.

```bash
make install     # bun install
make check       # format, lint, svelte-check, knip, tests
make storybook   # http://localhost:6006, every story in every theme and mode from the toolbar
```

Licensed under the Apache License 2.0 ([`LICENSE`](LICENSE)). Third-party code keeps its own licence and notice, see THIRD_PARTY.md.
