/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
				["custom-1"]: ["Inter tight"],
			},
			colors: {
				"theme-green": "#4FFFB0",
				"theme-yellow": "#FFD900",
				"theme-orange": "#FF4D00",
			},
		},
	},
	plugins: [],
};
