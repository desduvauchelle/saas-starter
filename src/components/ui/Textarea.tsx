/**
 * Textarea — form textarea with label, description, and error support.
 *
 * Wraps the DaisyUI form-control + textarea pattern.
 * Forwards ref for form library compatibility.
 */

import { forwardRef, useId } from "react"

export type TextareaSize = "xs" | "sm" | "md" | "lg"

export interface TextareaProps
	extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
	/** Label text shown above the textarea */
	label?: string
	/** Hint text shown below the textarea */
	description?: string
	/** Error message — triggers textarea-error styling */
	error?: string
	/** Size mapped to DaisyUI textarea-{size} */
	size?: TextareaSize
	/** Additional wrapper className */
	wrapperClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea(
		{
			label,
			description,
			error,
			size,
			wrapperClassName = "",
			className = "",
			id: externalId,
			...rest
		},
		ref
	) {
		const generatedId = useId()
		const id = externalId ?? generatedId

		const textareaClasses = [
			"textarea textarea-bordered w-full",
			size && `textarea-${size}`,
			error && "textarea-error",
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
				<textarea ref={ref} id={id} className={textareaClasses} {...rest} />
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
