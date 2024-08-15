import { useState, useRef, useEffect, type FC } from "react";
import { FiPlus } from "react-icons/fi";

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
		<div ref={containerRef}>
			{isExpanded ? (
				<div className="flex items-center space-x-2">
					<input
						type="text"
						value={inputValue}
						onChange={(event) => {
							setInputValue(event.target.value);
						}}
						className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter text..."
						autoFocus
					/>
					<button
						onClick={handleSubmit}
						className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
					>
						Submit
					</button>
				</div>
			) : (
				<button
					onClick={() => {
						setIsExpanded(true);
					}}
					className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
				>
					<FiPlus size={20} />
				</button>
			)}
		</div>
	);
};

export default ExpandableInput;