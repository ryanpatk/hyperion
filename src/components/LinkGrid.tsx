import { useState, useCallback, useEffect, type FC } from "react";

// import {
// 	DragDropContext,
// 	Droppable,
// 	Draggable,
// 	type DropResult,
// 	// type DraggableLocation,
// 	// type DraggableStateSnapshot,
// 	// type DroppableStateSnapshot,
// 	// type DraggableProvided,
// 	// type DroppableProvided,
// } from "@hello-pangea/dnd";

import { useLinkMetadata } from "../hooks/links-api";
import openLink from "../utils/open-link";

interface Link {
	id: string;
	title: string;
	url: string;
	imageUrl: string;
}

interface LinkItemProps {
	link: Link;
	isSelected: boolean;
	ctrlKeyPressed: boolean;
}

interface LinkGridProps {
	links: Array<Link>;
	selectedSpaceName: string | null;
}

interface GridSize {
	rows: number;
	cols: number;
}

const DIRECTIONAL_KEYS = new Set([
	"ArrowRight",
	"ArrowLeft",
	"ArrowDown",
	"ArrowUp",
]);
const NUM_COLUMNS = 6;

const LinkItem: FC<LinkItemProps> = ({
	link,
	isSelected = false,
	ctrlKeyPressed = false,
}) => {
	const { data: linkMetadata } = useLinkMetadata(link?.url);

	return (
		<div
			key={link?.id}
			className={`flex flex-col items-center bg-gray-500 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-100
			${isSelected ? "ring-4 ring-theme-yellow z-10" : null}`}
		>
			<div className="h-full flex items-center justify-center overflow-hidden">
				<img
					src={linkMetadata?.images[0] || linkMetadata?.favicons[0]}
					alt={linkMetadata?.title}
					className="max-w-full max-h-full object-contain"
					onError={(event) => {
						const target = event.target as HTMLImageElement;
						target.src = "https://via.placeholder.com/150?text=No+Image";
					}}
				/>
			</div>
			<p
				className={`text-xs text-align-left text-black truncate font-custom-1 w-full px-1 hover:bg-theme-yellow hover:cursor-pointer ${isSelected && ctrlKeyPressed ? "bg-theme-yellow" : "bg-theme-green"}`}
				onClick={() => {
					if (link?.url) {
						openLink(link?.url);
					}
				}}
			>
				{linkMetadata?.title}
			</p>
		</div>
	);
};

const LinkGrid: FC<LinkGridProps> = ({ links = [], selectedSpaceName }) => {
	const [selectedTiles, setSelectedTiles] = useState<Array<number>>([0]);
	const [gridSize, setGridSize] = useState<GridSize>({ rows: 0, cols: 0 });
	const [ctrlKeyPressed, setCtrlKeyPressed] = useState<boolean>(false);

	useEffect(() => {
		const handleResize = (): void => {
			const aspectRatio = 1.5;

			const vw = Math.max(
				document.documentElement.clientWidth || 0,
				window.innerWidth || 0
			);
			const vh = Math.max(
				document.documentElement.clientHeight || 0,
				window.innerHeight || 0
			);

			const itemWidth = Math.floor(vw / NUM_COLUMNS);
			const itemHeight = Math.floor(itemWidth / aspectRatio);
			const cols = Math.floor(vw / itemWidth);
			const rows = Math.floor(vh / itemHeight);

			setGridSize({ rows, cols });
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const moveSelection = useCallback(
		(
			direction: "up" | "down" | "left" | "right",
			isMultiSelect: boolean
		): void => {
			const { cols } = gridSize;
			const maxIndex = links.length - 1;

			setSelectedTiles((previousSelected) => {
				const lastSelected = previousSelected.at(-1) ?? 0;
				let newIndex: number;

				switch (direction) {
					case "right": {
						newIndex = (lastSelected + 1) % (maxIndex + 1);
						break;
					}
					case "left": {
						newIndex = (lastSelected - 1 + (maxIndex + 1)) % (maxIndex + 1);
						break;
					}
					case "down": {
						newIndex = (lastSelected + cols) % (maxIndex + 1);
						break;
					}
					case "up": {
						newIndex = (lastSelected - cols + (maxIndex + 1)) % (maxIndex + 1);
						break;
					}
				}

				return isMultiSelect ? [...previousSelected, newIndex] : [newIndex];
			});
		},
		[gridSize, links.length]
	);

	// note - popups must not be blocked for multi-open to function
	const openAllSelectedLinks = useCallback(() => {
		const filteredLinks = links.filter((_link, index) => {
			return selectedTiles.includes(index);
		});

		filteredLinks.forEach((link) => {
			openLink(link.url);
		});
	}, [selectedTiles, links]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			const isMultiSelect = event.metaKey || event.ctrlKey;

			if (isMultiSelect) {
				setCtrlKeyPressed(true);
			}

			const isDirectionalKey = DIRECTIONAL_KEYS.has(event.key);

			// Prevent default browser behavior for these keys when modifier is pressed
			if (isMultiSelect && isDirectionalKey) {
				event.preventDefault();
			}

			switch (event.key) {
				case "ArrowRight": {
					moveSelection("right", isMultiSelect);
					break;
				}
				case "ArrowLeft": {
					moveSelection("left", isMultiSelect);
					break;
				}
				case "ArrowDown": {
					moveSelection("down", isMultiSelect);
					break;
				}
				case "ArrowUp": {
					moveSelection("up", isMultiSelect);
					break;
				}
				case "Enter": {
					openAllSelectedLinks();
					break;
				}
			}
		};

		const handleKeyUp = (event: KeyboardEvent): void => {
			if (event.key === "Control" || event.key === "Meta") {
				setCtrlKeyPressed(false);
			}
		};

		// event: FocusEvent
		const handleFocus = (): void => {
			setCtrlKeyPressed(false);
		};

		window.addEventListener("focus", handleFocus);
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("focus", handleFocus);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [moveSelection, openAllSelectedLinks]);

	return (
		<div className="flex flex-col h-screen">
			<div className="px-4 py-2 bg-gray-700 z-10">
				<div className="flex flex-row justify-between items-center">
					<h1 className="text-3xl text-white font-custom-1 font-bold">
						{selectedSpaceName}
					</h1>
					<div className="flex flex-row items-center">
						<p
							className={`font-bold ${ctrlKeyPressed ? "text-white" : "text-gray-400"}`}
						>
							CMD
						</p>
						{ctrlKeyPressed && (
							<p className="ml-2 font-bold text-theme-yellow">RETURN</p>
						)}
					</div>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto px-4 py-2">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
					{links.map((link, index) => (
						<LinkItem
							key={link.id}
							link={link}
							isSelected={selectedTiles.includes(index)}
							ctrlKeyPressed={ctrlKeyPressed}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default LinkGrid;
