/**
 * ResourceFilters — reusable search + filter bar for admin lists.
 *
 * Renders a search input and configurable select filters.
 * Debounces search input to avoid excessive re-renders.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface FilterOption {
	label: string
	value: string
}

export interface FilterConfig {
	key: string
	label: string
	options: FilterOption[]
	/** Current value */
	value: string
}

interface ResourceFiltersProps {
	/** Search input value */
	search: string
	/** Called when search value changes (debounced) */
	onSearchChange: (value: string) => void
	/** Select filters */
	filters?: FilterConfig[]
	/** Called when a filter value changes */
	onFilterChange?: (key: string, value: string) => void
	/** Search placeholder */
	searchPlaceholder?: string
}

export function ResourceFilters({
	search,
	onSearchChange,
	filters,
	onFilterChange,
	searchPlaceholder = "Search...",
}: ResourceFiltersProps) {
	const [localSearch, setLocalSearch] = useState(search)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const debouncedSearch = useCallback(
		(value: string) => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
			debounceRef.current = setTimeout(() => {
				onSearchChange(value)
			}, 300)
		},
		[onSearchChange]
	)

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [])

	const handleSearchChange = (value: string) => {
		setLocalSearch(value)
		debouncedSearch(value)
	}

	return (
		<div className="flex flex-wrap gap-3 items-end mb-4">
			{/* Search */}
			<div className="form-control flex-1 min-w-[200px]">
				<label className="label py-1">
					<span className="label-text text-xs">Search</span>
				</label>
				<div className="relative">
					<input
						type="text"
						placeholder={searchPlaceholder}
						className="input input-bordered input-sm w-full pl-8"
						value={localSearch}
						onChange={(e) => handleSearchChange(e.target.value)}
					/>
					<i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-base-content/40 text-xs" />
				</div>
			</div>

			{/* Filters */}
			{filters?.map((filter) => (
				<div key={filter.key} className="form-control min-w-[140px]">
					<label className="label py-1">
						<span className="label-text text-xs">{filter.label}</span>
					</label>
					<select
						className="select select-bordered select-sm"
						value={filter.value}
						onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
					>
						<option value="">All</option>
						{filter.options.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</div>
			))}
		</div>
	)
}
