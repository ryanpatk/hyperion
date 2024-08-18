import { useState, useRef, useEffect, type FC } from "react";

interface ExpandableInputProps {
	onSubmit: (value: string) => void;
}

const ExpandableInput: FC<ExpandableInputProps> = ({ onSubmit }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent): void => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsExpanded(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSubmit = (): void => {
		if (inputValue.trim()) {
			onSubmit(inputValue);
			setInputValue("");
			setIsExpanded(false);
		}
	};

	return (
		<div
			ref={containerRef}
			className="py-1 hover:text-theme-yellow cursor-pointer text-gray-500"
			onClick={() => {
				setIsExpanded(true);
			}}
		>
			{isExpanded ? (
				<div className="flex items-center space-x-2">
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							value={inputValue}
							onChange={(event) => {
								setInputValue(event.target.value);
							}}
							className="ml-0.5 border border-gray-300 px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Enter text..."
							autoFocus
						/>
						{/* <button
							onClick={handleSubmit}
							className="bg-blue-400 text-white px-4 py-1 rounded-sm hover:bg-blue-600 transition-colors"
						>
							Submit
						</button> */}
					</form>
				</div>
			) : (
				<b
					onClick={() => {
						setIsExpanded(true);
					}}
					className="pl-2"
				>
					ADD NEW
				</b>
			)}
		</div>
	);
};

export default ExpandableInput;
