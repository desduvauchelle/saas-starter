/* eslint-disable react/display-name */
import { InputHTMLAttributes, ReactNode, forwardRef, useMemo } from "react"
import { CustomTextarea, CustomTextareaProps } from "./CustomTextarea"




type InputPropsBase = {
	label?: ReactNode
	id: string
	error?: string
	description?: string
	placeholder?: string
	className?: string
	parentClassName?: string
	errors?: string[]
	buttonTopRight?: ReactNode
}



type InputProps = InputPropsBase & InputHTMLAttributes<HTMLInputElement>
export const MyInput = forwardRef<HTMLInputElement, InputProps>(({ label,
	className,
	parentClassName,
	id,
	error,
	description,
	...rest }, ref) => {
	const attributes: InputHTMLAttributes<HTMLInputElement> = {
		...rest,
		id: id,
		className: `input input-bordered w-full mt-1 ${className || ""}`
	}
	return <div className={parentClassName}>
		{label && <label htmlFor={id} className="label block font-bold p-0 m-0">{label}</label>}
		{description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
		<input ref={ref} {...attributes} />
		{error && <span className="text-red-500">{error}</span>}
	</div>
})


type InputFormProps = InputPropsBase & { type?: "text" | "password" | "email" | "number" }
export const MyInputForm = forwardRef<HTMLInputElement, InputFormProps>(({ label,
	className,
	parentClassName,
	id,
	error,
	description,
	errors,
	buttonTopRight,
	...rest }, ref) => {
	const attributes: InputHTMLAttributes<HTMLInputElement> = {
		...rest,
		id: id,
		className: `input input-bordered w-full ${label ? "mt-2" : ""} ${className || ""}`
	}

	if (errors) {
		attributes.className += " input-error"
	}
	return <div className={`w-full ${parentClassName || ""}`}>
		<div className="flex flex-row gap-4 items-center">
			<div className="grow">
				{label && <label htmlFor={id} className="label font-bold p-0 m-0">{label}</label>}
				{error && <span className="text-red-500">{error}</span>}
			</div>
			{buttonTopRight && <>{buttonTopRight}</>}
		</div>
		{description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
		<input ref={ref} {...attributes} />
	</div>
})

type InputFormRangeProps = InputPropsBase & { type?: "range", step: number, min: number, max: number }
export const MyInputFormRange = forwardRef<HTMLInputElement, InputFormRangeProps>(({ label,
	className,
	id,
	error,
	description,
	errors,
	max,
	min,
	step,
	buttonTopRight,
	...rest }, ref) => {
	const attributes: InputHTMLAttributes<HTMLInputElement> = {
		...rest,
		id: id,
		className: `range w-full ${label ? "mt-2" : ""} ${className || ""}`
	}

	if (errors) {
		attributes.className += " input-error"
	}
	const steps = useMemo(() => {
		const n = (max - min) / step
		// REturn an empty array of length n
		return Array.from({ length: n }, (_, i) => i)
	}, [min, max, step])
	return <div className="w-full">
		<div className="flex flex-row gap-4">
			<div className="flex-gr">
				{label && <label htmlFor={id} className="label font-bold p-0 m-0">{label}</label>}
				{error && <span className="text-red-500">{error}</span>}
			</div>
			{buttonTopRight && <>{buttonTopRight}</>}
		</div>
		{description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
		<input
			id={id}
			type="range" min={0} max="100" value="25" className="range" step="25" />

		<input type="range" min={min} max={max} ref={ref} {...attributes} />
		<div className="w-full flex justify-between text-xs px-2">
			{steps.map((_, i) => <span key={i}>|</span>)}
		</div>
	</div>
})

// export const Textarea: FC<InputPropsBase & InputHTMLAttributes<HTMLTextAreaElement>> = ({
// 	label,
// 	className,
// 	id,
// 	error,
// 	description,
// 	...rest
// }) => {
// 	const attributes: InputHTMLAttributes<HTMLTextAreaElement> = {
// 		...rest,
// 		id: id,
// 		className: className || "input input-bordered w-full"
// 	}
// 	return <div>
// 		{label && <label htmlFor={id} className="label block font-bold">{label}</label>}
// 		<textarea {...attributes} />
// 		{error && <span className="text-red-500">{error}</span>}

// 	</div>
// }



type TextareaProps = InputPropsBase & CustomTextareaProps
export const MyTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
	label,
	className,
	parentClassName,
	id,
	error,
	description,
	buttonTopRight,
	...rest }, ref) => {
	const attributes: CustomTextareaProps = {
		...rest,
		id: id || "",
		className: `textarea textarea-bordered w-full mt-2 ${className || ""}`
	}


	return <div className={`w-full ${parentClassName || ""}`}>
		{(buttonTopRight || label || description) && <div className="flex flex-row gap-4 items-center">
			<div className="grow">
				{label && <label htmlFor={id} className={`label block font-bold m-0 p-0 grow`}>{label}</label>}
				{description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
			</div>
			{buttonTopRight && <>{buttonTopRight}</>}
		</div>}

		<CustomTextarea ref={ref} {...attributes} />
		{error && <span className="text-red-500">{error}</span>}
	</div>
})


type TextareaFormProps = InputPropsBase & CustomTextareaProps
export const MyTextareaForm = forwardRef<HTMLTextAreaElement, TextareaFormProps>(({ label,
	className,
	id,
	error,
	errors,
	description,
	...rest }, ref) => {
	const attributes: CustomTextareaProps = {
		...rest,
		id: id,
		className: `textarea textarea-bordered w-full mt-2 ${className}`
	}

	if (errors) {
		attributes.className += " input-error"
	}
	return <div className="w-full">
		<div className="flex flex-row gap-4">
			{label && <label htmlFor={id} className="label font-bold p-0 m-0">{label}</label>}
			{error && <span className="text-red-500">{error}</span>}
		</div>
		{description && <p className="text-sm text-gray-500 pt-1">{description}</p>}

		<CustomTextarea ref={ref} {...attributes} />
		{error && <span className="text-red-500">{error}</span>}
	</div>
})




type SelectFormProps = InputPropsBase & { options: { id: string, label: string, disabled?: boolean }[] }
export const MySelectForm = forwardRef<HTMLSelectElement, SelectFormProps>(({ label,
	className,
	id,
	options,
	error,
	errors,
	description,
	...rest }, ref) => {
	const attributes: InputHTMLAttributes<HTMLSelectElement> = {
		...rest,
		id: id,
		className: `select select-bordered mt-1 w-full ${className || ""}`
	}
	if (errors) {
		attributes.className += " select-error"
	}
	return <div className="w-full">
		<div className="flex flex-row gap-4">
			{label && <label htmlFor={id} className="label font-bold p-0 m-0">{label}</label>}
			{error && <span className="text-red-500">{error}</span>}
		</div>
		{description && <p className="text-sm text-gray-500">{description}</p>}
		<select ref={ref} {...attributes}>
			{options.map(({ id, label, disabled }) => <option key={id} value={id} disabled={disabled}>{label}</option>)}
		</select>
		{error && <span className="text-red-500">{error}</span>}
	</div>
})

type SelectProps = InputPropsBase & { options: { id: string | number, label: string, disabled?: boolean }[] } & InputHTMLAttributes<HTMLSelectElement>
export const MySelect = forwardRef<HTMLSelectElement, SelectProps>(({ label,
	className,
	id,
	options,
	error,
	description,
	buttonTopRight,
	...rest }, ref) => {
	const attributes: InputHTMLAttributes<HTMLSelectElement> = {
		...rest,
		id: id,
		className: `select select-bordered ${label ? "mt-1" : ""} w-full ${className || ""}`
	}
	return <div className="w-full">
		{(buttonTopRight || label || description) && <div className="flex flex-row gap-4 items-center">
			<div className="grow">
				{label && <label htmlFor={id} className={`label block font-bold m-0 p-0 grow`}>{label}</label>}
				{description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
			</div>
			{buttonTopRight && <div>{buttonTopRight}</div>}
		</div>}

		<select ref={ref} {...attributes}>
			{options.map(({ id, label, disabled }) => <option key={id} value={id} disabled={disabled === true}>{label}</option>)}
		</select>
		{error && <span className="text-red-500">{error}</span>}
	</div>
})



type CheckboxProps = InputPropsBase & InputHTMLAttributes<HTMLInputElement>
export const MyCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label,
	className,
	id,
	error,
	description,
	...rest }, ref) => {
	const attributes: InputHTMLAttributes<HTMLInputElement> = {
		...rest,
		id: id,
		className: className || "checkbox"
	}
	return <div>
		{label && <label htmlFor={id} className=" flex flex-row items-center">
			<input type="checkbox" ref={ref} {...attributes} />
			<span className="label font-bold grow ml-2">{label}</span>
		</label>}

		{description && <p className="text-sm text-gray-500">{description}</p>}
		{error && <span className="text-red-500">{error}</span>}
	</div>
})


type ToggleProps = InputPropsBase & InputHTMLAttributes<HTMLInputElement>
export const MyToggle = forwardRef<HTMLInputElement, ToggleProps>(({ label,
	className,
	id,
	// error,
	description,
	checked,
	...rest }, ref) => {
	const attributes: InputHTMLAttributes<HTMLInputElement> = {
		...rest,
		id: id,
		className: className || `toggle ${(checked || rest.value) ? "toggle-success" : ""} shrink-0 mr-2`
	}
	return <div>
		<div className="form-control">
			<label className="label cursor-pointer">
				<input type="checkbox" {...attributes} checked={checked} />
				{label && <span className="label-text grow font-bold">{label}</span>}
			</label>
		</div>
		{description && <p className="text-sm text-gray-500">{description}</p>}
	</div>
})

type ToggleFormProps = InputPropsBase & InputHTMLAttributes<HTMLInputElement>
export const MyToggleForm = forwardRef<HTMLInputElement, ToggleFormProps>(({
	label,
	className,
	id,
	error,
	errors,
	description,
	...rest }, ref) => {

	const attributes: InputHTMLAttributes<HTMLInputElement> = {
		...rest,
		id: id,
		className: `toggle ${rest.checked ? "toggle-success" : ""} shrink-0 mr-2 ${className || ""}`
	}
	if (errors) {
		attributes.className += " input-error"

	}

	return <div>
		<div className="form-control">
			<label className="label cursor-pointer">
				<input type="checkbox" {...attributes} ref={ref} />
				{label && <span className="label-text grow font-bold">{label}</span>}
			</label>
		</div>
		{error && <span className="text-red-500">{error}</span>}
		{description && <p className="text-sm text-gray-500">{description}</p>}
	</div>
})



type CodeEditorProps = InputPropsBase & InputHTMLAttributes<HTMLInputElement>
export const MyCodeEditor = forwardRef<HTMLInputElement, CodeEditorProps>(({ label,
	className,
	id,
	error,
	description,
	...rest }, ref) => {
	const attributes: InputHTMLAttributes<HTMLInputElement> = {
		...rest,
		id: id,
		className: `input input-bordered w-full mt-1 ${className || ""}`
	}
	return <div>
		{label && <label htmlFor={id} className="label block font-bold p-0 m-0">{label}</label>}
		{description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
		<input ref={ref} {...attributes} />
		{error && <span className="text-red-500">{error}</span>}
	</div>
})
