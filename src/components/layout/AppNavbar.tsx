/**
 * AppNavbar — top navigation bar for authenticated users.
 *
 * Shows the app name, user avatar/dropdown, and links to
 * dashboard, account, and admin (if admin role).
 */

"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { ButtonLink, Button } from "@/components/ui"
import type { UserRole } from "@prisma/client"

interface AppNavbarProps {
	user: {
		id: string
		name?: string | null
		email?: string | null
		image?: string | null
		role: UserRole
	}
}

export function AppNavbar({ user }: AppNavbarProps) {
	const isAdmin = user.role === "ADMIN" || user.role === "OWNER"
	const initials = (user.name ?? user.email ?? "U").charAt(0).toUpperCase()

	return (
		<div className="navbar bg-base-100 shadow-sm">
			<div className="flex-1">
				<ButtonLink href="/dashboard" variant="ghost" className="text-xl">
					{process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"}
				</ButtonLink>
			</div>
			<div className="flex-none gap-2">
				{isAdmin && (
					<ButtonLink href="/admin" variant="ghost" size="sm">
						Admin
					</ButtonLink>
				)}
				<div className="dropdown dropdown-end">
					<div
						tabIndex={0}
						role="button"
						className="btn btn-ghost btn-circle avatar placeholder"
					>
						{user.image ? (
							<div className="w-10 rounded-full">
								<img src={user.image} alt={user.name ?? "Avatar"} />
							</div>
						) : (
							<div className="bg-primary text-primary-content w-10 rounded-full">
								<span>{initials}</span>
							</div>
						)}
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
					>
						<li className="menu-title">
							<span className="text-xs text-base-content/60">
								{user.email}
							</span>
						</li>
						<li>
							<Link href="/account/profile">Profile</Link>
						</li>
						<li>
							<Link href="/account/security">Security</Link>
						</li>
						<li>
							<Link href="/account/billing">Billing</Link>
						</li>
						<div className="divider my-0" />
						<li>
							<Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
								Sign Out
							</Button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
