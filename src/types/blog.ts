/**
 * Blog-related types.
 */

import type { PostStatus } from "@prisma/client"

/** Frontmatter parsed from a markdown blog post */
export interface PostFrontmatter {
	title: string
	slug: string
	description: string
	keywords: string[]
	coverImage?: string
	status?: PostStatus
	publishedAt?: string
}

/** Result of parsing a raw markdown blog post */
export interface ParsedPost {
	meta: PostFrontmatter
	content: string
}

/** Public blog post (returned from API) */
export interface PostPublic {
	id: string
	slug: string
	title: string
	description: string | null
	keywords: string[]
	content: string
	coverImage: string | null
	status: PostStatus
	publishedAt: Date | null
	author: {
		id: string
		name: string | null
		avatarUrl: string | null
	}
	createdAt: Date
	updatedAt: Date
}

/** Data for creating/updating a blog post */
export interface PostInput {
	/** Raw markdown with frontmatter */
	rawContent: string
}

/** Blog list filters */
export interface PostFilters {
	status?: PostStatus
	search?: string
	authorId?: string
}

/** Error from frontmatter parsing */
export interface ParseError {
	field: string
	message: string
}
