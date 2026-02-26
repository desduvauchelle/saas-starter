/**
 * Admin User Detail/Edit — view and edit a single user.
 *
 * Shows user info with inline editing form.
 * Accessible at /admin/users/[id].
 */

"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { UserRole } from "@prisma/client"
import { parseApiResponse } from "@/lib/api/client"
import { Button, ButtonLink, Input, Select, Toggle } from "@/components/ui"

interface UserDetail {
	id: string
	name: string | null
	email: string | null
	image: string | null
	avatarUrl: string | null
	role: UserRole
	isActive: boolean
	createdAt: string
	updatedAt: string
	_count: {
		posts: number
		subscriptions: number
	}
}

export default function AdminUserDetailPage() {
	const params = useParams<{ id: string }>()
	const router = useRouter()
	const [user, setUser] = useState<UserDetail | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	// Form state
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [role, setRole] = useState<UserRole>("USER")
	const [isActive, setIsActive] = useState(true)

	const fetchUser = useCallback(async () => {
		try {
			const res = await fetch(`/api/admin/users/${params.id}`)
			const result = await parseApiResponse<UserDetail>(res)

			if (result.ok) {
				setUser(result.data)
				setName(result.data.name ?? "")
				setEmail(result.data.email ?? "")
				setRole(result.data.role)
				setIsActive(result.data.isActive)
			} else {
				setError(result.message)
			}
		} catch {
			setError("Failed to load user")
		} finally {
			setLoading(false)
		}
	}, [params.id])

	useEffect(() => {
		void fetchUser()
	}, [fetchUser])

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		setError("")
		setSuccess("")

		try {
			const res = await fetch(`/api/admin/users/${params.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, role, isActive }),
			})

			const result = await parseApiResponse<UserDetail>(res)

			if (result.ok) {
				setSuccess("User updated successfully")
				void fetchUser()
			} else {
				setError(result.message)
			}
		} catch {
			setError("Failed to update user")
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) {
			return
		}

		try {
			const res = await fetch(`/api/admin/users/${params.id}`, {
				method: "DELETE",
			})

			const result = await parseApiResponse<unknown>(res)
			if (result.ok) {
				router.push("/admin/users")
			} else {
				setError(result.message)
			}
		} catch {
			setError("Failed to delete user")
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center py-12">
				<span className="loading loading-spinner loading-lg" />
			</div>
		)
	}

	if (!user) {
		return (
			<div className="text-center py-12">
				<p className="text-error">{error || "User not found"}</p>
				<ButtonLink href="/admin/users" variant="ghost" size="sm" className="mt-4">
					Back to Users
				</ButtonLink>
			</div>
		)
	}

	return (
		<div>
			{/* Breadcrumb */}
			<div className="text-sm breadcrumbs mb-4">
				<ul>
					<li><Link href="/admin">Admin</Link></li>
					<li><Link href="/admin/users">Users</Link></li>
					<li>{user.name ?? user.email ?? "User"}</li>
				</ul>
			</div>

			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Edit User</h1>
				{user.role !== "OWNER" && (
					<Button
						onClick={handleDelete}
						variant="error"
						size="sm"
					>
						<i className="fa-solid fa-trash mr-1" /> Delete User
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Edit Form */}
				<div className="lg:col-span-2">
					<div className="card bg-base-200">
						<div className="card-body">
							{error && (
								<div className="alert alert-error">
									<span>{error}</span>
								</div>
							)}
							{success && (
								<div className="alert alert-success">
									<span>{success}</span>
								</div>
							)}

							<form onSubmit={handleSave} className="space-y-4">
								<Input
									label="Name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>

								<Input
									label="Email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
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
										Save Changes
									</Button>
									<ButtonLink href="/admin/users" variant="ghost">
										Cancel
									</ButtonLink>
								</div>
							</form>
						</div>
					</div>
				</div>

				{/* Info Sidebar */}
				<div className="space-y-4">
					<div className="card bg-base-200">
						<div className="card-body">
							<h3 className="card-title text-sm">User Info</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-base-content/60">ID</span>
									<code className="text-xs">{user.id}</code>
								</div>
								<div className="flex justify-between">
									<span className="text-base-content/60">Created</span>
									<span>{new Date(user.createdAt).toLocaleDateString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-base-content/60">Updated</span>
									<span>{new Date(user.updatedAt).toLocaleDateString()}</span>
								</div>
							</div>
						</div>
					</div>

					<div className="card bg-base-200">
						<div className="card-body">
							<h3 className="card-title text-sm">Statistics</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-base-content/60">Posts</span>
									<span className="badge badge-sm">{user._count.posts}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-base-content/60">Subscriptions</span>
									<span className="badge badge-sm">{user._count.subscriptions}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
