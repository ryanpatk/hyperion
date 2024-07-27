import { TileType, type ITile } from "./types";

export const MOCK_PROJECTS: Array<string> = ["Core", "Design", "Development"];

export const MOCK_TILES: Array<ITile> = [
	{
		id: "tile-1",
		url: "https://my.brain.fm",
		image: null,
		type: TileType.link,
	},
	{
		id: "tile-2",
		url: "https://www.chatgpt.com",
		image: null,
		type: TileType.link,
	},
	{
		id: "tile-3",
		url: "https://claude.ai",
		image: null,
		type: TileType.link,
	},
	{
		id: "tile-4",
		url: "https://access.mymind.com",
		image: null,
		type: TileType.link,
	},
	{
		id: "tile-5",
		url: "https://docs.nestjs.com/recipes/passport",
		image: null,
		type: TileType.link,
	},
	{
		id: "tile-6",
		url: "https://tailwindcss.com/docs/width",
		image: null,
		type: TileType.link,
	},
	{
		id: "tile-7",
		url: "https://github.com/ryanpatk/chronos",
		image: null,
		type: TileType.link,
	},
	{
		id: "tile-8",
		url: "www.gmail.com",
		image: null,
		type: TileType.link,
	},
	{
		id: "tile-9",
		url: "https://x.com/terminaldotshop/status/1802905043688989090",
		image: null,
		type: TileType.link,
	},
];
