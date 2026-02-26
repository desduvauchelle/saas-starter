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
import { Button, ButtonLink, Input, Select, Toggle } from "@/components/ui"

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
						<Input
							label="Name *"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							error={getFieldError("name")}
						/>

						<Input
							label="Email *"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							error={getFieldError("email")}
						/>

						<Input
							label="Password *"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
							error={getFieldError("password")}
							description="Minimum 8 characters"
						/>

						<Select
							label="Role"
							value={role}
							onChange={(e) => setRole(e.target.value as UserRole)}
							options={[
								{ label: "User", value: "USER" },
								{ label: "Admin", value: "ADMIN" },
								{ label: "Owner", value: "OWNER" },
							]}
						/>

						<Toggle
							label={isActive ? "Active" : "Inactive"}
							color="success"
							checked={isActive}
							onChange={(e) => setIsActive(e.target.checked)}
						/>

						<div className="flex gap-2 pt-2">
							<Button
								type="submit"
								variant="primary"
								loading={saving}
								disabled={saving}
							>
								Create User
							</Button>
							<ButtonLink href="/admin/users" variant="ghost">
								Cancel
							</ButtonLink>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
