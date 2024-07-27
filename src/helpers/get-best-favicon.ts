export default function getBestFavicon(favicons: Array<string>): string | null {
	if (!favicons || favicons.length === 0) {
		return null;
	}

	const firstChoice = favicons.find((favicon: string): boolean => {
		return favicon.includes("logo");
	});

	if (firstChoice) {
		return firstChoice;
	}

	const secondChoice = favicons.find((favicon: string): boolean => {
		return favicon.includes("favicon");
	});

	if (secondChoice) {
		return secondChoice;
	}

	return favicons[0] || null;
}
