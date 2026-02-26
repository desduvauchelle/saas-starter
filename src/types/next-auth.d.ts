/**
 * NextAuth.js type augmentation.
 *
 * Extends the default session/user types so `auth()` returns
 * `session.user.id` and `session.user.role` with full type safety.
 */

import type { UserRole } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
	interface Session {
		user: {
			id: string
			role: UserRole
		} & DefaultSession["user"]
	}

	interface User {
		role: UserRole
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string
		role: UserRole
	}
}
