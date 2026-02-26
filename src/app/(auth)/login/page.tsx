/**
 * Login page — server component that reads auth config
 * and passes it to the client-side LoginForm.
 */

import { Suspense } from "react"
import { getAuthConfig } from "@/lib/auth/config"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata = {
	title: "Sign In",
	description: "Sign in to your account",
}

export default function LoginPage() {
	const authConfig = getAuthConfig()

	return (
		<Suspense fallback={<div className="text-center py-8">Loading...</div>}>
			<LoginForm authConfig={authConfig} />
		</Suspense>
	)
}
