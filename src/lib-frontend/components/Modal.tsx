import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
	isOpen: boolean
	handleClose: () => void
	children: ReactNode
	animationDuration?: number
	removePadding?: boolean
	boxClassName?: string
}

const Modal: FC<ModalProps> = ({
	isOpen,
	handleClose, children, animationDuration = 300,
	removePadding = false,
	boxClassName = ""
}) => {
	const [showModal, setShowModal] = useState(isOpen)
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (isOpen) {
			setShowModal(true)
			const handleEscape = (event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					handleClose()
				}
			}
			if (isClient) {
				document.addEventListener('keydown', handleEscape)
			}
			return () => {
				if (isClient) {
					document.removeEventListener('keydown', handleEscape)
				}
			}
		}

		const timer = setTimeout(() => setShowModal(false), animationDuration)
		return () => clearTimeout(timer)

	}, [isOpen, animationDuration, handleClose, isClient])

	if (!isClient) {
		return null
	}

	return ReactDOM.createPortal(
		<dialog
			open={isOpen}
			aria-modal="true"
			aria-hidden={!isOpen}
			className={`fixed inset-0 h-screen w-full flex items-center justify-center bg-base-300/30 transition-all duration-300 z-1000 ${isOpen ? 'opacity-100 backdrop-blur-xs' : 'opacity-0 pointer-events-none'}`}
			onClick={handleClose}
			onMouseUp={(e) => {
				e.stopPropagation()
			}}>
			<div
				role="document"
				className={`bg-base-100 ${removePadding ? "" : "p-6"} max-h-[90vh] overflow-y-auto rounded-lg shadow-lg transition-transform duration-300 transform min-w-96 ${isOpen ? 'scale-100' : 'scale-0 translate-y-full'} relative mx-2 md:mx-4 ${boxClassName}`}
				onClick={(e) => e.stopPropagation()}>
				<button
					type='button'
					aria-label="Close"
					onClick={handleClose}
					className="absolute -top-8 right-2 text-white font-extrabold">
					<FontAwesomeIcon icon={faTimes} className='mr-1' /> Close
				</button>
				{children}
			</div>
		</dialog>,
		document.body
	)
}

export default Modal
