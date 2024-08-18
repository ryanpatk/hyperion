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
		<div className="flex flex-col h-full">
			<ul className="space-y-1">
				{selectedSpace ? (
					<li key={selectedSpace.id}>
						<button
							className="w-full text-left px-4 py-1 rounded-sm transition-colors bg-pink-400 text-white font-custom-1"
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
								className={`w-full text-left px-4 py-1 rounded-sm transition-colors font-custom-1 ${
									// note the selected style here never gets used
									selectedSpaceId === space.id
										? "bg-pink-400 text-white"
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
				<div className="pl-4 absolute bottom-4">
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
