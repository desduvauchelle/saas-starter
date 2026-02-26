/**
 * Select — form select with label, description, error, and options support.
 *
 * Wraps the DaisyUI form-control + select pattern.
 * Forwards ref for form library compatibility.
 */

import { forwardRef, useId } from "react"

export type SelectSize = "xs" | "sm" | "md" | "lg"

export interface SelectOption {
	label: string
	value: string
}

export interface SelectProps
	extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
	/** Label text shown above the select */
	label?: string
	/** Hint text shown below the select */
	description?: string
	/** Error message — triggers select-error styling */
	error?: string
	/** Size mapped to DaisyUI select-{size} */
	size?: SelectSize
	/** Select options */
	options: SelectOption[]
	/** Placeholder text rendered as a disabled first option */
	placeholder?: string
	/** Additional wrapper className */
	wrapperClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	function Select(
		{
			label,
			description,
			error,
			size,
			options,
			placeholder,
			wrapperClassName = "",
			className = "",
			id: externalId,
			...rest
		},
		ref
	) {
		const generatedId = useId()
		const id = externalId ?? generatedId

		const selectClasses = [
			"select select-bordered w-full",
			size && `select-${size}`,
			error && "select-error",
			className,
		]
			.filter(Boolean)
			.join(" ")

		return (
			<div className={`form-control ${wrapperClassName}`}>
				{label && (
					<label className="label" htmlFor={id}>
						<span className="label-text">{label}</span>
					</label>
				)}
				<select ref={ref} id={id} className={selectClasses} {...rest}>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
				{description && !error && (
					<label className="label">
						<span className="label-text-alt text-base-content/50">
							{description}
						</span>
					</label>
				)}
				{error && (
					<label className="label">
						<span className="label-text-alt text-error">{error}</span>
					</label>
				)}
			</div>
		)
	}
)
