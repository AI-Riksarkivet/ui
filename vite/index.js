// The package's Vite plugin. Plain JavaScript on purpose: a consumer's `vite.config.ts` loads it through Node, and Node
// strips no types from a file under `node_modules`. Its types are `index.d.ts` beside it.
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

/** The record definition the boot script runs, the same module the store reads the record with. */
const CORE = fileURLToPath(new URL('../src/lib/appearance/core.ts', import.meta.url));
const ENTRY = 'virtual:riksarkivet-ui/appearance-boot';
const RESOLVED = '\0' + ENTRY;
const FILE = 'appearance-boot.js';

/**
 * Everything a consuming app's Vite build needs from this package, as one plugin list:
 *
 * - the package is left out of dependency pre-bundling. It ships its sources (`.svelte`, `.ts`, `.svelte.ts`), which
 *   the app's own Svelte and TypeScript transforms compile like the app's code; the pre-bundler's Svelte step does not
 *   strip TypeScript from a `.svelte.ts` module, so the dev server would fail on the first page that imports one;
 * - the appearance boot script (below).
 *
 * @param {import('./index.js').UiOptions} [options]
 * @returns {import('vite').Plugin[]}
 */
export function riksarkivetUi(options = {}) {
	return [
		{
			name: 'riksarkivet-ui:sources',
			config: () => ({ optimizeDeps: { exclude: ['@riksarkivet/ui'] } }),
		},
		appearanceBoot(options),
	];
}

/**
 * The appearance boot script, `/appearance-boot.js`: the kept appearance's mode and theme on <html> before anything
 * paints. Built from `bootAppearance` in `core.ts` with the consumer's options inlined, into one classic script (a
 * module would run after the first paint). Same-origin, so a strict CSP admits it with no hash. Emitted into the client
 * build and served by the dev server; the page loads it with `<script src="/appearance-boot.js"></script>` in <head>,
 * before any stylesheet or module script.
 *
 * @param {import('./index.js').UiOptions} [options]
 * @returns {import('vite').Plugin}
 */
function appearanceBoot(options = {}) {
	const { fileName = FILE, ...appearance } = options;
	const call = `import { bootAppearance } from ${JSON.stringify(CORE)};\nbootAppearance(${JSON.stringify(appearance)});\n`;
	/** @returns {Promise<string>} */
	const bundle = async () => {
		const result = await build({
			configFile: false,
			logLevel: 'silent',
			plugins: [
				{
					name: 'riksarkivet-ui:appearance-boot-entry',
					resolveId: (id) => (id === ENTRY ? RESOLVED : null),
					load: (id) => (id === RESOLVED ? call : null),
				},
			],
			build: {
				write: false,
				minify: true,
				rollupOptions: {
					input: ENTRY,
					output: { format: 'iife', entryFileNames: FILE },
				},
			},
		});
		const outputs = Array.isArray(result) ? result : [result];
		for (const output of outputs) {
			if ('output' in output) {
				const chunk = output.output.find((item) => item.type === 'chunk');
				if (chunk && 'code' in chunk) return chunk.code;
			}
		}
		throw new Error('the appearance boot script built to nothing');
	};
	let ssr = false;
	return {
		name: 'riksarkivet-ui:appearance-boot',
		configResolved(config) {
			ssr = Boolean(config.build.ssr);
		},
		async generateBundle() {
			// Only the browser build carries it: a server build has no page to boot.
			if (ssr) return;
			this.emitFile({ type: 'asset', fileName, source: await bundle() });
		},
		configureServer: (server) =>
			void server.middlewares.use((req, res, next) => {
				if (req.url !== `/${fileName}`) return next();
				void bundle().then((code) => {
					res.setHeader('content-type', 'text/javascript');
					res.setHeader('cache-control', 'no-store');
					res.end(code);
				}, next);
			}),
	};
}
