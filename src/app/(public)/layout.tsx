/**
 * Public layout — shared layout for blog, contact, legal pages.
 * Includes a simple navbar and footer.
 */

import type { ReactNode } from "react"
import { ButtonLink, TextLink } from "@/components/ui"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

export default function PublicLayout({ children }: { children: ReactNode }) {
	const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"

	return (
		<div className="min-h-screen flex flex-col">
			{/* Navbar */}
			<div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200">
				<div className="navbar container mx-auto px-4">
					<div className="flex-1">
						<ButtonLink href="/" variant="ghost" className="text-xl font-bold tracking-tight">
							{appName}
						</ButtonLink>
					</div>
					<div className="flex-none gap-2">
						<ButtonLink href="/blog" variant="ghost" size="sm">
							Blog
						</ButtonLink>
						<ButtonLink href="/contact" variant="ghost" size="sm">
							Contact
						</ButtonLink>
						<ButtonLink href="/login" variant="primary" size="sm">
							Sign In
						</ButtonLink>
					</div>
				</div>
			</div>

			{/* Content */}
			<main className="flex-1">{children}</main>

			{/* Footer */}
			<footer className="footer footer-center bg-base-300 text-base-content p-10">
				<ThemeToggle />
				<nav className="flex flex-wrap gap-4">
					<TextLink href="/legal" variant="hover">
						Legal
					</TextLink>
					<TextLink href="/privacy" variant="hover">
						Privacy Policy
					</TextLink>
					<TextLink href="/terms" variant="hover">
						Terms of Service
					</TextLink>
					<TextLink href="/cookies" variant="hover">
						Cookie Policy
					</TextLink>
					<TextLink href="/gdpr" variant="hover">
						GDPR
					</TextLink>
					<TextLink href="/contact" variant="hover">
						Contact
					</TextLink>
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
