import { CurrentRoundIndexProps } from "@/lib/types/currentRoundIndex";
import { GameName } from "@/lib/types/game";
import { useEffect, useState } from "react";

const useRounds = () => {
	const [currentRoundIndexes, setCurrentRoundIndexes] = useState<
		CurrentRoundIndexProps[]
	>([]);
	const [roundLength, setRoundLength] = useState<number | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [roundFailed, setRoundFailed] = useState(false);
	const [numberOfRounds, setNumberOfRounds] = useState(0);
	const [allRoundsPassed, setAllRoundsPassed] = useState(false);

	useEffect(() => {
		// Keep state synced with local storage values
		const storedCurrentRoundIndexes = localStorage.getItem(
			"currentRoundIndexes"
		);
		if (storedCurrentRoundIndexes)
			setCurrentRoundIndexes(JSON.parse(storedCurrentRoundIndexes));
	}, []);

	/**
	 * Update errors
	 */
	const updateCurrentRoundIndexes = async (
		game: GameName,
		roundIndex: number
	) => {
		setCurrentRoundIndexes((prevRoundIndexes) => {
			const existingIndex = prevRoundIndexes.findIndex(
				(item) => item.game === game
			);
			// If there are already errors for this game
			if (existingIndex !== -1) {
				const updatedRoundIndexes = prevRoundIndexes.map((item, index) => {
					if (index === existingIndex) {
						return {
							...item,
							currentRoundIndex: roundIndex,
						};
					}
					return item;
				});
				localStorage.setItem(
					"currentRoundIndexes",
					JSON.stringify(updatedRoundIndexes)
				);
				return updatedRoundIndexes;
			}
			const newRoundIndexes = [
				...prevRoundIndexes,
				{ game: game, currentRoundIndex: roundIndex },
			];
			localStorage.setItem(
				"currentRoundIndexes",
				JSON.stringify(newRoundIndexes)
			);
			return newRoundIndexes;
		});
	};

	/**
	 * Get game specific current round index
	 */
	const getGameCurrentRoundIndex = (game: GameName): number => {
		return (
			currentRoundIndexes.find((i: CurrentRoundIndexProps) => i.game === game)
				?.currentRoundIndex ?? 0
		);
	};

	return {
		roundLength,
		setRoundLength,
		roundComplete,
		setRoundComplete,
		roundFailed,
		setRoundFailed,
		numberOfRounds,
		setNumberOfRounds,
		allRoundsPassed,
		setAllRoundsPassed,
		updateCurrentRoundIndexes,
		getGameCurrentRoundIndex,
	};
};

export default useRounds;
