import { useMemo, type FC } from "react";

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

	const selectedSpace = useMemo((): SpaceResponse | null => {
		if (!selectedSpaceId || !spaces?.length) {
			return null;
		}
		return spaces.find((space) => space?.id === selectedSpaceId) || null;
	}, [selectedSpaceId, spaces]);

	return (
		<div className="flex flex-col h-full py-4 pl-4">
			<h2 className="text-xl font-bold mb-4 text-gray-500">SuperLinks</h2>
			<ul className="space-y-1">
				{selectedSpace ? (
					<li key={selectedSpace.id}>
						<button
							className="w-full text-left px-4 py-2 rounded-sm transition-colors bg-theme-orange text-white"
							onClick={() => {
								setSelectedSpaceId(null);
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
									selectedSpaceId === space.id
										? "bg-theme-orange text-white"
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
				<ExpandableInput
					onSubmit={(value: string): void => {
						void createSpace({ name: value });
					}}
				/>
			</ul>
		</div>
	);
};

export default SpacesList;
