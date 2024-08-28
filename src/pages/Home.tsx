import { useEffect, useState, useMemo, type MouseEvent, type FC } from "react";
import { FaStarOfLife } from "react-icons/fa6";
import {
	DragDropContext,
	type DropResult,
	type DragStart,
} from "@hello-pangea/dnd";

import LinkGrid from "../components/LinkGrid";
import SpacesList from "../components/SpacesList";
import { useMyProfile, useLogout } from "../hooks/auth-api";
import { useSpaces, type SpaceResponse } from "../hooks/spaces-api";
import { usePastedValue } from "../hooks/keyboard";
import { useCreateLink, useLinks, type LinkResponse } from "../hooks/links-api";
import { usePrevious } from "../hooks/general";
import isValidUrl from "../utils/is-valid-url";

const UNSORTED_SPACE: SpaceResponse = {
	id: 0,
	name: "Unsorted",
};

export const Home: FC = () => {
	const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(0);
	const [isDraggingLink, setIsDraggingLink] = useState(false);
	const { data: myProfile } = useMyProfile();
	const { data: spaces } = useSpaces();
	const { data: links } = useLinks();
	const { mutate: createLink } = useCreateLink();
	const { pastedValue, clearPastedValue } = usePastedValue();
	const previousPastedValue = usePrevious(pastedValue);
	const logout = useLogout();

	const spacesWithUnsorted = useMemo((): Array<SpaceResponse> => {
		return [UNSORTED_SPACE, ...(spaces || [])];
	}, [spaces]);

	const selectedSpace = useMemo((): SpaceResponse | null => {
		if (!selectedSpaceId || !spaces?.length) {
			return null;
		}
		return spaces.find((space) => space?.id === selectedSpaceId) || null;
	}, [selectedSpaceId, spaces]);

	const linksForSpace = useMemo((): Array<LinkResponse> => {
		if (!links) {
			return [];
		}

		return links.filter((link: LinkResponse): boolean => {
			// special case for unsorted links
			if (selectedSpaceId === 0) {
				return !link.spaceId;
			}
			return link.spaceId === selectedSpaceId;
		});
	}, [links, selectedSpaceId]);

	const handleDragStart = (initial: DragStart) => {
		console.log("Drag started:", initial);

		if (initial.source.droppableId === "linkGrid") {
			setIsDraggingLink(true);
		}
	};

	const handleDragEnd = (result: DropResult) => {
		console.log("Drag ended:", result);

		// // Add a small delay before setting isDraggingLink to false
		setTimeout(() => {
			setIsDraggingLink(false);
		}, 0);

		// // Check if there's an active drag
		// if (!result.destination) {
		// 	return;
		// }

		// const { source, destination, draggableId } = result;

		// // Reordering links within the grid
		// if (
		// 	source.droppableId === "linkGrid" &&
		// 	destination.droppableId === "linkGrid"
		// ) {
		// 	// Implement reordering logic here
		// 	console.log(
		// 		`Reorder link ${draggableId} from index ${source.index} to ${destination.index}`
		// 	);
		// }

		// // Reordering spaces
		// if (
		// 	source.droppableId === "spacesList" &&
		// 	destination.droppableId === "spacesList"
		// ) {
		// 	// Implement space reordering logic here
		// 	console.log(
		// 		`Reorder space ${draggableId} from index ${source.index} to ${destination.index}`
		// 	);
		// }

		// // Moving a link to a space
		// if (
		// 	source.droppableId === "linkGrid" &&
		// 	destination.droppableId.startsWith("space-")
		// ) {
		// 	const spaceId = destination.droppableId.replace("space-", "");
		// 	console.log(`Move link ${draggableId} to space ${spaceId}`);
		// 	// Implement logic to update the link's space
		// }
	};

	useEffect(() => {
		if (pastedValue && !previousPastedValue) {
			if (isValidUrl(pastedValue)) {
				if (selectedSpaceId) {
					createLink({ url: pastedValue, spaceId: selectedSpaceId });
				} else {
					createLink({ url: pastedValue });
				}
			}
			clearPastedValue();
		}
	}, [
		pastedValue,
		createLink,
		clearPastedValue,
		previousPastedValue,
		selectedSpaceId,
	]);

	const handleLogout = (event: MouseEvent<HTMLAnchorElement>): void => {
		event.preventDefault();
		logout();
	};

	const { username } = myProfile || {};

	return (
		<DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
			<div className="flex w-full h-screen bg-gray-700">
				{/* left column area */}
				<div className="flex-1 basis-0 min-w-[200px] max-w-[200px] h-full pl-10 pt-12">
					<SpacesList
						spaces={spacesWithUnsorted}
						selectedSpaceId={selectedSpaceId}
						setSelectedSpaceId={setSelectedSpaceId}
						isDraggingLink={isDraggingLink}
					/>
				</div>

				<div className="flex items-center justify-center">
					<LinkGrid
						links={linksForSpace}
						selectedSpaceName={selectedSpace?.name || "Unsorted"}
						onLinkDrop={(linkId, spaceId) => {
							console.log(`Link ${linkId} dropped onto Space ${spaceId}`);
							// Implement the logic to update the link's space
						}}
					/>
				</div>

				{/* Right column */}
				<div className="flex-1 basis-0 min-w-[200px] max-w-[200px] h-full pr-10 pt-12">
					{/* You can add content here if needed */}
				</div>

				<div className="absolute bottom-0 w-screen bg-gray-600 flex flex-row justify-between items-center">
					<div className="items-center flex flex-row">
						<FaStarOfLife className="ml-2 text-theme-yellow animate-spin-very-slow" />
						<p className="ml-1 text-white font-medium">SuperLinks</p>
					</div>

					<div className="text-right flex flex-row pr-2">
						<p className="text-white pr-2">Logged in as {username} |</p>
						<a
							href="#"
							onClick={handleLogout}
							className="text-white hover:text-theme-yellow cursor-pointer"
						>
							<b>Logout</b>
						</a>
					</div>
				</div>
			</div>
		</DragDropContext>
	);
};
