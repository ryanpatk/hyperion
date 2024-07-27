// import {
// 	DragDropContext,
// 	Droppable,
// 	Draggable,
// 	type DropResult,
// 	// type DraggableLocation,
// 	// type DraggableStateSnapshot,
// 	// type DroppableStateSnapshot,
// 	// type DraggableProvided,
// 	// type DroppableProvided,
// } from "@hello-pangea/dnd";

import Grid from "../components/Grid";

// const openAllLinksInActiveGroup = () => {
// 	for (let i = 0; i < filteredLinks.length; i++) {
// 		openLink(filteredLinks[i]);
// 	}
// };

// const AddItemCard: React.FC = () => {
// 	return (
// 		<div className="border border-gray border- p-4 rounded-md shadow-sm w-32 h-32 justify-center flex items-center">
// 			<p className="text-gray-800 text-3xl">+</p>
// 		</div>
// 	);
// };

export const Home: React.FC = () => {
	return (
		<div className="flex bg-blue-600 w-full h-screen overflow-hidden">
			{/* Left Sidebar */}
			{/* <div className="w-36 p-2 text-left"></div> */}

			{/* Main App Area */}
			<div className="flex w-full my-4 flex-col text-center">
				<Grid />
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
