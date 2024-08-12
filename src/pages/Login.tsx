import { useState, type FC } from "react";
import { useNavigate } from "@tanstack/react-router";

import Button from "../components/Button";
import { useLogin } from "../hooks/auth";

export const Login: FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { isPending, mutate: login } = useLogin();
	const navigate = useNavigate();

	const handleSubmit = (event: React.FormEvent): void => {
		event.preventDefault();
		// Move the void expression to its own statement
		login(
			{ username, password },
			{
				onSuccess: () => {
					void navigate({ to: "/home" });
				},
				onError: () => {},
			}
		);
	};

	return (
		<div className="flex items-center justify-center w-full h-screen bg-gray-100">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
				<h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
					SuperLinks
				</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(event) => {
								setUsername(event.target.value);
							}}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-orange"
						/>
					</div>
					<div>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(event) => {
								setPassword(event.target.value);
							}}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-orange"
						/>
					</div>
					<Button isLoading={isPending} onClick={() => {}} type="submit">
						Log In
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Login;
