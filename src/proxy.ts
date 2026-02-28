/**
 * Proxy for route protection.
 *
 * Protects:
 *  - /app/* (authenticated users only)
 *  - /admin/* (ADMIN and OWNER roles only)
 *
 * Redirects unauthenticated users to /login.
 * Redirects non-admin users to /dashboard.
 *
 * Uses NextAuth's `auth` wrapper for proxy.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth/config"

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
	const { pathname } = req.nextUrl
	const session = req.auth

	// Public routes — always accessible
	const publicPaths = [
		"/",
		"/login",
		"/register",
		"/forgot-password",
		"/reset-password",
		"/verify-email",
		"/magic-link",
		"/blog",
		"/contact",
		"/legal",
		"/privacy",
		"/terms",
		"/cookies",
		"/gdpr",
		"/api/auth",
		"/api/contact",
		"/api/billing/webhooks",
	]

	const isPublic = publicPaths.some(
		(path) => pathname === path || pathname.startsWith(path + "/")
	)

	if (isPublic) {
		return NextResponse.next()
	}

	// Protected routes — require authentication
	if (!session?.user) {
		const loginUrl = new URL("/login", req.url)
		loginUrl.searchParams.set("callbackUrl", pathname)
		return NextResponse.redirect(loginUrl)
	}

	// Admin routes — require ADMIN or OWNER role
	if (pathname.startsWith("/admin")) {
		const role = session.user.role
		if (role !== "ADMIN" && role !== "OWNER") {
			return NextResponse.redirect(new URL("/dashboard", req.url))
		}
	}

	return NextResponse.next()
})

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization)
		 * - favicon.ico
		 * - public files (.svg, .png, etc.)
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
}
