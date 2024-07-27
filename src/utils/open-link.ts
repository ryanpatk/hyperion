/**
 * opening a new tab as a background tab is not currently possible.
 * note that this behavior would be ideal if at all possible.
 */
export default function openLink(url: string): void {
	if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
		window.open(url, "_blank");
	} else {
		window.open(`http://${url}`, "_blank");
	}
}
