import { useState, useEffect } from "react";

interface PasteResult {
	pastedValue: string;
	clearPastedValue: () => void;
}

export const usePastedValue = (): PasteResult => {
	const [pastedValue, setPastedValue] = useState<string>("");

	useEffect(() => {
		const handlePaste = (event: ClipboardEvent): void => {
			event.preventDefault();
			navigator.clipboard
				.readText()
				.then((text) => {
					setPastedValue(text);
				})
				.catch((error) => {
					console.error("Failed to read clipboard contents:", error);
				});
		};

		// Add the event listener
		document.addEventListener("paste", handlePaste);

		// Clean up the event listener on component unmount
		return () => {
			document.removeEventListener("paste", handlePaste);
		};
	}, []);

	const clearPastedValue = (): void => {
		setPastedValue("");
	};

	return { pastedValue, clearPastedValue };
};
