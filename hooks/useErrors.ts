import { GameName } from "@/lib/types/game";
import { useEffect, useState } from "react";
import uniq from "lodash/uniq";

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
		error: any,
		merge: boolean = false
	) => {
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
							errors: mergedErrors,
						};
					}
					return item;
				});
				localStorage.setItem("errors", JSON.stringify(updatedErrors));
				return updatedErrors;
			}
			const newErrors = [
				...prevErrors,
				{ game: game, errors: Array.isArray(error) ? error : [error] },
			];
			localStorage.setItem("errors", JSON.stringify(newErrors));
			return newErrors;
		});
	};

	/**
	 * Get game specific errors
	 */
	const getGameErrors = (game: GameName) => {
		return errors.find((p: any) => p.game === game)?.errors ?? [];
	};

	return { updateErrors, errors, getGameErrors };
};

export default useErrors;
