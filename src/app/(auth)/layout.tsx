/**
 * Auth layout — centered card layout with no navbar.
 * Used for login, register, forgot-password, etc.
 */

import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-base-content">
						{process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"}
					</h1>
				</div>
				{children}
			</div>
		</div>
	)
}
