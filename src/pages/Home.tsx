import Grid from "../components/Grid";

// const openAllLinksInActiveGroup = () => {
// 	for (let i = 0; i < filteredLinks.length; i++) {
// 		openLink(filteredLinks[i]);
// 	}
// };

export const Home: React.FC = () => {
	return (
		<div className="flex items-center justify-center w-full h-screen bg-gray-100">
			{/* left column area */}
			<Grid />
			{/* right column area */}
		</div>
	);
};
