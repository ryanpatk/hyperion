import { useEffect, useCallback, useState } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
	// type DraggableLocation,
	// type DraggableStateSnapshot,
	// type DroppableStateSnapshot,
	// type DraggableProvided,
	// type DroppableProvided,
} from "@hello-pangea/dnd";

import defaultTheme from "tailwindcss/defaultTheme";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import stripUrl from "../utils/strip-url";

enum ICardType {
	link = "link",
	image = "image",
	note = "note",
}

interface ICard {
	id: string;
	url: string;
	image: string | null;
	type: ICardType;
}

const getBestFavicon = (favicons: Array<string>): string | null => {
	if (!favicons || favicons.length === 0) {
		return null;
	}

	const firstChoice = favicons.find((favicon: string): boolean => {
		return favicon.includes("logo");
	});

	if (firstChoice) {
		return firstChoice;
	}

	const secondChoice = favicons.find((favicon: string): boolean => {
		return favicon.includes("favicon");
	});

	if (secondChoice) {
		return secondChoice;
	}

	return favicons[0] || null;
};

const MOCK_PROJECTS: Array<string> = ["Core", "Design", "Development"];

const MOCK_CARDS: Array<ICard> = [
	{
		id: "tile-1",
		url: "https://my.brain.fm",
		image: null,
		type: ICardType.link,
	},
	{
		id: "tile-2",
		url: "https://www.chatgpt.com",
		image: null,
		type: ICardType.link,
	},
	{
		id: "tile-3",
		url: "https://claude.ai",
		image: null,
		type: ICardType.link,
	},
	{
		id: "tile-4",
		url: "https://access.mymind.com",
		image: null,
		type: ICardType.link,
	},
	{
		id: "tile-5",
		url: "https://docs.nestjs.com/recipes/passport",
		image: null,
		type: ICardType.link,
	},
	{
		id: "tile-6",
		url: "https://tailwindcss.com/docs/width",
		image: null,
		type: ICardType.link,
	},
	{
		id: "tile-7",
		url: "https://github.com/ryanpatk/chronos",
		image: null,
		type: ICardType.link,
	},
	{
		id: "tile-8",
		url: "www.gmail.com",
		image: null,
		type: ICardType.link,
	},
	{
		id: "tile-9",
		url: "https://x.com/terminaldotshop/status/1802905043688989090",
		image: null,
		type: ICardType.link,
	},
];

interface CardProps {
	card: ICard;
	minimized?: boolean;
}

// const openAllLinksInActiveGroup = () => {
// 	for (let i = 0; i < filteredLinks.length; i++) {
// 		openLink(filteredLinks[i]);
// 	}
// };

/**
 * opening a new tab as a background tab is not currently possible.
 * note that this behavior would be ideal if at all possible.
 */
function openLink(url: string): void {
	if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
		window.open(url, "_blank");
	} else {
		window.open(`http://${link.url}`, "_blank");
	}
}

interface MyData {
	id: number;
	name: string;
	// Add more properties as needed
}

const fetchUrlData = async (url: string): Promise<Array<MyData>> => {
	const response = await axios.get<Array<MyData>>(
		`http://localhost:3000/url-scraper?&url=${encodeURIComponent(url)}`
	);

	return response.data;
};

const Card: React.FC<CardProps> = ({ card, minimized = false }) => {
	const { data, isLoading } = useQuery({
		queryKey: ["url_data", card.url],
		queryFn: () => fetchUrlData(card.url),
	});

	const { favicons = [], images = [] } = data || {};

	const handleClick = (): void => {
		openLink(card.url);
	};

	// if (minimized) {
	// 	return (
	// 		<div className="text-left mb-1">
	// 			<div className="bg-blue-200 rounded-lg shadow-sm w-18 h-14 flex flex-col overflow-hidden justify-center items-center text-center ">
	// 				<img className="h-5 w-5" src={isLoading ? null : favicons[0]} />
	// 			</div>
	// 			<p className="relative pt-1 text-gray-400 text-xs transition-colors duration-300 ease-in-out group-hover:text-white z-10 overflow-hidden text-ellipsis whitespace-nowrap w-full">
	// 				{isLoading ? "" : stripUrl(card.url)}
	// 			</p>
	// 		</div>
	// 	);
	// }

	return (
		<div className="bg-white border border-gray w-100 h-56 flex flex-col">
			<div className="flex flex-grow items-center justify-center">
				<img src={isLoading ? null : images[0] || getBestFavicon(favicons)} />
			</div>
			<div
				className="relative bg-white p-1 text-right group hover:cursor-pointer"
				onClick={handleClick}
			>
				<div className="absolute inset-0 bg-yellow-400 transform translate-x-full group-hover:translate-x-0 group-hover:cursor-pointer transition-transform duration-300 ease-in-out"></div>
				<p className="relative text-blue-600 text-xs transition-colors duration-300 ease-in-out group-hover:text-black z-10">
					{stripUrl(card.url)}
				</p>
			</div>
		</div>
	);
};

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

	const cardsData = [
		...MOCK_CARDS,
		// ...MOCK_CARDS,
		// ...MOCK_CARDS,
		// ...MOCK_CARDS,
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
				{cardsData
					.slice(0, gridSize.rows * gridSize.cols)
					.map((image, index) => (
						<div
							key={index}
							className={`relative overflow-hidden cursor-pointer ${
								selectedTiles.includes(index)
									? "ring-4 ring-orange-500 z-10"
									: ""
							}`}
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
							<Card card={image} />
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
