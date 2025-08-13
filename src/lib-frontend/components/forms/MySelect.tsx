import * as React from "react"
import { FC, useState } from "react"
import { faCaretDown, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "../Modal"



const MySpecialSelect: FC<{
	options: { value: string; label: string }[]
	value?: string
	onChange: (value: string) => unknown
	placeholder: string
}> = ({ options, value, onChange, placeholder }) => {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState("")

	return <div className="w-full">
		<button
			onClick={() => setOpen(!open)}
			className="w-full flex flex-row items-center gap-2 bg-base-200/40 px-4 py-3 rounded-lg text-left">
			<span className="shrink-0 font-bold">Script:</span>
			<span className="grow line-clamp-1">
				{value
					? options.find((o) => o.value === value)?.label
					: placeholder}
			</span>
			<FontAwesomeIcon icon={faCaretDown} />
		</button>
		<Modal
			isOpen={open}
			removePadding
			handleClose={() => setOpen(false)}>
			<form
				className="rounded-b-none border-b-2 w-full relative"
				onSubmit={(e) => {
					e.preventDefault()
				}}>
				<input
					type="search"
					className="w-full p-4 pl-6 pr-0 rounded-t-lg "
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search..." />
				<button
					aria-label="search"
					type="button"
					className="px-4 absolute top-0 h-full right-0">
					<FontAwesomeIcon icon={faSearch} />
				</button>
			</form>
			<ul className="rounded-b-lg overflow-hidden">
				{options
					.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
					.map((o) => {
						return <li
							key={o.value}
							className="flex flex-row">
							<button
								className="py-4 px-6 hover:bg-base-200 w-full text-left"
								onClick={() => {
									onChange(o.value)
									setOpen(false)
								}}>
								{o.label}
							</button>
						</li>
					})}

			</ul>
		</Modal>

	</div>


}

export default MySpecialSelect
