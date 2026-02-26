/**
 * AI Templates — public barrel.
 *
 * Re-exports the registry helpers and the template types so consumers
 * only need a single import path:
 *
 * ```ts
 * import { getTemplate, listTemplates, defineTemplate } from "@/lib/ai/templates"
 * ```
 */

export { getTemplate, listTemplates, registerTemplate } from "./registry"
export { defineTemplate } from "./types"
export type { AITemplate } from "./types"
