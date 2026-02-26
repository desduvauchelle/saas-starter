/**
 * Auth guard utilities.
 *
 * Server-side helpers to protect API routes and pages.
 * Use these instead of manually calling `auth()` and checking roles.
 */

import { auth } from "@/lib/auth/config"
import type { Session } from "next-auth"
import type { UserRole } from "@prisma/client"

/** Error thrown when authentication/authorization fails */
export class AuthError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public code: string
	) {
		super(message)
		this.name = "AuthError"
	}
}

/**
 * Requires an authenticated session. Throws AuthError if not authenticated.
 * Returns the validated session.
 */
export async function requireAuth(): Promise<Session> {
	const session = await auth()

	if (!session?.user) {
		throw new AuthError("Authentication required", 401, "UNAUTHORIZED")
	}

	return session
}

/**
 * Requires authentication AND one of the specified roles.
 * Throws AuthError if not authenticated or insufficient role.
 */
export async function requireRole(
	...roles: UserRole[]
): Promise<Session> {
	const session = await requireAuth()

	if (!roles.includes(session.user.role)) {
		throw new AuthError(
			"Insufficient permissions",
			403,
			"FORBIDDEN"
		)
	}

	return session
}

/**
 * Requires ADMIN or OWNER role.
 */
export async function requireAdmin(): Promise<Session> {
	return requireRole("ADMIN", "OWNER")
}

/**
 * Requires OWNER role only.
 */
export async function requireOwner(): Promise<Session> {
	return requireRole("OWNER")
}
