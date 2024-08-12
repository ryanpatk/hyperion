import axios, { type AxiosInstance } from "axios";

const API_BASE_URL = import.meta.env["VITE_APP_BASE_URL"] as string;

const axiosInstance: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
