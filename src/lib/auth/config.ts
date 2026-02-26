/**
 * Auth.js (NextAuth v5) configuration.
 *
 * Dynamically builds the providers array based on environment variables:
 *  - Always: Credentials (email + password)
 *  - If MAGIC_LINK_ENABLED=true + RESEND_API_KEY: Email provider
 *  - If GOOGLE_CLIENT_ID set: Google OAuth
 *  - If GITHUB_CLIENT_ID set: GitHub OAuth
 *  - If APPLE_CLIENT_ID set: Apple OAuth
 *
 * Callbacks extend session with user.id and user.role.
 */

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import AppleProvider from "next-auth/providers/apple"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import type { UserRole } from "@prisma/client"
import type { AuthConfig, AuthProviderInfo, OAuthProviderId } from "@/types/auth"

/* -------------------------------------------------------------------------- */
/*  Helper: determine role for new users based on env                         */
/* -------------------------------------------------------------------------- */

function getRoleForEmail(email: string): UserRole {
	const ownerEmails = (process.env.OWNER_EMAILS ?? "")
		.split(",")
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean)
	const adminEmails = (process.env.ADMIN_EMAILS ?? "")
		.split(",")
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean)

	const lower = email.toLowerCase()
	if (ownerEmails.includes(lower)) return "OWNER"
	if (adminEmails.includes(lower)) return "ADMIN"
	return "USER"
}

/* -------------------------------------------------------------------------- */
/*  Build providers dynamically                                               */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildProviders(): any[] {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const providers: any[] = []

	// Always: email + password credentials
	providers.push(
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (
					!credentials?.email ||
					!credentials?.password ||
					typeof credentials.email !== "string" ||
					typeof credentials.password !== "string"
				) {
					return null
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				})

				if (!user || !user.hashedPassword || !user.isActive) {
					return null
				}

				const isValid = await bcrypt.compare(
					credentials.password,
					user.hashedPassword
				)

				if (!isValid) return null

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					image: user.image,
					role: user.role,
				}
			},
		})
	)

	// OAuth providers — only added when env vars are present
	if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
		providers.push(
			GoogleProvider({
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			})
		)
	}

	if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
		providers.push(
			GitHubProvider({
				clientId: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
			})
		)
	}

	if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
		providers.push(
			AppleProvider({
				clientId: process.env.APPLE_CLIENT_ID,
				clientSecret: process.env.APPLE_CLIENT_SECRET,
			})
		)
	}

	return providers
}

/* -------------------------------------------------------------------------- */
/*  NextAuth instance                                                          */
/* -------------------------------------------------------------------------- */

export const { handlers, auth, signIn, signOut } = NextAuth({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adapter: PrismaAdapter(prisma) as any,
	session: { strategy: "jwt" },
	pages: {
		signIn: "/login",
		error: "/login",
	},
	providers: buildProviders(),
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id ?? ""
				const dbRole = (user as { role?: UserRole }).role ?? "USER"
				const envRole = user.email ? getRoleForEmail(user.email) : "USER"

				// Env vars take priority — elevate role if email is listed
				const rolePriority: UserRole[] = ["USER", "ADMIN", "OWNER"]
				const effectiveRole =
					rolePriority.indexOf(envRole) > rolePriority.indexOf(dbRole)
						? envRole
						: dbRole

				token.role = effectiveRole

				// Keep DB in sync so guards and queries stay consistent
				if (effectiveRole !== dbRole && user.id) {
					await prisma.user.update({
						where: { id: user.id as string },
						data: { role: effectiveRole },
					})
				}
			}
			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string
				session.user.role = token.role as UserRole
			}
			return session
		},
		async signIn({ user, account }) {
			// For OAuth sign-ins, check if user exists and assign role
			if (account?.provider !== "credentials" && user.email) {
				const existingUser = await prisma.user.findUnique({
					where: { email: user.email },
				})

				if (!existingUser) {
					// New OAuth user — assign role based on env config
					const role = getRoleForEmail(user.email)
					// The adapter will create the user; we update the role after
					setTimeout(async () => {
						await prisma.user.update({
							where: { email: user.email as string },
							data: { role },
						})
					}, 100)
				} else if (!existingUser.isActive) {
					return false // Block deactivated users
				}
			}
			return true
		},
	},
	events: {
		async createUser({ user }) {
			// Assign role based on env config for new users
			if (user.email) {
				const role = getRoleForEmail(user.email)
				if (role !== "USER") {
					await prisma.user.update({
						where: { id: user.id },
						data: { role },
					})
				}
			}
		},
	},
})

/* -------------------------------------------------------------------------- */
/*  Public helper: which providers are enabled (for UI rendering)             */
/* -------------------------------------------------------------------------- */

/**
 * Returns configuration for which auth methods are enabled.
 * Used by login/register pages to conditionally render UI.
 */
export function getAuthConfig(): AuthConfig {
	const oauthProviders: Array<{ id: OAuthProviderId; name: string; envKey: string }> = [
		{ id: "google", name: "Google", envKey: "GOOGLE_CLIENT_ID" },
		{ id: "github", name: "GitHub", envKey: "GITHUB_CLIENT_ID" },
		{ id: "apple", name: "Apple", envKey: "APPLE_CLIENT_ID" },
	]

	const providers: AuthProviderInfo[] = oauthProviders.map((p) => ({
		id: p.id,
		name: p.name,
		enabled: !!process.env[p.envKey],
	}))

	return {
		credentialsEnabled: true,
		magicLinkEnabled: process.env.MAGIC_LINK_ENABLED === "true",
		providers,
	}
}
