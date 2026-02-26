/**
 * Blog markdown renderer.
 *
 * Converts markdown content to sanitized HTML using a remark/rehype pipeline.
 * Supports GFM (tables, strikethrough, etc.) and code syntax highlighting.
 *
 * Usage:
 *   const html = await renderMarkdown("# Hello\n\nWorld");
 */

import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"

// Extend sanitize schema to allow class names on code blocks (for syntax highlighting)
const sanitizeSchema = {
	...defaultSchema,
	attributes: {
		...defaultSchema.attributes,
		code: [...(defaultSchema.attributes?.code ?? []), "className"],
		span: [...(defaultSchema.attributes?.span ?? []), "className"],
	},
}

/**
 * Render markdown string to sanitized HTML.
 *
 * @param content - Raw markdown string (without frontmatter)
 * @returns Sanitized HTML string
 */
export async function renderMarkdown(content: string): Promise<string> {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: false })
		.use(rehypeHighlight, { detect: true, ignoreMissing: true })
		.use(rehypeSanitize, sanitizeSchema)
		.use(rehypeStringify)
		.process(content)

	return String(result)
}
