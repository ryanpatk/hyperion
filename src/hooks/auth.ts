import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env["VITE_APP_BASE_URL"] as string;

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	// user: {
	// 	id: string;
	// 	username: string;
	// 	// Add any other user properties your API returns
	// };
}

async function loginUser(
	credentials: LoginCredentials
): Promise<LoginResponse> {
	const response = await axios.post<LoginResponse>(
		`${API_BASE_URL}/auth/login`,
		credentials
	);
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

			// You might want to update your global state here (e.g., Zustand store)
		},
		onError: (error) => {
			console.error("Login failed:", error);
			// You might want to show an error message to the user
		},
	});
}
