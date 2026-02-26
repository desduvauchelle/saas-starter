/**
 * Toggle — form toggle/checkbox with label and color support.
 *
 * Wraps the DaisyUI toggle inside a cursor-pointer label.
 * Forwards ref for form library compatibility.
 */

import { forwardRef, useId } from "react"

export type ToggleColor =
	| "primary"
	| "secondary"
	| "accent"
	| "success"
	| "warning"
	| "error"
	| "info"

export interface ToggleProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
	/** Label text shown next to the toggle */
	label?: string
	/** Hint text shown below the toggle */
	description?: string
	/** Toggle color mapped to DaisyUI toggle-{color} */
	color?: ToggleColor
	/** Additional wrapper className */
	wrapperClassName?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
	function Toggle(
		{
			label,
			description,
			color,
			wrapperClassName = "",
			className = "",
			id: externalId,
			...rest
		},
		ref
	) {
		const generatedId = useId()
		const id = externalId ?? generatedId

		const toggleClasses = [
			"toggle",
			color && `toggle-${color}`,
			className,
		]
			.filter(Boolean)
			.join(" ")

		return (
			<div className={`form-control ${wrapperClassName}`}>
				<label className="label cursor-pointer justify-start gap-3" htmlFor={id}>
					<input
						ref={ref}
						id={id}
						type="checkbox"
						className={toggleClasses}
						{...rest}
					/>
					{label && <span className="label-text">{label}</span>}
				</label>
				{description && (
					<label className="label pt-0">
						<span className="label-text-alt text-base-content/50">
							{description}
						</span>
					</label>
				)}
			</div>
		)
	}
)
