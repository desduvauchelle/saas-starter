/**
 * AdminSidebar — collapsible sidebar navigation for the admin area.
 *
 * Renders navigation sections and items based on the user's role.
 * Uses DaisyUI menu component with FontAwesome icons.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { UserRole } from "@prisma/client"
import type { NavSection } from "@/lib/admin/navigation"
import { Button } from "@/components/ui"

interface AdminSidebarProps {
	navigation: NavSection[]
	role: UserRole
	collapsed?: boolean
	onToggleCollapse?: () => void
}

export function AdminSidebar({
	navigation,
	collapsed = false,
	onToggleCollapse,
}: AdminSidebarProps) {
	const pathname = usePathname()

	const isActive = (href: string): boolean => {
		if (href === "/admin") return pathname === "/admin"
		return pathname.startsWith(href)
	}

	return (
		<aside
			className={`bg-base-200 border-r border-base-300 h-screen sticky top-0 flex flex-col transition-all duration-300 z-30 ${collapsed ? "w-20" : "w-72"
				}`}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 mb-2">
				{!collapsed && (
					<Link href="/admin" className="flex items-center gap-3 font-bold text-xl px-2">
						<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content">
							<i className="fa-solid fa-rocket text-sm" />
						</div>
						<span>Admin</span>
					</Link>
				)}
				<div className={`flex ${collapsed ? "w-full justify-center" : "hidden lg:flex"}`}>
					<Button
						variant="ghost"
						size="sm"
						modifier="square"
						onClick={onToggleCollapse}
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						<i
							className={`fa-solid ${collapsed ? "fa-bars" : "fa-outdent text-base-content/50"
								}`}
						/>
					</Button>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto overflow-x-hidden px-4">
				<ul className="menu w-full p-0 gap-2">
					{navigation.map((section) => (
						<li key={section.title}>
							{!collapsed && (
								<h2 className="menu-title text-xs font-bold uppercase tracking-wider text-base-content/50 px-2 mt-4 mb-1">
									{section.title}
								</h2>
							)}
							<ul className="gap-1">
								{section.items.map((item) => {
									const active = isActive(item.href)
									return (
										<li key={item.href}>
											<Link
												href={item.href}
												className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${active
													? "active bg-primary text-primary-content font-medium"
													: "hover:bg-base-300 text-base-content/80"
													}`}
												title={collapsed ? item.label : undefined}>

												{!collapsed && <span>{item.label}</span>}
											</Link>
										</li>
									)
								})}
							</ul>
						</li>
					))}
				</ul>
			</nav>

			{/* Back to app link footer */}
			<div className="p-4 mt-auto border-t border-base-300">
				<ul className="menu w-full p-0">
					<li>
						<Link
							href="/dashboard"
							className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-base-content/60 hover:bg-base-300 hover:text-base-content"
						>
							<div className="w-5 flex justify-center">
								<i className="fa-solid fa-arrow-left text-lg" />
							</div>
							{!collapsed && <span className="font-medium">Back to App</span>}
						</Link>
					</li>
				</ul>
			</div>
		</aside>
	)
}
