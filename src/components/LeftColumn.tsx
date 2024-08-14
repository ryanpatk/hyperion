import { useState, type FC } from "react";

import ExpandableInput from "./ExpandableInput";
import type { SpaceResponse } from "../hooks/spaces";

interface LeftColumnProps {
	spaces: Array<SpaceResponse> | undefined;
}

const LeftColumn: FC<LeftColumnProps> = ({ spaces = [] }) => {
	const [selectedSpace, setSelectedSpace] = useState<SpaceResponse | null>(
		null
	);

	return (
		<div className="flex flex-col h-full py-4 pl-4">
			<h2 className="text-xl font-bold mb-4 text-gray-500">SuperLinks</h2>
			<ul className="space-y-1">
				{selectedSpace ? (
					<li key={selectedSpace.id}>
						<button
							className="w-full text-left px-4 py-2 rounded-sm transition-colors bg-theme-orange text-white"
							onClick={() => {
								setSelectedSpace(null);
							}}
						>
							{selectedSpace.name}
						</button>
					</li>
				) : null}
				{spaces
					.filter((space) => {
						return selectedSpace ? selectedSpace.id !== space.id : true;
					})
					.map((space) => (
						<li key={space.id}>
							<button
								className={`w-full text-left px-4 py-2 rounded-sm transition-colors ${
									// note the selected style here never gets used
									selectedSpace?.id === space.id
										? "bg-theme-orange text-white"
										: "text-gray-500 hover:bg-gray-100"
								}`}
								onClick={() => {
									setSelectedSpace(space);
								}}
							>
								{space.name}
							</button>
						</li>
					))}
				<ExpandableInput onSubmit={() => {}} />
			</ul>
		</div>
	);
};

export default LeftColumn;
