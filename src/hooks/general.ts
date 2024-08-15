import { useEffect, useRef } from "react";

/**
 * A custom hook that returns the previous value of a variable.
 * @template T The type of the value being tracked
 * @param {T} value The current value
 * @returns {T | undefined} The previous value (undefined on first render)
 */
export function usePrevious<T>(value: T): T | undefined {
	// Create a ref to store the previous value
	const ref = useRef<T>();

	// Update the ref value after each render
	useEffect(() => {
		ref.current = value;
	}, [value]);

	// Return the previous value (which is now stored in ref.current)
	return ref.current;
}
