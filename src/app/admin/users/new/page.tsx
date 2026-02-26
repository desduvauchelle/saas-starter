/**
 * Admin Create User page.
 *
 * Form to create a new user with name, email, password, role, and status.
 * Accessible at /admin/users/new.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { UserRole } from "@prisma/client"

export default function AdminCreateUserPage() {
	const router = useRouter()
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [role, setRole] = useState<UserRole>("USER")
	const [isActive, setIsActive] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState("")
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		setError("")
		setFieldErrors({})

		try {
			const res = await fetch("/api/admin/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password, role, isActive }),
			})

			const json: unknown = await res.json()

			if (res.ok) {
				const data = json as { data: { id: string } }
				router.push(`/admin/users/${data.data.id}`)
			} else {
				const err = json as {
					error: {
						message: string
						details?: Record<string, string[]>
					}
				}
				setError(err.error.message)
				if (err.error.details) {
					setFieldErrors(err.error.details)
				}
			}
		} catch {
			setError("Failed to create user")
		} finally {
			setSaving(false)
		}
	}

	const getFieldError = (field: string): string | undefined => {
		return fieldErrors[field]?.[0]
	}

	return (
		<div>
			{/* Breadcrumb */}
			<div className="text-sm breadcrumbs mb-4">
				<ul>
					<li><Link href="/admin">Admin</Link></li>
					<li><Link href="/admin/users">Users</Link></li>
					<li>New User</li>
				</ul>
			</div>

			<h1 className="text-2xl font-bold mb-6">Create User</h1>

			<div className="card bg-base-200 max-w-2xl">
				<div className="card-body">
					{error && (
						<div className="alert alert-error">
							<span>{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Name *</span>
							</label>
							<input
								type="text"
								className={`input input-bordered ${getFieldError("name") ? "input-error" : ""}`}
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
							{getFieldError("name") && (
								<label className="label">
									<span className="label-text-alt text-error">{getFieldError("name")}</span>
								</label>
							)}
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Email *</span>
							</label>
							<input
								type="email"
								className={`input input-bordered ${getFieldError("email") ? "input-error" : ""}`}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							{getFieldError("email") && (
								<label className="label">
									<span className="label-text-alt text-error">{getFieldError("email")}</span>
								</label>
							)}
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Password *</span>
							</label>
							<input
								type="password"
								className={`input input-bordered ${getFieldError("password") ? "input-error" : ""}`}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={8}
							/>
							{getFieldError("password") && (
								<label className="label">
									<span className="label-text-alt text-error">{getFieldError("password")}</span>
								</label>
							)}
							<label className="label">
								<span className="label-text-alt text-base-content/50">
									Minimum 8 characters
								</span>
							</label>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Role</span>
							</label>
							<select
								className="select select-bordered"
								value={role}
								onChange={(e) => setRole(e.target.value as UserRole)}
							>
								<option value="USER">User</option>
								<option value="ADMIN">Admin</option>
								<option value="OWNER">Owner</option>
							</select>
						</div>

						<div className="form-control">
							<label className="label cursor-pointer justify-start gap-3">
								<input
									type="checkbox"
									className="toggle toggle-success"
									checked={isActive}
									onChange={(e) => setIsActive(e.target.checked)}
								/>
								<span className="label-text">
									{isActive ? "Active" : "Inactive"}
								</span>
							</label>
						</div>

						<div className="flex gap-2 pt-2">
							<button
								type="submit"
								className="btn btn-primary"
								disabled={saving}
							>
								{saving && <span className="loading loading-spinner loading-xs" />}
								Create User
							</button>
							<Link href="/admin/users" className="btn btn-ghost">
								Cancel
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
