import { GameName } from "@/lib/types/game";
import { useEffect, useState } from "react";
import uniq from "lodash/uniq";
import { ErrorProps } from "@/lib/types/errors";

const useErrors = () => {
	const [errors, setErrors] = useState<any[]>([]);

	useEffect(() => {
		// Keep state synced with local storage values
		const storedErrors = localStorage.getItem("errors");
		if (storedErrors) setErrors(JSON.parse(storedErrors));
	}, []);

	/**
	 * Update errors
	 */
	const updateErrors = async (
		game: GameName,
		error: string | [],
		merge: boolean = false
	) => {
		console.log("Update errors");
		const shouldReset = Array.isArray(error) && error.length === 0;
		setErrors((prevErrors) => {
			const existingIndex = prevErrors.findIndex((item) => item.game === game);
			// If there are already errors for this game
			if (existingIndex !== -1) {
				const updatedErrors = prevErrors.map((item, index) => {
					if (index === existingIndex) {
						const mergedErrors = merge
							? uniq([...item.errors, error])
							: [...item.errors, error];
						return {
							...item,
							errors: shouldReset ? [] : mergedErrors,
						};
					}
					return item;
				});
				console.log("setting updatedErrors", updatedErrors);

				localStorage.setItem("errors", JSON.stringify(updatedErrors));
				return updatedErrors;
			}
			const newErrors = [
				...prevErrors,
				{ game: game, errors: shouldReset ? [] : [error] },
			];
			console.log("setting newErrors", newErrors);
			localStorage.setItem("errors", JSON.stringify(newErrors));
			return newErrors;
		});
	};

	/**
	 * Get game specific errors
	 */
	const getGameErrors = (game: GameName): string[] => {
		return errors.find((p: ErrorProps) => p.game === game)?.errors ?? [];
	};

	return { updateErrors, errors, getGameErrors };
};

export default useErrors;
