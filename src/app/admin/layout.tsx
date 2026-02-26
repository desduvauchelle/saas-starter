/**
 * Admin layout — server component that checks admin role
 * and renders the AdminShell with sidebar navigation.
 *
 * The middleware already ensures the user is authenticated with
 * ADMIN or OWNER role. This layout fetches the session and passes
 * the filtered navigation to the client shell.
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { getVisibleNavigation } from "@/lib/admin/navigation"
import { AdminShell } from "@/components/admin/AdminShell"
import type { UserRole } from "@prisma/client"

export const metadata = {
	title: "Admin",
}

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	const role = (session.user.role ?? "USER") as UserRole

	if (role !== "ADMIN" && role !== "OWNER") {
		redirect("/dashboard")
	}

	const navigation = getVisibleNavigation(role)

	return (
		<AdminShell navigation={navigation} role={role}>
			{children}
		</AdminShell>
	)
}
