import type React from "react";

interface NewComponentProps {
	// Define your props here
	title: string;
	isActive: boolean;
}

const NewComponent: React.FC<NewComponentProps> = ({ title, isActive }) => {
	return (
		<div className={`new-component ${isActive ? "active" : ""}`}>
			<h1>{title}</h1>
			{/* Add your component content here */}
		</div>
	);
};

export default NewComponent;
