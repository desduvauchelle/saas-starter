/**
 * POST /api/auth/register
 *
 * Creates a new user with email + password credentials.
 * Hashes the password with bcrypt before storing.
 * Assigns role based on OWNER_EMAILS / ADMIN_EMAILS env vars.
 */

import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import prisma from "@/lib/prisma"
import {
	successResponse,
	errorResponse,
} from "@/lib/api/response"

const registerSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Valid email is required"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(128),
})

export async function POST(req: NextRequest) {
	try {
		const body: unknown = await req.json()
		const result = registerSchema.safeParse(body)

		if (!result.success) {
			const details: Record<string, string[]> = {}
			for (const issue of result.error.issues) {
				const key = issue.path.join(".")
				if (!details[key]) details[key] = []
				details[key].push(issue.message)
			}
			return errorResponse("Validation failed", "VALIDATION_ERROR", 422, details)
		}

		const { name, email, password } = result.data

		// Check for existing user
		const existing = await prisma.user.findUnique({
			where: { email },
		})

		if (existing) {
			return errorResponse(
				"An account with this email already exists",
				"CONFLICT",
				409
			)
		}

		// Determine role from env
		const ownerEmails = (process.env.OWNER_EMAILS ?? "")
			.split(",")
			.map((e) => e.trim().toLowerCase())
			.filter(Boolean)
		const adminEmails = (process.env.ADMIN_EMAILS ?? "")
			.split(",")
			.map((e) => e.trim().toLowerCase())
			.filter(Boolean)

		let role: "OWNER" | "ADMIN" | "USER" = "USER"
		if (ownerEmails.includes(email.toLowerCase())) role = "OWNER"
		else if (adminEmails.includes(email.toLowerCase())) role = "ADMIN"

		const hashedPassword = await bcrypt.hash(password, 12)

		const user = await prisma.user.create({
			data: {
				name,
				email,
				hashedPassword,
				role,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		})

		return successResponse(user, 201)
	} catch (error) {
		console.error("Registration error:", error)
		return errorResponse("Internal server error", "INTERNAL_ERROR", 500)
	}
}
