import { useEffect, useCallback, useState, type FC } from "react";

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

import Tile from "../components/Tile";
import type { ITile } from "../types";

// Temporary for UI scaffolding; replace with actual data
import { MOCK_TILES } from "../mocks";

interface GridProps {
	tiles?: Array<ITile>;
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
const MOCK_DATA = [...MOCK_TILES, ...MOCK_TILES];
const MAX_VISIBLE_TILES = 30;

const Grid: FC<GridProps> = ({ tiles = MOCK_DATA }) => {
	const [selectedTiles, setSelectedTiles] = useState<Array<number>>([0]);
	const [gridSize, setGridSize] = useState<GridSize>({ rows: 0, cols: 0 });
	const [isDragging, setIsDragging] = useState(false);

	const numberEmptyTilesToAppend =
		tiles.length < MAX_VISIBLE_TILES
			? MAX_VISIBLE_TILES - tiles.length
			: 6 - (tiles.length % 6);
	const emptyTiles = Array.from(
		{ length: numberEmptyTilesToAppend },
		() => ({})
	);
	const tilesFilled = [...tiles, ...emptyTiles];

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
			const maxIndex = tiles.length - 1;

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
		[gridSize, tiles.length]
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			const isMultiSelect = event.metaKey || event.ctrlKey;
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
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [moveSelection]);

	const handleTileClick = (index: number): void => {
		setSelectedTiles([index]);
	};

	const handleMouseDown = (index: number): void => {
		setIsDragging(true);
		setSelectedTiles([index]);
	};

	const handleMouseEnter = (index: number): void => {
		if (isDragging) {
			setSelectedTiles((previous) => [...previous, index]);
		}
	};

	const handleMouseUp = (): void => {
		setIsDragging(false);
	};

	useEffect(() => {
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	return (
		<div className="grid grid-cols-6 grid-rows-5 h-full">
			{tilesFilled.map((tile, index) => {
				const isEmptyTile = Object.keys(tile).length === 0;
				return (
					<div
						key={index}
						className={`relative overflow-hidden cursor-pointer
								${
									isEmptyTile
										? "bg-gray-200"
										: selectedTiles.includes(index)
											? "ring-4 ring-theme-orange z-10"
											: "before:absolute before:inset-0 before:bg-[#111A3B] before:bg-opacity-60"
								}
							`}
						onClick={() => {
							handleTileClick(index);
						}}
						onMouseDown={() => {
							handleMouseDown(index);
						}}
						onMouseEnter={() => {
							handleMouseEnter(index);
						}}
					>
						<Tile tile={tile} />
					</div>
				);
			})}
		</div>
	);
};

export default Grid;
