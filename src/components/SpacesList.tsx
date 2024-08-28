import type { FC } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";

import ExpandableInput from "./ExpandableInput";
import { useCreateSpace, type SpaceResponse } from "../hooks/spaces-api";

interface SpaceListItemProps {
	space: SpaceResponse;
	index: number;
	selectedSpaceId: number | null;
	setSelectedSpaceId: (spaceId: number | null) => void;
	isDraggingLink: boolean;
}

interface SpacesListProps {
	spaces: Array<SpaceResponse> | undefined;
	selectedSpaceId: number | null;
	setSelectedSpaceId: (spaceId: number | null) => void;
	isDraggingLink: boolean;
}

const SpaceListItem: FC<SpaceListItemProps> = ({
	space,
	index,
	selectedSpaceId,
	setSelectedSpaceId,
	isDraggingLink,
}) => {
	const content = (
		<Droppable droppableId={`space-${space.id}`}>
			{(dropProvided, dropSnapshot) => (
				<div
					ref={dropProvided.innerRef}
					{...dropProvided.droppableProps}
					className={`w-full px-2 py-1 rounded-sm transition-colors font-custom-1 ${
						selectedSpaceId === space.id
							? "bg-gray-600 text-white"
							: "text-gray-500 hover:bg-gray-100"
					} ${dropSnapshot.isDraggingOver ? "bg-blue-200" : ""}`}
				>
					<button
						className="w-full text-left"
						onClick={() => {
							setSelectedSpaceId(space.id);
						}}
					>
						{space.name}
					</button>
					{dropProvided.placeholder}
				</div>
			)}
		</Droppable>
	);

	// if (isDraggingLink) {
	// 	return <li>{content}</li>;
	// }

	return content;

	// return (
	// 	<Draggable draggableId={`space-${space.id}`} index={index}>
	// 		{(dragProvided, dragSnapshot) => (
	// 	<li
	// 		ref={dragProvided.innerRef}
	// 		{...dragProvided.draggableProps}
	// 		{...dragProvided.dragHandleProps}
	// 		className={dragSnapshot.isDragging ? "opacity-50" : ""}
	// 	>
	// 		{content}
	// 	</li>
	// 		)}
	// 	</Draggable>
	// );
};

const SpacesList: FC<SpacesListProps> = ({
	spaces = [],
	selectedSpaceId,
	setSelectedSpaceId,
	isDraggingLink,
}) => {
	const { mutateAsync: createSpace } = useCreateSpace();

	return (
		<Droppable droppableId="spacesList" direction="vertical">
			{(provided) => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					<ul className="space-y-1">
						{spaces.map((space, index) => (
							<SpaceListItem
								key={space.id}
								space={space}
								index={index}
								selectedSpaceId={selectedSpaceId}
								setSelectedSpaceId={setSelectedSpaceId}
								isDraggingLink={isDraggingLink}
							/>
						))}
						{provided.placeholder}
					</ul>
					<div>
						<ExpandableInput
							onSubmit={(value: string): void => {
								void createSpace({ name: value });
							}}
						/>
					</div>
				</div>
			)}
		</Droppable>
	);
};

export default SpacesList;
