// import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, type createRouter } from "@tanstack/react-router";
import type { FunctionComponent } from "./common/types";
// import { TanStackRouterDevelopmentTools } from "./components/utils/development-tools/TanStackRouterDevelopmentTools";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 10, // 10 minutes
		},
	},
});

// Create a persister
// const localStoragePersister = createSyncStoragePersister({
// 	storage: window.localStorage as Storage,
// });

type AppProps = { router: ReturnType<typeof createRouter> };

const App = ({ router }: AppProps): FunctionComponent => {
	// useEffect(() => {
	// 	console.log(`
	// 	 _____                       __    _       __
	// 	/ ___/__  ______  ___  _____/ /   (_)___  / /_______
	// 	\__ \/ / / / __ \/ _ \/ ___/ /   / / __ \/ //_/ ___/
	//  ___/ / /_/ / /_/ /  __/ /  / /___/ / / / / ,< (__  )
	// /____/\__,_/ .___/\___/_/  /_____/_/_/ /_/_/|_/____/
	// 					/_/
	// 	`);
	// }, []);

	return (
		<QueryClientProvider
			client={queryClient}
			// persistOptions={{ persister: localStoragePersister }}
		>
			<RouterProvider router={router} />
			{/* <TanStackRouterDevelopmentTools
				router={router}
				initialIsOpen={false}
				position="bottom-right"
			/>
			<ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
};

export default App;
