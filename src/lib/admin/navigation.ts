/**
 * Admin sidebar navigation configuration.
 *
 * Each NavItem has a label, href, icon name (FontAwesome),
 * and an optional `roles` array to restrict visibility.
 * If `roles` is omitted, the item is visible to all admins.
 */

import type { UserRole } from "@prisma/client"

export interface NavItem {
	label: string
	href: string
	/** FontAwesome icon name without the `fa-` prefix (e.g. "users", "file-alt") */
	icon: string
	/** If set, only these roles can see this item */
	roles?: UserRole[]
	/** Nested items for sub-menus */
	children?: NavItem[]
}

export interface NavSection {
	title: string
	items: NavItem[]
}

/** Admin sidebar navigation structure */
export const adminNavigation: NavSection[] = [
	{
		title: "Overview",
		items: [
			{
				label: "Dashboard",
				href: "/admin",
				icon: "gauge-high",
			},
		],
	},
	{
		title: "Content",
		items: [
			{
				label: "Blog Posts",
				href: "/admin/blog",
				icon: "newspaper",
			},
		],
	},
	{
		title: "Users & Access",
		items: [
			{
				label: "Users",
				href: "/admin/users",
				icon: "users",
			},
		],
	},
	{
		title: "Billing",
		items: [
			{
				label: "Products",
				href: "/admin/products",
				icon: "box",
			},
			{
				label: "Subscriptions",
				href: "/admin/subscriptions",
				icon: "credit-card",
			},
		],
	},
	{
		title: "System",
		items: [
			{
				label: "Storage",
				href: "/admin/storage",
				icon: "hard-drive",
				roles: ["OWNER"],
			},
			{
				label: "Settings",
				href: "/admin/settings",
				icon: "gear",
				roles: ["OWNER"],
			},
		],
	},
]

/**
 * Filter navigation sections/items by user role.
 * Returns only sections that have at least one visible item.
 */
export function getVisibleNavigation(role: UserRole): NavSection[] {
	return adminNavigation
		.map((section) => ({
			...section,
			items: section.items.filter(
				(item) => !item.roles || item.roles.includes(role)
			),
		}))
		.filter((section) => section.items.length > 0)
}
