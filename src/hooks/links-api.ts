import {
	useQuery,
	useQueryClient,
	useMutation,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import axiosInstance from "../axios-instance";

export interface NewLinkData {
	url: string;
	spaceId?: number;
}

export interface LinkMetadata {
	id: number;
	title: string;
	images: Array<string>;
	favicons: Array<string>;
}

// TODO: figure out better way to handle types on optimistic record
export interface LinkResponse {
	createdAt?: string;
	favicon?: string;
	id: number | string;
	image?: string;
	label?: string;
	notes?: string;
	spaceId?: number; // check -> conflicts with uuid?
	title?: string;
	updatedAt?: string;
	url: string;
	userId?: number; // check -> conflicts with uuid?
}

const queryKeys = {
	links: ["links"] as const,
	metadata: ["link_metadata"] as const,
};

async function fetchLinks(): Promise<Array<LinkResponse>> {
	const response = await axiosInstance.get<Array<LinkResponse>>("/links");
	return response.data;
}

const fetchUrlMetadata = async (url: string): Promise<Array<LinkMetadata>> => {
	const response = await axiosInstance.get<Array<LinkMetadata>>(
		`/url-scraper?&url=${encodeURIComponent(url)}`
	);

	return response.data;
};

async function createLink(newLinkData: NewLinkData): Promise<LinkResponse> {
	const response = await axiosInstance.post<LinkResponse>("/links", {
		url: newLinkData.url,
		["space_id"]: newLinkData.spaceId,
	});
	return response.data;
}

export function useLinks(): UseQueryResult<Array<LinkResponse>> {
	return useQuery({
		queryKey: queryKeys.links,
		queryFn: () => fetchLinks(),
	});
}

export function useLinkMetadata(linkUrl: string): UseQueryResult<LinkMetadata> {
	return useQuery({
		queryKey: [queryKeys.metadata, linkUrl],
		queryFn: () => fetchUrlMetadata(linkUrl),
	});
}

export function useCreateLink(): UseMutationResult<
	LinkResponse,
	Error,
	NewLinkData
> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createLink,
		onMutate: async (newLink) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: queryKeys.links });

			// Snapshot the previous value
			const previousLinks = queryClient.getQueryData<Array<LinkResponse>>(
				queryKeys.links
			);

			// Appends an optimistic value to the cache
			queryClient.setQueryData<Array<LinkResponse>>(queryKeys.links, (old) => {
				const optimisticLink: LinkResponse = {
					...newLink,
					id: uuidv4(), // Generate a temporary UUID
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				return old ? [...old, optimisticLink] : [optimisticLink];
			});

			// Return a context object with the snapshotted value
			return { previousLinks };
		},
		onSuccess: (data: LinkResponse, _variables, context) => {
			// Testing new method of ignoring the optimistic response,
			// append the server-generated data directly to the original cache value
			queryClient.setQueryData<Array<LinkResponse>>(queryKeys.links, () => {
				return context.previousLinks
					? [...context.previousLinks, data]
					: [data];
			});
		},
		onError: (error, _newSpace, context) => {
			console.error("create-link failed:", error);
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousLinks) {
				queryClient.setQueryData(queryKeys.links, context.previousLinks);
			}
		},
		onSettled: () => {
			void queryClient.invalidateQueries({ queryKey: queryKeys.links });
		},
	});
}
