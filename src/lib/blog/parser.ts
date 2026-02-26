/**
 * Blog frontmatter parser.
 *
 * Parses raw markdown with frontmatter (YAML) into typed metadata
 * and content body. Uses gray-matter for parsing and Zod for validation.
 *
 * Expected frontmatter format:
 * ---
 * title: "My Post Title"
 * slug: "my-post-title"
 * description: "A brief description"
 * keywords: ["saas", "startup"]
 * coverImage: "https://example.com/image.jpg"
 * status: "DRAFT"
 * publishedAt: "2025-01-01"
 * ---
 */

import matter from "gray-matter"
import { z } from "zod"
import type { ParsedPost, PostFrontmatter } from "@/types/blog"

const frontmatterSchema = z.object({
	title: z.string().min(1, "Title is required"),
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must be lowercase with hyphens (e.g. my-post-title)"
		),
	description: z.string().default(""),
	keywords: z
		.union([
			z.array(z.string()),
			z.string().transform((s) =>
				s
					.split(",")
					.map((k) => k.trim())
					.filter(Boolean)
			),
		])
		.default([]),
	coverImage: z.string().optional(),
	status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
	publishedAt: z.string().optional(),
})

export class FrontmatterParseError extends Error {
	constructor(
		message: string,
		public fields: Array<{ field: string; message: string }>
	) {
		super(message)
		this.name = "FrontmatterParseError"
	}
}

/**
 * Serialize post metadata and markdown body into a raw frontmatter string.
 *
 * @param meta - Post metadata fields
 * @param content - Markdown body (without frontmatter)
 * @returns Full raw markdown string with YAML frontmatter block
 */
export function serializeFrontmatter(
	meta: {
		title: string
		slug: string
		description?: string
		keywords?: string[]
		coverImage?: string
	},
	content: string
): string {
	const kw = (meta.keywords ?? []).map((k) => JSON.stringify(k)).join(", ")
	const lines = [
		"---",
		`title: ${JSON.stringify(meta.title)}`,
		`slug: ${JSON.stringify(meta.slug)}`,
		`description: ${JSON.stringify(meta.description ?? "")}`,
		`keywords: [${kw}]`,
	]
	if (meta.coverImage) {
		lines.push(`coverImage: ${JSON.stringify(meta.coverImage)}`)
	}
	lines.push("---", "", content)
	return lines.join("\n")
}

/**
 * Parse a raw markdown string with frontmatter into typed metadata + content.
 *
 * @param raw - Full markdown string including frontmatter block
 * @returns Parsed post with typed metadata and body content
 * @throws FrontmatterParseError if frontmatter validation fails
 */
export function parseFrontmatter(raw: string): ParsedPost {
	const { data, content } = matter(raw)

	const result = frontmatterSchema.safeParse(data)

	if (!result.success) {
		const fields = result.error.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}))

		throw new FrontmatterParseError(
			`Invalid frontmatter: ${fields.map((f) => `${f.field}: ${f.message}`).join(", ")}`,
			fields
		)
	}

	const meta: PostFrontmatter = {
		title: result.data.title,
		slug: result.data.slug,
		description: result.data.description,
		keywords: result.data.keywords,
		coverImage: result.data.coverImage,
		status: result.data.status,
		publishedAt: result.data.publishedAt,
	}

	return { meta, content: content.trim() }
}
