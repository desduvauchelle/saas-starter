/**
 * Public layout — shared layout for blog, contact, legal pages.
 * Includes a simple navbar and footer.
 */

import Link from "next/link"
import type { ReactNode } from "react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export default function PublicLayout({ children }: { children: ReactNode }) {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"

	return (
		<div className="min-h-screen flex flex-col">
			{/* Navbar */}
			<div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200">
				<div className="navbar container mx-auto px-4">
					<div className="flex-1">
						<Link href="/" className="btn btn-ghost text-xl font-bold tracking-tight">
							{appName}
						</Link>
					</div>
					<div className="flex-none gap-2">
						<Link href="/blog" className="btn btn-ghost btn-sm">
							Blog
						</Link>
						<Link href="/contact" className="btn btn-ghost btn-sm">
							Contact
						</Link>
						<Link href="/login" className="btn btn-primary btn-sm">
							Sign In
						</Link>
					</div>
				</div>
			</div>

			{/* Content */}
			<main className="flex-1">{children}</main>

			{/* Footer */}
			<footer className="footer footer-center bg-base-300 text-base-content p-10">
				<ThemeToggle />
				<nav className="flex flex-wrap gap-4">
					<Link href="/legal" className="link link-hover">
						Legal
					</Link>
					<Link href="/privacy" className="link link-hover">
						Privacy Policy
					</Link>
					<Link href="/terms" className="link link-hover">
						Terms of Service
					</Link>
					<Link href="/cookies" className="link link-hover">
						Cookie Policy
					</Link>
					<Link href="/gdpr" className="link link-hover">
						GDPR
					</Link>
					<Link href="/contact" className="link link-hover">
						Contact
					</Link>
				</nav>
				<aside>
					<p>
						&copy; {new Date().getFullYear()} {appName}. All rights reserved.
					</p>
				</aside>
			</footer>
		</div>
	)
}
