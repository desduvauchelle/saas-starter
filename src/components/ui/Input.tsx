/**
 * Input — form text input with label, description, error, and icon support.
 *
 * Wraps the DaisyUI form-control + input pattern in a single component.
 * Forwards ref for form library compatibility.
 */

import { forwardRef, useId } from "react"

export type InputSize = "xs" | "sm" | "md" | "lg"

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	/** Label text shown above the input */
	label?: string
	/** Hint text shown below the input */
	description?: string
	/** Error message — triggers input-error styling */
	error?: string
	/** Size mapped to DaisyUI input-{size} */
	size?: InputSize
	/** FontAwesome class for a left-side icon (e.g. "fa-solid fa-magnifying-glass") */
	leftIcon?: string
	/** Additional wrapper className */
	wrapperClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	function Input(
		{
			label,
			description,
			error,
			size,
			leftIcon,
			wrapperClassName = "",
			className = "",
			id: externalId,
			...rest
		},
		ref
	) {
		const generatedId = useId()
		const id = externalId ?? generatedId

		const inputClasses = [
			"input input-bordered w-full",
			size && `input-${size}`,
			error && "input-error",
			leftIcon && "pl-8",
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
				{leftIcon ? (
					<div className="relative">
						<input ref={ref} id={id} className={inputClasses} {...rest} />
						<i
							className={`${leftIcon} absolute left-2.5 top-1/2 -translate-y-1/2 text-base-content/40 text-xs`}
						/>
					</div>
				) : (
					<input ref={ref} id={id} className={inputClasses} {...rest} />
				)}
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
