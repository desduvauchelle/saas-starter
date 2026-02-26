/**
 * User-related types used across the application.
 */

import type { UserRole } from "@prisma/client"

/** Public user data (safe to return in API responses) */
export interface UserPublic {
	id: string
	name: string | null
	email: string | null
	image: string | null
	avatarUrl: string | null
	role: UserRole
	isActive: boolean
	createdAt: Date
	updatedAt: Date
}

/** Data for creating a new user */
export interface UserCreateInput {
	name: string
	email: string
	password: string
	role?: UserRole
}

/** Data for updating user profile */
export interface UserUpdateInput {
	name?: string
	email?: string
	avatarUrl?: string
	role?: UserRole
	isActive?: boolean
}

/** Data for changing password */
export interface PasswordChangeInput {
	currentPassword: string
	newPassword: string
}

/** Admin user list filters */
export interface UserFilters {
	role?: UserRole
	isActive?: boolean
	search?: string
}
