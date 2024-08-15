/**
 * Validates whether a given string is a valid URL.
 * This function allows for complex URLs including query parameters and hash fragments.
 * @param {string} potentialUrl - The string to be validated as a URL.
 * @returns {boolean} True if the string is a valid URL, false otherwise.
 */
export default function isValidUrl(potentialUrl: string): boolean {
	// More comprehensive URL pattern
	const urlPattern: RegExp =
		/^(https?:\/\/)?([\d.a-z-]+)\.([.a-z]{2,6})([\w ./-]*)*\/?(\?[^#]*)?(#.*)?$/i;

	// Check if the string matches the pattern
	if (!urlPattern.test(potentialUrl)) {
		return false;
	}

	// If it matches the pattern, try to create a URL object
	try {
		new URL(potentialUrl);
		return true;
	} catch {
		// If the string doesn't start with 'http://' or 'https://', try adding 'http://' and test again
		if (!/^https?:\/\//i.test(potentialUrl)) {
			try {
				new URL(`http://${potentialUrl}`);
				return true;
			} catch {
				return false;
			}
		}
		return false;
	}
}
