import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
	useQuery,
	useMutation,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query";

import axiosInstance from "../axios-instance";

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
}

export interface MyProfileResponse {
	username: string;
	id: number;
}

const queryKeys = {
	myProfile: ["my_profile"] as const,
};

async function loginUser(
	credentials: LoginCredentials
): Promise<LoginResponse> {
	const response = await axiosInstance.post<LoginResponse>(
		"/auth/login",
		credentials
	);
	return response.data;
}

async function fetchMyProfile(): Promise<MyProfileResponse> {
	const response = await axiosInstance.get<MyProfileResponse>("/auth/profile");
	return response.data;
}

export function useLogin(): UseMutationResult<
	LoginResponse,
	Error,
	LoginCredentials
> {
	return useMutation({
		mutationFn: loginUser,
		onSuccess: (data: LoginResponse) => {
			localStorage.setItem("token", data.access_token);
		},
		onError: (error) => {
			console.error("login failed:", error);
		},
	});
}

export function useLogout(): () => void {
	const navigate = useNavigate();

	return useCallback(() => {
		localStorage.removeItem("token");
		void navigate({ to: "/" });
	}, [navigate]);
}

export function useMyProfile(): UseQueryResult<MyProfileResponse> {
	return useQuery({
		queryKey: queryKeys.myProfile,
		queryFn: () => fetchMyProfile(),
	});
}
