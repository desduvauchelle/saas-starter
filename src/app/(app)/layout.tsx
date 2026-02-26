/**
 * App shell layout — authenticated area.
 *
 * Contains a top navbar with user info and a sidebar navigation.
 * All children are protected by middleware (requires auth).
 */

import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { AppNavbar } from "@/components/layout/AppNavbar"
import { SessionProvider } from "next-auth/react"

export default async function AppLayout({ children }: { children: ReactNode }) {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	return (
		<SessionProvider session={session}>
			<div className="min-h-screen bg-base-200">
				<AppNavbar user={session.user} />
				<main className="container mx-auto px-4 py-8 max-w-7xl">
					{children}
				</main>
			</div>
		</SessionProvider>
	)
}
