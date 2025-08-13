import Link from 'next/link'
import { ReactNode } from 'react'

interface LandingLayoutProps {
	children: ReactNode
}

export default function LandingLayout({ children }: LandingLayoutProps) {
	return (
		<div className="min-h-screen bg-base-100">
			<header className="navbar bg-base-100 border-b border-base-200">
				<div className="navbar-start">
					<Link className="btn btn-ghost text-xl" href="/">
						SaaS Starter
					</Link>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal px-1">
						<li><a href="#features">Features</a></li>
						<li><a href="#pricing">Pricing</a></li>
						<li><a href="/blog">Blog</a></li>
					</ul>
				</div>
				<div className="navbar-end">
					<a className="btn btn-ghost" href="/login">Login</a>
					<a className="btn btn-primary" href="/signup">Get Started</a>
				</div>
			</header>

			<main>
				{children}
			</main>

			<footer className="footer footer-center p-10 bg-base-200 text-base-content">
				<aside>
					<p className="font-bold">SaaS Starter</p>
					<p>© 2024 - All rights reserved</p>
				</aside>
			</footer>
		</div>
	)
}
