/**
 * Forgot Password page.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import type { ApiResponse } from "@/types/api"

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
					<Link href="/login" className="btn btn-primary mt-4">
						Back to Sign In
					</Link>
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
					<div className="form-control">
						<label className="label" htmlFor="forgot-email">
							<span className="label-text">Email</span>
						</label>
						<input
							id="forgot-email"
							type="email"
							placeholder="you@example.com"
							className="input input-bordered w-full"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="email"
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary w-full"
						disabled={loading}
					>
						{loading && <span className="loading loading-spinner loading-sm" />}
						Send Reset Link
					</button>
				</form>

				<p className="text-center text-sm mt-4">
					Remember your password?{" "}
					<Link href="/login" className="link link-primary">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	)
}
