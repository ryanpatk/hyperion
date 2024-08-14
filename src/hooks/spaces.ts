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
		"/auth/login",
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
			await queryClient.cancelQueries({ queryKey: [queryKeys.spaces] });

			// Snapshot the previous value
			const previousSpaces = queryClient.getQueryData<Array<SpaceResponse>>([
				queryKeys.spaces,
			]);

			// Optimistically update to the new value
			queryClient.setQueryData<Array<SpaceResponse>>(
				[queryKeys.spaces],
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
		onSuccess: (data: SpaceResponse) => {
			// Instead of invalidating, we can update the query data directly
			queryClient.setQueryData<Array<SpaceResponse>>(
				[queryKeys.spaces],
				(old) => {
					// Remove the optimistic entry and add the real one
					const filteredOld = old
						? old.filter((space) => space.id !== data.id)
						: [];
					return [...filteredOld, data];
				}
			);
		},
		onError: (error, _newSpace, context) => {
			console.error("create-space failed:", error);
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousSpaces) {
				queryClient.setQueryData([queryKeys.spaces], context.previousSpaces);
			}
		},
		onSettled: () => {
			// Always refetch after error or success:
			void queryClient.invalidateQueries({ queryKey: [queryKeys.spaces] });
		},
	});
}
