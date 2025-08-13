

interface IUserMandatory {
	id: string
	email: string
	isAdmin?: boolean
}

export interface IUser extends IUserMandatory {
	name?: string
	image?: string
	createdAt?: string
	updatedAt?: string
}
