# The repository's gates, all through bun. `make check` is what must pass before a change is pushed.
.PHONY: install check storybook build-storybook

export STORYBOOK_DISABLE_TELEMETRY := 1

install:
	bun install --frozen-lockfile

check:
	bun run fmt:check
	bun run lint
	bun run check
	bun run knip
	bun run test

storybook:
	bun run storybook

build-storybook:
	bun run build-storybook
