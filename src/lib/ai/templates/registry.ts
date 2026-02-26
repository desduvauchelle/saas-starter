/**
 * AI Template Registry — auto-discovers templates from this directory.
 *
 * Any `.ts` file in `src/lib/ai/templates/` that default-exports an
 * `AITemplate` is automatically registered on first access.
 *
 * Excluded files: types.ts, registry.ts, index.ts (infrastructure).
 */

import type { AITemplate } from "./types"

/* -------------------------------------------------------------------------- */
/*  Internal files that should NOT be treated as templates                      */
/* -------------------------------------------------------------------------- */

const EXCLUDED_FILES = new Set(["types", "registry", "index"])

/* -------------------------------------------------------------------------- */
/*  Registry singleton                                                         */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const templates = new Map<string, AITemplate<any, any>>()
let discovered = false

/**
 * Dynamically discover template files in this directory.
 *
 * Uses `require.context` at build-time (webpack / Turbopack) to enumerate
 * every `.ts` file in `./` that isn't infrastructure. This works in both
 * dev (Turbopack) and production (webpack) because Next.js processes
 * server-side modules with a bundler.
 */
function discover(): void {
	if (discovered) return
	discovered = true

	try {
		// Webpack / Turbopack `require.context` — works at build-time
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const ctx = (require as any).context("./", false, /\.ts$/)

		for (const key of ctx.keys() as string[]) {
			// key looks like "./summarize.ts"
			const baseName = key.replace(/^\.\//, "").replace(/\.ts$/, "")
			if (EXCLUDED_FILES.has(baseName)) continue

			const mod = ctx(key)
			const template = mod?.default ?? mod

			if (template?.name && template?.inputSchema && template?.buildMessages && template?.parseOutput) {
				templates.set(template.name, template)
			}
		}
	} catch {
		// Fallback: if require.context is unavailable (e.g. in tests),
		// templates can be registered manually via `registerTemplate`.
		console.warn(
			"[ai/registry] require.context unavailable — " +
			"templates must be registered manually via registerTemplate()"
		)
	}
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Manually register a template. Useful in tests or when auto-discovery
 * isn't available.
 */

export function registerTemplate<TInput, TOutput>(template: AITemplate<TInput, TOutput>): void {
	templates.set(template.name, template as AITemplate<any, any>)
}

/**
 * Retrieve a template by name. Triggers auto-discovery on first call.
 * Returns `undefined` if the template is not found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTemplate(name: string): AITemplate<any, any> | undefined {
	discover()
	return templates.get(name)
}

/**
 * List all registered template names. Triggers auto-discovery on first call.
 */
export function listTemplates(): string[] {
	discover()
	return Array.from(templates.keys())
}
