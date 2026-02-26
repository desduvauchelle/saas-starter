/**
 * Admin Users API — list and create users.
 *
 * GET  /api/admin/users — paginated user list with search, role, and active filters
 * POST /api/admin/users — create a new user (admin only)
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth/guards"
import {
	paginatedResponse,
	successResponse,
	errorResponse,
	parsePagination,
	buildPaginationMeta,
} from "@/lib/api/response"
import { ApiError, ConflictError, ValidationError } from "@/lib/api/errors"
import type { Prisma } from "@prisma/client"

/** Zod schema for user creation */
const createUserSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	role: z.enum(["USER", "ADMIN", "OWNER"]).optional().default("USER"),
	isActive: z.boolean().optional().default(true),
})

/** Select fields for the public user shape */
const userSelect = {
	id: true,
	name: true,
	email: true,
	image: true,
	avatarUrl: true,
	role: true,
	isActive: true,
	createdAt: true,
	updatedAt: true,
} as const

export async function GET(request: NextRequest) {
	try {
		await requireAdmin()

		const { searchParams } = request.nextUrl
		const { page, perPage, skip } = parsePagination(searchParams)

		// Filters
		const search = searchParams.get("search") ?? ""
		const role = searchParams.get("role") ?? ""
		const isActive = searchParams.get("isActive")
		const sortBy = searchParams.get("sortBy") ?? "createdAt"
		const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc"

		// Build where clause
		const where: Prisma.UserWhereInput = {}

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
			]
		}

		if (role && ["USER", "ADMIN", "OWNER"].includes(role)) {
			where.role = role as Prisma.EnumUserRoleFilter
		}

		if (isActive !== null && isActive !== "") {
			where.isActive = isActive === "true"
		}

		// Validate sortBy against allowed fields
		const allowedSortFields = ["name", "email", "role", "isActive", "createdAt"]
		const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
				select: userSelect,
				orderBy: { [safeSortBy]: sortOrder },
				skip,
				take: perPage,
			}),
			prisma.user.count({ where }),
		])

		return paginatedResponse(users, buildPaginationMeta(page, perPage, total))
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode)
		}
		console.error("Admin users GET error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}

export async function POST(request: NextRequest) {
	try {
		await requireAdmin()

		const body: unknown = await request.json()
		const result = createUserSchema.safeParse(body)

		if (!result.success) {
			const details: Record<string, string[]> = {}
			for (const issue of result.error.issues) {
				const key = issue.path.join(".")
				details[key] = details[key] ?? []
				details[key].push(issue.message)
			}
			throw new ValidationError(details)
		}

		const { name, email, password, role, isActive } = result.data

		// Check for duplicate email
		const existing = await prisma.user.findUnique({ where: { email } })
		if (existing) {
			throw new ConflictError("A user with this email already exists")
		}

		const hashedPassword = await bcrypt.hash(password, 12)

		const user = await prisma.user.create({
			data: {
				name,
				email,
				hashedPassword,
				role,
				isActive,
			},
			select: userSelect,
		})

		return successResponse(user, 201)
	} catch (error) {
		if (error instanceof ApiError) {
			return errorResponse(error.message, error.code, error.statusCode, error.details)
		}
		console.error("Admin users POST error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
