export enum TileType {
	link = "link",
	image = "image",
	note = "note",
}

export interface ITile {
	id: string;
	url: string;
	image: string | null;
	type: TileType;
}
