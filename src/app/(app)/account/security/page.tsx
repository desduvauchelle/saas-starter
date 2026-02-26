/**
 * Account Security page — change password, danger zone.
 */

"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import type { ApiResponse } from "@/types/api"

export default function SecurityPage() {
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	async function handlePasswordChange(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setMessage(null)

		if (newPassword !== confirmPassword) {
			setMessage({ type: "error", text: "New passwords do not match" })
			setLoading(false)
			return
		}

		try {
			const res = await fetch("/api/account/password", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword,
					newPassword,
				}),
			})

			const data = (await res.json()) as ApiResponse<{ message: string }>

			if (!data.success) {
				setMessage({ type: "error", text: data.error.message })
			} else {
				setMessage({ type: "success", text: "Password changed successfully" })
				setCurrentPassword("")
				setNewPassword("")
				setConfirmPassword("")
			}
		} catch {
			setMessage({ type: "error", text: "Failed to change password" })
		} finally {
			setLoading(false)
		}
	}

	async function handleDeleteAccount() {
		setDeleteLoading(true)

		try {
			const res = await fetch("/api/account", {
				method: "DELETE",
			})

			const data = (await res.json()) as ApiResponse<{ message: string }>

			if (!data.success) {
				setMessage({ type: "error", text: data.error.message })
				setDeleteLoading(false)
			} else {
				await signOut({ callbackUrl: "/login" })
			}
		} catch {
			setMessage({ type: "error", text: "Failed to delete account" })
			setDeleteLoading(false)
		}
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold">Security</h1>

			{message && (
				<div
					className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} text-sm`}
				>
					<span>{message.text}</span>
				</div>
			)}

			{/* Change Password */}
			<div className="card bg-base-100 shadow-sm">
				<div className="card-body">
					<h2 className="card-title text-lg">Change Password</h2>

					<form onSubmit={handlePasswordChange} className="space-y-4">
						<div className="form-control">
							<label className="label" htmlFor="current-password">
								<span className="label-text">Current Password</span>
							</label>
							<input
								id="current-password"
								type="password"
								className="input input-bordered w-full"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
								autoComplete="current-password"
							/>
						</div>

						<div className="form-control">
							<label className="label" htmlFor="new-pass">
								<span className="label-text">New Password</span>
							</label>
							<input
								id="new-pass"
								type="password"
								className="input input-bordered w-full"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								minLength={8}
								autoComplete="new-password"
							/>
						</div>

						<div className="form-control">
							<label className="label" htmlFor="confirm-pass">
								<span className="label-text">Confirm New Password</span>
							</label>
							<input
								id="confirm-pass"
								type="password"
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
							className="btn btn-primary"
							disabled={loading}
						>
							{loading && <span className="loading loading-spinner loading-sm" />}
							Update Password
						</button>
					</form>
				</div>
			</div>

			{/* Danger Zone */}
			<div className="card bg-base-100 shadow-sm border border-error/20">
				<div className="card-body">
					<h2 className="card-title text-lg text-error">Danger Zone</h2>
					<p className="text-sm text-base-content/70">
						Permanently delete your account and all of your data. This action
						cannot be undone.
					</p>

					{showDeleteConfirm ? (
						<div className="flex gap-2 mt-2">
							<button
								type="button"
								className="btn btn-error btn-sm"
								onClick={handleDeleteAccount}
								disabled={deleteLoading}
							>
								{deleteLoading && (
									<span className="loading loading-spinner loading-sm" />
								)}
								Yes, Delete My Account
							</button>
							<button
								type="button"
								className="btn btn-ghost btn-sm"
								onClick={() => setShowDeleteConfirm(false)}
							>
								Cancel
							</button>
						</div>
					) : (
						<button
							type="button"
							className="btn btn-outline btn-error btn-sm w-fit mt-2"
							onClick={() => setShowDeleteConfirm(true)}
						>
							Delete Account
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
