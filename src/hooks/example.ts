import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

// Example Todo type
interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

// Define your API base URL
const API_BASE_URL = "https://api.example.com";

// Define a type for your API response
interface ApiResponse<T> {
	data: T;
	// Add any other properties that your API returns
}

// Generic function to fetch data from your API
async function fetchData<T>(endpoint: string): Promise<T> {
	const response = await axios.get<ApiResponse<T>>(
		`${API_BASE_URL}${endpoint}`
	);
	return response.data.data;
}

// Example query key factory
const queryKeys = {
	todos: ["todos"] as const,
	todo: (id: number) => ["todo", id] as const,
	// Add more query keys as needed
};

// Example hook for fetching todos
export function useTodos(): UseQueryResult<Array<Todo>> {
	return useQuery({
		queryKey: queryKeys.todos,
		queryFn: () => fetchData<Array<Todo>>("/todos"),
	});
}

// Example hook for fetching a single todo
export function useTodo(id: number): UseQueryResult<Todo> {
	return useQuery({
		queryKey: queryKeys.todo(id),
		queryFn: () => fetchData<Todo>(`/todos/${id}`),
	});
}

// You can add more custom hooks here as needed
// For example:
// export function useUser(id: number): UseQueryResult<User> { ... }
// export function usePosts(): UseQueryResult<Post[]> { ... }
