/**
 * Reset Password page — reached via email link with token.
 */

"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import type { ApiResponse } from "@/types/api"

function ResetPasswordForm() {
	const searchParams = useSearchParams()
	const token = searchParams.get("token") ?? ""

	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
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
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, password }),
			})

			const data = (await res.json()) as ApiResponse<{ message: string }>

			if (!data.success) {
				setError(data.error.message)
			} else {
				setSuccess(true)
			}
		} catch {
			setError("Something went wrong. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	if (!token) {
		return (
			<div className="card bg-base-100 shadow-xl">
				<div className="card-body text-center">
					<h2 className="card-title justify-center text-2xl mb-4">Invalid Link</h2>
					<p className="text-base-content/70">This reset link is invalid or has expired.</p>
					<Link href="/forgot-password" className="btn btn-primary mt-4">
						Request New Link
					</Link>
				</div>
			</div>
		)
	}

	if (success) {
		return (
			<div className="card bg-base-100 shadow-xl">
				<div className="card-body text-center">
					<h2 className="card-title justify-center text-2xl mb-4">Password Reset</h2>
					<p className="text-base-content/70">Your password has been reset successfully.</p>
					<Link href="/login" className="btn btn-primary mt-4">
						Sign In
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="card bg-base-100 shadow-xl">
			<div className="card-body">
				<h2 className="card-title justify-center text-2xl mb-4">Reset Password</h2>

				{error && (
					<div className="alert alert-error text-sm">
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="form-control">
						<label className="label" htmlFor="new-password">
							<span className="label-text">New Password</span>
						</label>
						<input
							id="new-password"
							type="password"
							placeholder="••••••••"
							className="input input-bordered w-full"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
							autoComplete="new-password"
						/>
					</div>

					<div className="form-control">
						<label className="label" htmlFor="confirm-new-password">
							<span className="label-text">Confirm New Password</span>
						</label>
						<input
							id="confirm-new-password"
							type="password"
							placeholder="••••••••"
							className="input input-bordered w-full"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							minLength={8}
							autoComplete="new-password"
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary w-full"
						disabled={loading}
					>
						{loading && <span className="loading loading-spinner loading-sm" />}
						Reset Password
					</button>
				</form>
			</div>
		</div>
	)
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<div className="text-center py-8">Loading...</div>}>
			<ResetPasswordForm />
		</Suspense>
	)
}
