export default function stripURL(url: string): string {
	// Remove the protocol (e.g., http://, https://)
	url = url.replace(/^(https?:\/\/)/, "");

	// Remove the "www." subdomain if present
	url = url.replace(/^(www\.)/, "");

	return url;
}
