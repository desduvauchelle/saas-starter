/**
 * Register page — server component that reads auth config
 * and passes it to the client-side RegisterForm.
 */

import { getAuthConfig } from "@/lib/auth/config"
import { RegisterForm } from "@/components/auth/RegisterForm"

export const metadata = {
	title: "Create Account",
	description: "Create a new account",
}

export default function RegisterPage() {
	const authConfig = getAuthConfig()

	return <RegisterForm authConfig={authConfig} />
}
