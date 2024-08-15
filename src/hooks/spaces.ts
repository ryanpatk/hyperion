import {
	useQuery,
	useQueryClient,
	useMutation,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import axiosInstance from "../axios-instance";

export interface NewSpaceData {
	name: string;
}

export interface SpaceResponse {
	id: number;
	createdAt: string;
	name: string;
	updatedAt: string;
	userId: string;
}

const queryKeys = {
	spaces: ["spaces"] as const,
};

async function fetchSpaces(): Promise<Array<SpaceResponse>> {
	const response = await axiosInstance.get<Array<SpaceResponse>>("/spaces");
	return response.data;
}

async function createSpace(newSpaceData: NewSpaceData): Promise<SpaceResponse> {
	const response = await axiosInstance.post<SpaceResponse>(
		"/spaces",
		newSpaceData
	);
	return response.data;
}

export function useSpaces(): UseQueryResult<Array<SpaceResponse>> {
	return useQuery({
		queryKey: queryKeys.spaces,
		queryFn: () => fetchSpaces(),
	});
}

export function useCreateSpace(): UseMutationResult<
	SpaceResponse,
	Error,
	NewSpaceData
> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createSpace,
		onMutate: async (newSpace) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: queryKeys.spaces });

			// Snapshot the previous value
			const previousSpaces = queryClient.getQueryData<Array<SpaceResponse>>(
				queryKeys.spaces
			);

			// Appends an optimistic value to the cache
			queryClient.setQueryData<Array<SpaceResponse>>(
				queryKeys.spaces,
				(old) => {
					const optimisticSpace: SpaceResponse = {
						...newSpace,
						id: uuidv4(), // Generate a temporary UUID
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						// Add any other required fields with temporary values
					};
					return old ? [...old, optimisticSpace] : [optimisticSpace];
				}
			);

			// Return a context object with the snapshotted value
			return { previousSpaces };
		},
		onSuccess: (data: SpaceResponse, _variables, context) => {
			// Testing new method of ignoring the optimistic response,
			// append the server-generated data directly to the original cache value
			queryClient.setQueryData<Array<SpaceResponse>>(queryKeys.spaces, () => {
				return context.previousSpaces
					? [...context.previousSpaces, data]
					: [data];
			});
		},
		onError: (error, _newSpace, context) => {
			console.error("create-space failed:", error);
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousSpaces) {
				queryClient.setQueryData(queryKeys.spaces, context.previousSpaces);
			}
		},
		onSettled: () => {
			void queryClient.invalidateQueries({ queryKey: queryKeys.spaces });
		},
	});
}
