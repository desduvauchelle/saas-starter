/**
 * RegisterForm — user registration with email + password.
 *
 * Client component that calls POST /api/auth/register,
 * then signs in with next-auth/react.
 */

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { AuthConfig } from "@/types/auth"
import type { ApiResponse } from "@/types/api"
import { Button, Input, TextLink } from "@/components/ui"
import { OAuthButtons } from "./OAuthButtons"

interface RegisterFormProps {
	authConfig: AuthConfig
}

export function RegisterForm({ authConfig }: RegisterFormProps) {
	const router = useRouter()

	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		if (password !== confirmPassword) {
			setError("Passwords do not match")
			setLoading(false)
			return
		}

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			})

			const data = (await res.json()) as ApiResponse<{ id: string }>

			if (!data.success) {
				setError(data.error.message)
				setLoading(false)
				return
			}

			// Auto sign-in after registration
			const signInResult = await signIn("credentials", {
				email,
				password,
				redirect: false,
			})

			if (signInResult?.error) {
				setError("Account created but sign-in failed. Please sign in manually.")
				setLoading(false)
			} else {
				router.push("/dashboard")
			}
		} catch {
			setError("Something went wrong. Please try again.")
			setLoading(false)
		}
	}

	return (
		<div className="card bg-base-100 shadow-xl">
			<div className="card-body">
				<h2 className="card-title justify-center text-2xl mb-4">Create Account</h2>

				{error && (
					<div className="alert alert-error text-sm">
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						id="register-name"
						label="Name"
						type="text"
						placeholder="Your name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						autoComplete="name"
					/>

					<Input
						id="register-email"
						label="Email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
					/>

					<Input
						id="register-password"
						label="Password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={8}
						autoComplete="new-password"
					/>

					<Input
						id="register-confirm"
						label="Confirm Password"
						type="password"
						placeholder="••••••••"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						minLength={8}
						autoComplete="new-password"
					/>

					<Button
						type="submit"
						variant="primary"
						className="w-full"
						loading={loading}
					>
						Create Account
					</Button>
				</form>

				<OAuthButtons providers={authConfig.providers} />

				<p className="text-center text-sm mt-4">
					Already have an account?{" "}
					<TextLink href="/login" variant="primary">
						Sign in
					</TextLink>
				</p>
			</div>
		</div>
	)
}
