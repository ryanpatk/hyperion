import { useState, type FC } from "react";

export const Login: FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event: React.FormEvent): void => {
		event.preventDefault();

		// Handle login logic here
		console.log("Login submitted", { username, password });
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
					<button
						type="submit"
						className="w-full py-2 text-white bg-gray-400 rounded-md hover:bg-theme-orange focus:outline-none focus:ring-2 focus:ring-theme-orange focus:bg-theme-orange focus:ring-offset-2"
					>
						Log In
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
