'use client'

import { useState, useCallback } from 'react'


const BASE_API = '/api' // Update this as needed

type CrudParams = {
	objectName: string
}

type GetParams = {
	query?: Record<string, unknown>
	page?: number
	pageSize?: number
}

type GetByIdParams = {
	id: string
}

type CreateParams<T> = {
	data: T
}

type UpdateParams<T> = {
	id: string
	data: Partial<T>
}

type DeleteParams = {
	id: string
}

type CrudError = {
	type: string
	message: string
} | null

type CrudResult<T> = [T | null, CrudError]

export function useBasicCrud<T>({ objectName }: CrudParams) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<CrudError>(null)

	const handleError = (type: string, e: unknown): CrudError => ({
		type,
		message: e instanceof Error ? e.message : 'Unknown error',
	})

	const get = useCallback(
		async ({ query = {}, page = 1, pageSize = 20 }: GetParams = {}): Promise<CrudResult<T[]>> => {
			setLoading(true)
			setError(null)
			try {
				const params = new URLSearchParams({
					...Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)])),
					page: String(page),
					pageSize: String(pageSize),
				})
				const res = await fetch(`${BASE_API}/${objectName}?${params.toString()}`)
				if (!res.ok) throw new Error('Failed to fetch')
				const data = (await res.json()) as T[]
				return [data, null]
			} catch (e) {
				const err = handleError('get', e)
				setError(err)
				return [null, err]
			} finally {
				setLoading(false)
			}
		},
		[objectName]
	)

	const getById = useCallback(
		async ({ id }: GetByIdParams): Promise<CrudResult<T>> => {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`${BASE_API}/${objectName}/${id}`)
				if (!res.ok) throw new Error('Failed to fetch')
				const data = (await res.json()) as T
				return [data, null]
			} catch (e) {
				const err = handleError('getById', e)
				setError(err)
				return [null, err]
			} finally {
				setLoading(false)
			}
		},
		[objectName]
	)

	const create = useCallback(
		async ({ data }: CreateParams<T>): Promise<CrudResult<T>> => {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`${BASE_API}/${objectName}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				})
				if (!res.ok) throw new Error('Failed to create')
				const result = (await res.json()) as T
				return [result, null]
			} catch (e) {
				const err = handleError('create', e)
				setError(err)
				return [null, err]
			} finally {
				setLoading(false)
			}
		},
		[objectName]
	)

	const update = useCallback(
		async ({ id, data }: UpdateParams<T>): Promise<CrudResult<T>> => {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`${BASE_API}/${objectName}/${id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				})
				if (!res.ok) throw new Error('Failed to update')
				const result = (await res.json()) as T
				return [result, null]
			} catch (e) {
				const err = handleError('update', e)
				setError(err)
				return [null, err]
			} finally {
				setLoading(false)
			}
		},
		[objectName]
	)

	const remove = useCallback(
		async ({ id }: DeleteParams): Promise<CrudResult<T>> => {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`${BASE_API}/${objectName}/${id}`, {
					method: 'DELETE',
				})
				if (!res.ok) throw new Error('Failed to delete')
				const result = (await res.json()) as T
				return [result, null]
			} catch (e) {
				const err = handleError('delete', e)
				setError(err)
				return [null, err]
			} finally {
				setLoading(false)
			}
		},
		[objectName]
	)

	return {
		loading,
		error,
		get,
		getById,
		create,
		update,
		delete: remove,
	}
}

export default useBasicCrud
