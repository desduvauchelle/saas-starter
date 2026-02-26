/**
 * Auth-related types.
 *
 * Extends the default NextAuth session/user types with our custom fields
 * (role, id) so that `auth()` returns a fully typed session.
 */

import type { UserRole } from "@prisma/client"

/** Provider identifiers that can be enabled via env vars */
export type OAuthProviderId = "google" | "github" | "apple"

/** Auth provider info passed to login/register UI */
export interface AuthProviderInfo {
	id: OAuthProviderId
	name: string
	enabled: boolean
}

/** Configuration for which auth methods are available */
export interface AuthConfig {
	credentialsEnabled: boolean
	magicLinkEnabled: boolean
	providers: AuthProviderInfo[]
}

/**
 * Extends the default NextAuth types so `session.user` includes
 * `id` and `role`. Declared in `src/types/next-auth.d.ts` as well
 * for module augmentation.
 */
export interface SessionUser {
	id: string
	name: string | null
	email: string | null
	image: string | null
	role: UserRole
}
