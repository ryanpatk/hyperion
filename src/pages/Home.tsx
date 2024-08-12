import type { MouseEvent } from "react";

import Grid from "../components/Grid";
import { useMyProfile, useLogout } from "../hooks/auth";

// const openAllLinksInActiveGroup = () => {
// 	for (let i = 0; i < filteredLinks.length; i++) {
// 		openLink(filteredLinks[i]);
// 	}
// };

export const Home: React.FC = () => {
	const { data: myProfile } = useMyProfile();
	const logout = useLogout();

	const handleLogout = (event: MouseEvent<HTMLAnchorElement>): void => {
		event.preventDefault();
		logout();
	};

	const { username } = myProfile || {};

	return (
		<div className="flex w-full h-screen bg-gray-100">
			{/* left column area */}
			<div className="flex-1 basis-0 min-w-[200px] h-full"></div>

			<div className="flex items-center justify-center p-4">
				<div className="w-full aspect-[6/5] max-w-4xl max-h-[90vh] overflow-auto shadow-md">
					<Grid />
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
						Logout
					</a>
				</div>
			</div>
		</div>
	);
};
