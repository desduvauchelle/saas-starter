/**
 * LoginForm — handles email/password login with optional magic-link toggle.
 *
 * Client component that uses next-auth/react's signIn().
 */

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import type { AuthConfig } from "@/types/auth"
import { Button, Input, TextLink } from "@/components/ui"
import { OAuthButtons } from "./OAuthButtons"

interface LoginFormProps {
	authConfig: AuthConfig
}

export function LoginForm({ authConfig }: LoginFormProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [mode, setMode] = useState<"credentials" | "magic-link">("credentials")

	async function handleCredentialsSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		})

		if (result?.error) {
			setError("Invalid email or password")
			setLoading(false)
		} else {
			router.push(callbackUrl)
		}
	}

	async function handleMagicLinkSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		const result = await signIn("email", {
			email,
			redirect: false,
			callbackUrl,
		})

		if (result?.error) {
			setError("Failed to send magic link. Please try again.")
		} else {
			setError(null)
			router.push("/verify-email?type=magic-link")
		}
		setLoading(false)
	}

	return (
		<div className="card bg-base-100 shadow-xl">
			<div className="card-body">
				<h2 className="card-title justify-center text-2xl mb-4">Sign In</h2>

				{error && (
					<div className="alert alert-error text-sm">
						<span>{error}</span>
					</div>
				)}

				{/* Mode toggle if magic link is enabled */}
				{authConfig.magicLinkEnabled && (
					<div className="tabs tabs-boxed mb-4">
						<button
							type="button"
							className={`tab flex-1 ${mode === "credentials" ? "tab-active" : ""}`}
							onClick={() => setMode("credentials")}
						>
							Email & Password
						</button>
						<button
							type="button"
							className={`tab flex-1 ${mode === "magic-link" ? "tab-active" : ""}`}
							onClick={() => setMode("magic-link")}
						>
							Magic Link
						</button>
					</div>
				)}

				{mode === "credentials" ? (
					<form onSubmit={handleCredentialsSubmit} className="space-y-4">
						<Input
							id="login-email"
							label="Email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="email"
						/>

						<div className="form-control">
							<Input
								id="login-password"
								label="Password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								autoComplete="current-password"
							/>
							<label className="label">
								<TextLink
									href="/forgot-password"
									variant="hover"
									className="label-text-alt"
								>
									Forgot password?
								</TextLink>
							</label>
						</div>

						<Button
							type="submit"
							variant="primary"
							className="w-full"
							loading={loading}
						>
							Sign In
						</Button>
					</form>
				) : (
					<form onSubmit={handleMagicLinkSubmit} className="space-y-4">
						<Input
							id="magic-email"
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
							Send Magic Link
						</Button>
					</form>
				)}

				<OAuthButtons
					providers={authConfig.providers}
					callbackUrl={callbackUrl}
				/>

				<p className="text-center text-sm mt-4">
					Don&apos;t have an account?{" "}
					<TextLink href="/register" variant="primary">
						Sign up
					</TextLink>
				</p>
			</div>
		</div>
	)
}
