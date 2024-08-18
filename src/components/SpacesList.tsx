import type { FC } from "react";

import ExpandableInput from "./ExpandableInput";
import { useCreateSpace, type SpaceResponse } from "../hooks/spaces-api";

interface SpacesListProps {
	spaces: Array<SpaceResponse> | undefined;
	selectedSpaceId: number | null;
	setSelectedSpaceId: (spaceId: number | null) => void;
}

const SpacesList: FC<SpacesListProps> = ({
	spaces = [],
	selectedSpaceId,
	setSelectedSpaceId,
}) => {
	const { mutateAsync: createSpace } = useCreateSpace();

	return (
		<div className="flex flex-col h-full">
			<ul className="space-y-1">
				{spaces.map((space) => (
					<li key={space.id}>
						<button
							className={`w-full text-left px-2 py-1 rounded-sm transition-colors font-custom-1 ${
								// note the selected style here never gets used
								selectedSpaceId === space.id
									? "bg-gray-600 text-white"
									: "text-gray-500 hover:bg-gray-100"
							}`}
							onClick={() => {
								setSelectedSpaceId(space.id);
							}}
						>
							{space.name}
						</button>
					</li>
				))}
				<div>
					<ExpandableInput
						onSubmit={(value: string): void => {
							void createSpace({ name: value });
						}}
					/>
				</div>
			</ul>
		</div>
	);
};

export default SpacesList;
