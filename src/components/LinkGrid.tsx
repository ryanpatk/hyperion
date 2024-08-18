import type { FC } from "react";

import { useLinkMetadata } from "../hooks/links-api";

interface Link {
	id: string;
	title: string;
	url: string;
	imageUrl: string;
}

interface LinkItemProps {
	link: Link;
}

interface LinkGridProps {
	links: Array<Link>;
}

const LinkItem: FC<LinkItemProps> = ({ link }) => {
	const { data: linkMetadata } = useLinkMetadata(link?.url);

	return (
		<div
			key={link?.id}
			className="flex flex-col items-center bg-gray-500 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300"
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
			<p className="text-xs text-align-left text-black bg-theme-green truncate font-custom-1 w-full px-1">
				{/* {link?.url} */}
				{linkMetadata?.title}
			</p>
		</div>
	);
};

const LinkGrid: FC<LinkGridProps> = ({ links = [] }) => {
	return (
		<div className="p-4 min-h-screen">
			<h1 className="text-3xl text-theme-yellow font-custom-1 font-bold mb-4">
				Bookmarks
			</h1>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{links.map((link) => {
					return <LinkItem key={link.id} link={link} />;
				})}
			</div>
		</div>
	);
};

export default LinkGrid;
