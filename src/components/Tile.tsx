import type React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import getBestFavicon from "../helpers/get-best-favicon";
// import openLink from "../utils/open-link";

import type { ITile } from "../types";

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

interface TileProps {
	tile: ITile;
	// minimized?: boolean;
}

const Tile: React.FC<TileProps> = ({ tile }) => {
	const { data, isLoading } = useQuery({
		queryKey: ["url_data", tile.url],
		queryFn: () => fetchUrlData(tile.url),
	});

	const { favicons = [], images = [] } = data || {};

	// const handleClick = (): void => {
	// 	openLink(tile.url);
	// };

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
		<div className="bg-white border border-gray w-full h-56 flex items-center justify-center">
			<img
				src={isLoading ? null : images[0] || getBestFavicon(favicons)}
				className="max-w-full max-h-full object-scale-down"
			/>
		</div>
	);
};

export default Tile;
