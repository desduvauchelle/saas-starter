/**
 * ResourceTable — reusable data table for admin CRUD pages.
 *
 * Renders a sortable, configurable table with DaisyUI styling.
 * Supports custom column renderers, row actions, and loading state.
 *
 * @template T - The row data type
 */

"use client"

import type { ReactNode } from "react"

export interface Column<T> {
	/** Unique key matching a property on T, or a custom key */
	key: string
	/** Display header label */
	label: string
	/** If true, column is sortable */
	sortable?: boolean
	/** Custom render function */
	render?: (row: T) => ReactNode
	/** CSS class for the column */
	className?: string
}

interface ResourceTableProps<T> {
	columns: Column<T>[]
	data: T[]
	/** Current sort column */
	sortBy?: string
	/** Current sort order */
	sortOrder?: "asc" | "desc"
	/** Called when a sortable column header is clicked */
	onSort?: (key: string) => void
	/** Render action buttons for each row */
	actions?: (row: T) => ReactNode
	/** Loading state */
	loading?: boolean
	/** Key extractor for each row */
	getRowKey: (row: T) => string
	/** Empty state message */
	emptyMessage?: string
}

export function ResourceTable<T>({
	columns,
	data,
	sortBy,
	sortOrder,
	onSort,
	actions,
	loading,
	getRowKey,
	emptyMessage = "No records found.",
}: ResourceTableProps<T>) {
	const getSortIcon = (key: string) => {
		if (sortBy !== key) return "fa-sort"
		return sortOrder === "asc" ? "fa-sort-up" : "fa-sort-down"
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<span className="loading loading-spinner loading-lg" />
			</div>
		)
	}

	if (data.length === 0) {
		return (
			<div className="text-center py-12 text-base-content/50">
				<i className="fa-solid fa-inbox text-4xl mb-3 block" />
				<p>{emptyMessage}</p>
			</div>
		)
	}

	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						{columns.map((col) => (
							<th
								key={col.key}
								className={`${col.className ?? ""} ${col.sortable ? "cursor-pointer select-none hover:bg-base-200" : ""
									}`}
								onClick={() => col.sortable && onSort?.(col.key)}
							>
								<span className="flex items-center gap-1">
									{col.label}
									{col.sortable && (
										<i className={`fa-solid ${getSortIcon(col.key)} text-xs`} />
									)}
								</span>
							</th>
						))}
						{actions && <th className="w-20">Actions</th>}
					</tr>
				</thead>
				<tbody>
					{data.map((row) => (
						<tr key={getRowKey(row)}>
							{columns.map((col) => (
								<td key={col.key} className={col.className}>
									{col.render
										? col.render(row)
										: String((row as Record<string, unknown>)[col.key] ?? "")}
								</td>
							))}
							{actions && <td>{actions(row)}</td>}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
