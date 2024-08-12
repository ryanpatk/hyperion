import type React from "react";

interface ButtonProps {
	isLoading: boolean;
	onClick: () => void;
	children: React.ReactNode;
	className?: string;
	type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
	isLoading,
	onClick,
	children,
	className = "",
	type = "button",
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={isLoading}
			className={`
        relative w-full py-2 text-white bg-gray-400 rounded-md
        hover:bg-theme-orange focus:outline-none focus:ring-2 focus:ring-theme-orange
        focus:bg-theme-orange focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
		>
			{isLoading && (
				<svg
					className="absolute w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			)}
			<span className={isLoading ? "invisible" : "visible"}>{children}</span>
		</button>
	);
};

export default Button;
