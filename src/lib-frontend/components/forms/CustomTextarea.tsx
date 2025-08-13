import { ChangeEvent, TextareaHTMLAttributes, forwardRef, useCallback, useEffect, useRef } from 'react'

export interface CustomTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	startingRows?: number
	maxRows?: number | undefined
	isDisabled?: boolean
	isLoading?: boolean
	onSubmit?: () => void
}

export const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(({
	startingRows = 1,
	maxRows,
	isDisabled = false,
	isLoading = false,
	className = "",
	onSubmit,
	value,
	...props
}, ref) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)

	const adjustHeight = useCallback(() => {
		const textarea = textareaRef.current
		if (!textarea) return

		const lineHeight = 24
		const minHeight = lineHeight * startingRows

		// Get the scroll height
		const scrollHeight = textarea.scrollHeight

		// Calculate the new height
		const newHeight = maxRows
			? Math.min(Math.max(minHeight, scrollHeight), lineHeight * maxRows)
			: Math.max(minHeight, scrollHeight)

		// Apply the new height
		textarea.style.height = `${newHeight}px`
		textarea.style.overflowY = maxRows && scrollHeight > lineHeight * maxRows ? 'auto' : 'hidden'

	}, [maxRows, startingRows])

	// Remove resize observer as it's not needed
	useEffect(() => {
		adjustHeight()
	}, [value, adjustHeight])

	useEffect(() => {
		if (ref && typeof ref === 'function') {
			ref(textareaRef.current)
		} else if (ref) {
			ref.current = textareaRef.current
		}
	}, [ref])

	const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (props.onChange) {
			props.onChange(e)
		}
		adjustHeight()
	}

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (onSubmit && e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			onSubmit()
		}
		if (props.onKeyDown) {
			props.onKeyDown(e)
		}
	}

	return <textarea
		ref={textareaRef}
		value={value}
		onChange={handleTextareaChange}
		onKeyDown={onKeyDown}
		disabled={isDisabled || isLoading}
		className={`text-base-content w-full rounded-lg resize-none ${className}`}
		rows={startingRows}
		style={{
			height: `${24 * startingRows}px`,
			maxHeight: maxRows ? `${24 * maxRows}px` : 'none',
		}}
		{...props}
	/>
})

CustomTextarea.displayName = 'CustomTextarea'
