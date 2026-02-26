/**
 * Type-safe API response parsing helpers for client-side use.
 *
 * These helpers provide proper runtime type narrowing so TypeScript
 * can infer the correct types without unsafe `as` casts.
 */

import type { PaginationMeta } from "@/types/api"

/** Shape of a successful API response (subset of ApiSuccessResponse) */
interface SuccessBody<T> {
	success: true
	data: T
}

/** Shape of a paginated API response */
interface PaginatedBody<T> {
	success: true
	data: T[]
	pagination: PaginationMeta
}

/** Shape of an error API response */
interface ErrorBody {
	success: false
	error: {
		message: string
		code: string
		details?: Record<string, string[]>
	}
}

/**
 * Parse a fetch Response as a typed success or error result.
 * Uses discriminated-union narrowing — no `as` casts needed.
 */
export async function parseApiResponse<T>(
	res: Response
): Promise<
	| { ok: true; data: T }
	| { ok: false; message: string; details?: Record<string, string[]> }
> {
	const json: unknown = await res.json()

	if (
		typeof json === "object" &&
		json !== null &&
		"success" in json
	) {
		const body = json as SuccessBody<T> | ErrorBody

		if (body.success === true) {
			return { ok: true, data: body.data }
		}

		return {
			ok: false,
			message: body.error?.message ?? "Unknown error",
			details: body.error?.details,
		}
	}

	return { ok: false, message: "Unexpected response format" }
}

/**
 * Parse a fetch Response as a paginated result.
 */
export async function parsePaginatedResponse<T>(
	res: Response
): Promise<
	| { ok: true; data: T[]; pagination: PaginationMeta }
	| { ok: false; message: string }
> {
	const json: unknown = await res.json()

	if (
		typeof json === "object" &&
		json !== null &&
		"success" in json
	) {
		const body = json as PaginatedBody<T> | ErrorBody

		if (body.success === true) {
			return {
				ok: true,
				data: body.data,
				pagination: (body as PaginatedBody<T>).pagination,
			}
		}

		return {
			ok: false,
			message: body.error?.message ?? "Unknown error",
		}
	}

	return { ok: false, message: "Unexpected response format" }
}
