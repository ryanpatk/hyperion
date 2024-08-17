import { useEffect, useState, useMemo, type MouseEvent, type FC } from "react";

import Grid from "../components/Grid";
import SpacesList from "../components/SpacesList";
import { useMyProfile, useLogout } from "../hooks/auth-api";
import { useSpaces, type SpaceResponse } from "../hooks/spaces-api";
import { usePastedValue } from "../hooks/keyboard";
import { useCreateLink, useLinks, type LinkResponse } from "../hooks/links-api";
import { usePrevious } from "../hooks/general";
import isValidUrl from "../utils/is-valid-url";

// const openAllLinksInActiveGroup = () => {
// 	for (let i = 0; i < filteredLinks.length; i++) {
// 		openLink(filteredLinks[i]);
// 	}
// };

const UNSORTED_SPACE: SpaceResponse = {
	id: 0,
	name: "Unsorted",
};

export const Home: FC = () => {
	const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(0);
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

	useEffect(() => {
		if (pastedValue && !previousPastedValue) {
			if (isValidUrl(pastedValue)) {
				createLink({ url: pastedValue });
			}
			clearPastedValue();
		}
	}, [pastedValue, createLink, clearPastedValue, previousPastedValue]);

	const handleLogout = (event: MouseEvent<HTMLAnchorElement>): void => {
		event.preventDefault();
		logout();
	};

	const { username } = myProfile || {};

	return (
		<div className="flex w-full h-screen bg-gray-100">
			{/* left column area */}
			<div className="flex-1 basis-0 min-w-[200px] h-full">
				<SpacesList
					spaces={spacesWithUnsorted}
					selectedSpaceId={selectedSpaceId}
					setSelectedSpaceId={setSelectedSpaceId}
				/>
			</div>

			<div className="flex items-center justify-center p-4">
				<div className="w-full aspect-[6/5] max-w-4xl max-h-[90vh] overflow-auto shadow-md">
					<Grid links={linksForSpace} />
				</div>
			</div>

			{/* right column area */}
			<div className="flex flex-1 basis-0 min-w-[200px] h-full justify-end p-4">
				<div className="text-right">
					<p className="text-gray-500">
						Logged in as <b>{username}</b>
					</p>
					<a
						href="#"
						onClick={handleLogout}
						className="text-gray-500 hover:text-gray-700 cursor-pointer"
					>
						<b>Logout</b>
					</a>
				</div>
			</div>
		</div>
	);
};
