/**
 * Type-safe API response helpers.
 *
 * Use these in every API route to ensure consistent, typed responses.
 *
 * Usage:
 *   return successResponse(data)
 *   return errorResponse("Not found", "NOT_FOUND", 404)
 *   return paginatedResponse(items, { page, perPage, total })
 */

import { NextResponse } from "next/server"
import type {
	ApiSuccessResponse,
	ApiErrorResponse,
	PaginatedResponse,
	PaginationMeta,
} from "@/types/api"

/** Return a success response with typed data */
export function successResponse<T>(
	data: T,
	status = 200
): NextResponse<ApiSuccessResponse<T>> {
	return NextResponse.json({ success: true as const, data }, { status })
}

/** Return an error response */
export function errorResponse(
	message: string,
	code: string,
	status = 400,
	details?: Record<string, string[]>
): NextResponse<ApiErrorResponse> {
	return NextResponse.json(
		{
			success: false as const,
			error: { message, code, ...(details ? { details } : {}) },
		},
		{ status }
	)
}

/** Return a paginated list response */
export function paginatedResponse<T>(
	data: T[],
	pagination: PaginationMeta,
	status = 200
): NextResponse<PaginatedResponse<T>> {
	return NextResponse.json(
		{ success: true as const, data, pagination },
		{ status }
	)
}

/** Parse pagination params from URL search params */
export function parsePagination(
	searchParams: URLSearchParams
): { page: number; perPage: number; skip: number } {
	const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
	const perPage = Math.min(
		100,
		Math.max(1, parseInt(searchParams.get("perPage") ?? "20", 10))
	)
	const skip = (page - 1) * perPage
	return { page, perPage, skip }
}

/** Build pagination metadata */
export function buildPaginationMeta(
	page: number,
	perPage: number,
	total: number
): PaginationMeta {
	const totalPages = Math.ceil(total / perPage)
	return {
		page,
		perPage,
		total,
		totalPages,
		hasNext: page < totalPages,
		hasPrev: page > 1,
	}
}
