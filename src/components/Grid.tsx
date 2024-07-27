import { useEffect, useCallback, useState, type FC } from "react";

import Tile from "../components/Tile";

// Temporary for UI scaffolding; replace with actual data
import { MOCK_TILES } from "../mocks";

import type { ITile } from "../types";

interface GridProps {
	tiles?: Array<ITile>;
}

interface GridSize {
	rows: number;
	cols: number;
}

const NUM_COLUMNS = 6;

const MOCK_DATA = [...MOCK_TILES, ...MOCK_TILES, ...MOCK_TILES, ...MOCK_TILES];

const Grid: FC<GridProps> = ({ tiles = MOCK_DATA }) => {
	const [selectedTiles, setSelectedTiles] = useState<Array<number>>([0]);
	const [gridSize, setGridSize] = useState<GridSize>({ rows: 0, cols: 0 });
	const [isDragging, setIsDragging] = useState(false);

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
				{tiles.slice(0, gridSize.rows * gridSize.cols).map((tile, index) => (
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

export default Grid;
