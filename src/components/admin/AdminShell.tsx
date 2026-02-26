/**
 * AdminShell — client-side wrapper that manages sidebar state.
 *
 * Handles collapse toggle and passes navigation + role to AdminSidebar.
 */

"use client"

import { useState } from "react"
import type { UserRole } from "@prisma/client"
import type { NavSection } from "@/lib/admin/navigation"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

interface AdminShellProps {
	navigation: NavSection[]
	role: UserRole
	children: React.ReactNode
}

export function AdminShell({ navigation, role, children }: AdminShellProps) {
	const [collapsed, setCollapsed] = useState(false)

	return (
		<div className="drawer lg:drawer-open min-h-screen">
			<input id="admin-drawer" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col bg-base-100">
				{/* Mobile Navbar */}
				<div className="w-full navbar bg-base-200 lg:hidden border-b border-base-300">
					<div className="flex-none">
						<label htmlFor="admin-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
							<i className="fa-solid fa-bars text-xl"></i>
						</label>
					</div>
					<div className="flex-1 px-2 mx-2 font-bold text-lg">Admin</div>
				</div>
				{/* Main Content */}
				<main className="flex-1 p-6">
					{children}
				</main>
			</div>
			<div className="drawer-side z-40">
				<label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
				<AdminSidebar
					navigation={navigation}
					role={role}
					collapsed={collapsed}
					onToggleCollapse={() => setCollapsed((prev) => !prev)}
				/>
			</div>
		</div>
	)
}
