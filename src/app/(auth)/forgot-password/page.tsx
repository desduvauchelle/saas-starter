/**
 * Forgot Password page.
 */

"use client"

import { useState } from "react"
import type { ApiResponse } from "@/types/api"
import { Button, ButtonLink, Input, TextLink } from "@/components/ui"

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("")
	const [loading, setLoading] = useState(false)
	const [sent, setSent] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			})

			const data = (await res.json()) as ApiResponse<{ message: string }>

			if (!data.success) {
				setError(data.error.message)
			} else {
				setSent(true)
			}
		} catch {
			setError("Something went wrong. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	if (sent) {
		return (
			<div className="card bg-base-100 shadow-xl">
				<div className="card-body text-center">
					<h2 className="card-title justify-center text-2xl mb-4">Check Your Email</h2>
					<p className="text-base-content/70">
						If an account exists with that email, we&apos;ve sent a password reset link.
					</p>
					<ButtonLink href="/login" variant="primary" className="mt-4">
						Back to Sign In
					</ButtonLink>
				</div>
			</div>
		)
	}

	return (
		<div className="card bg-base-100 shadow-xl">
			<div className="card-body">
				<h2 className="card-title justify-center text-2xl mb-4">Forgot Password</h2>
				<p className="text-base-content/70 text-center text-sm mb-4">
					Enter your email and we&apos;ll send you a reset link.
				</p>

				{error && (
					<div className="alert alert-error text-sm">
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						id="forgot-email"
						label="Email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
					/>

					<Button
						type="submit"
						variant="primary"
						className="w-full"
						loading={loading}
					>
						Send Reset Link
					</Button>
				</form>

				<p className="text-center text-sm mt-4">
					Remember your password?{" "}
					<TextLink href="/login" variant="primary">
						Sign in
					</TextLink>
				</p>
			</div>
		</div>
	)
}
