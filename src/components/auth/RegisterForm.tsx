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
import Link from "next/link"
import type { AuthConfig } from "@/types/auth"
import type { ApiResponse } from "@/types/api"
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
					<div className="form-control">
						<label className="label" htmlFor="register-name">
							<span className="label-text">Name</span>
						</label>
						<input
							id="register-name"
							type="text"
							placeholder="Your name"
							className="input input-bordered w-full"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							autoComplete="name"
						/>
					</div>

					<div className="form-control">
						<label className="label" htmlFor="register-email">
							<span className="label-text">Email</span>
						</label>
						<input
							id="register-email"
							type="email"
							placeholder="you@example.com"
							className="input input-bordered w-full"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="email"
						/>
					</div>

					<div className="form-control">
						<label className="label" htmlFor="register-password">
							<span className="label-text">Password</span>
						</label>
						<input
							id="register-password"
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
						<label className="label" htmlFor="register-confirm">
							<span className="label-text">Confirm Password</span>
						</label>
						<input
							id="register-confirm"
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
						Create Account
					</button>
				</form>

				<OAuthButtons providers={authConfig.providers} />

				<p className="text-center text-sm mt-4">
					Already have an account?{" "}
					<Link href="/login" className="link link-primary">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	)
}
