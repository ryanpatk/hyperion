import { useEffect, useState, useMemo, type MouseEvent, type FC } from "react";

import LinkGrid from "../components/LinkGrid";
import SpacesList from "../components/SpacesList";
import { useMyProfile, useLogout } from "../hooks/auth-api";
import { useSpaces, type SpaceResponse } from "../hooks/spaces-api";
import { usePastedValue } from "../hooks/keyboard";
import { useCreateLink, useLinks, type LinkResponse } from "../hooks/links-api";
import { usePrevious } from "../hooks/general";
import isValidUrl from "../utils/is-valid-url";

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

	const selectedSpace = useMemo((): SpaceResponse | null => {
		if (!selectedSpaceId || !spaces?.length) {
			return null;
		}
		return spaces.find((space) => space?.id === selectedSpaceId) || null;
	}, [selectedSpaceId, spaces]);

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
				if (selectedSpaceId) {
					createLink({ url: pastedValue, spaceId: selectedSpaceId });
				} else {
					createLink({ url: pastedValue });
				}
			}
			clearPastedValue();
		}
	}, [
		pastedValue,
		createLink,
		clearPastedValue,
		previousPastedValue,
		selectedSpaceId,
	]);

	const handleLogout = (event: MouseEvent<HTMLAnchorElement>): void => {
		event.preventDefault();
		logout();
	};

	const { username } = myProfile || {};

	return (
		<div className="flex w-full h-screen bg-gray-700">
			{/* left column area */}
			<div className="flex-1 basis-0 min-w-[200px] max-w-[200px] h-full">
				<SpacesList
					spaces={spacesWithUnsorted}
					selectedSpaceId={selectedSpaceId}
					setSelectedSpaceId={setSelectedSpaceId}
				/>
			</div>

			<div className="flex items-center justify-center">
				{/* <div className="w-full aspect-[6/5] max-w-4xl max-h-[90vh] overflow-auto shadow-md"> */}
				{/* <Grid links={linksForSpace} /> */}
				<LinkGrid
					links={linksForSpace}
					selectedSpaceName={selectedSpace?.name || "Unsorted"}
				/>
				{/* </div> */}
			</div>

			{/* <div className="flex flex-1 basis-0 min-w-[200px] h-full justify-end p-2"> */}
			{/* Right column */}
			{/* </div> */}

			<div className="absolute bottom-0 w-screen bg-gray-600 flex flex-row justify-end">
				{/* <h1 className="text-md font-bold mb-4 flex items-center text-gray-400">
					SuperLinks <FaRegCopyright style={{ marginLeft: "2px" }} />
				</h1> */}
				<div className="text-right flex flex-row pr-2">
					<p className="text-white pr-2">Logged in as {username} |</p>
					<a
						href="#"
						onClick={handleLogout}
						className="text-white hover:text-theme-yellow cursor-pointer"
					>
						<b>Logout</b>
					</a>
				</div>
			</div>
		</div>
	);
};
