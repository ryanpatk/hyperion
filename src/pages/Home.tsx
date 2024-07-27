import { useEffect, useCallback, useState } from "react";
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

import defaultTheme from "tailwindcss/defaultTheme";

import Tile from "../components/Tile";

// Temporary for UI scaffolding; replace with actual data
import { MOCK_TILES } from "../mocks";

// const openAllLinksInActiveGroup = () => {
// 	for (let i = 0; i < filteredLinks.length; i++) {
// 		openLink(filteredLinks[i]);
// 	}
// };

// const AddItemCard: React.FC = () => {
// 	return (
// 		<div className="border border-gray border- p-4 rounded-md shadow-sm w-32 h-32 justify-center flex items-center">
// 			<p className="text-gray-800 text-3xl">+</p>
// 		</div>
// 	);
// };

interface GridSize {
	rows: number;
	cols: number;
}

const NUM_COLUMNS = 6;

const ImageGrid: React.FC = () => {
	const [selectedTiles, setSelectedTiles] = useState<Array<number>>([0]);
	const [gridSize, setGridSize] = useState<GridSize>({ rows: 0, cols: 0 });
	const [isDragging, setIsDragging] = useState(false);

	const tilesData = [
		...MOCK_TILES,
		...MOCK_TILES,
		...MOCK_TILES,
		...MOCK_TILES,
	];

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
			const { rows, cols } = gridSize;
			setSelectedTiles((previousSelected) => {
				const lastSelected = previousSelected.at(-1);
				let newIndex: number;

				switch (direction) {
					case "right": {
						newIndex = (lastSelected + 1) % (rows * cols);
						break;
					}
					case "left": {
						newIndex = (lastSelected - 1 + rows * cols) % (rows * cols);
						break;
					}
					case "down": {
						newIndex = (lastSelected + cols) % (rows * cols);
						break;
					}
					case "up": {
						newIndex = (lastSelected - cols + rows * cols) % (rows * cols);
						break;
					}
				}

				return isMultiSelect ? [...previousSelected, newIndex] : [newIndex];
			});
		},
		[gridSize]
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent): void => {
			const isMultiSelect = e.metaKey || e.ctrlKey;

			switch (e.key) {
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
		<div className="w-screen h-screen overflow-hidden">
			<div
				className="grid w-full h-full"
				style={{
					gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
					gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
				}}
			>
				{tilesData
					.slice(0, gridSize.rows * gridSize.cols)
					.map((tile, index) => (
						<div
							key={index}
							className={`relative overflow-hidden cursor-pointer bg-red
								${
									selectedTiles.includes(index)
										? "ring-4 ring-theme-green z-10"
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
					))}
			</div>
		</div>
	);
};

export const Home: React.FC = () => {
	// const [cards, setCards] = useState<Array<ICard>>(MOCK_CARDS);

	useEffect(() => {
		console.log("Tailwind CSS Theme:", defaultTheme);
	}, []);

	{
		/* <div
					className="flex-1 mt-2 mb-4 mx-2 ml-4 rounded-xl border-l shadow-sm w-full bg-blue-200 border border-blue-600 p-6 bg-repeat bg-center"
					style={{
						backgroundImage: "radial-gradient(#2563EB 1px, transparent 1px)",
						backgroundSize: "20px 20px",
					}}
				></div> */
	}
	return (
		<div className="flex bg-blue-600 w-full h-screen overflow-hidden">
			{/* Left Sidebar */}
			{/* <div className="w-36 p-2 text-left"></div> */}

			{/* Main App Area */}
			<div className="flex w-full my-4 flex-col text-center">
				<ImageGrid />
			</div>

			{/* Right Sidebar */}
			{/* <div className="w-96 text-black ml-4 p-2 text-right"> */}
			{/* <div className="mt-12 mx-1 mb-2 h-10 bg-blue-200 rounded-lg"></div> */}
			{/* <div className="mt-2 mx-1 mb-2 h-10 border-b border-black text-left flex items-center">
					<p className="ml-2">Search...</p>
				</div> */}

			{/* <div className="mt-4 grid grid-cols-4 gap-1 px-2 h-full overflow-y-scroll">
					{[...MOCK_CARDS, ...MOCK_CARDS, ...MOCK_CARDS, ...MOCK_CARDS].map(
						(card) => {
							return (
								<div key={card.id}>
									<Card minimized card={card} />
								</div>
							);
						}
					)}
				</div> */}
			{/* </div> */}
		</div>
	);
};
