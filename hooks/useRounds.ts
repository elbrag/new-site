import { GameName } from "@/lib/types/game";
import { useEffect, useState } from "react";
import useErrors from "./useErrors";

const useRounds = () => {
	const { updateErrors } = useErrors();
	const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
	const [roundLength, setRoundLength] = useState<number | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [roundFailed, setRoundFailed] = useState(false);
	const [numberOfRounds, setNumberOfRounds] = useState(0);
	const [allRoundsPassed, setAllRoundsPassed] = useState(false);

	useEffect(() => {
		// Keep state synced with local storage values
		const storedCurrentRoundIndex = localStorage.getItem("currentRoundIndex");
		if (storedCurrentRoundIndex)
			setCurrentRoundIndex(JSON.parse(storedCurrentRoundIndex));
	}, []);

	/**
	 * On round fail
	 */
	const onRoundFail = (game: GameName) => {
		setRoundFailed(true);
		if (currentRoundIndex === numberOfRounds - 1) {
			setAllRoundsPassed(true);
		} else {
			// Reset errors
			updateErrors(game, [], false);
			// Go to next round
			localStorage.setItem(
				"currentRoundIndex",
				JSON.stringify(currentRoundIndex + 1)
			);
			setCurrentRoundIndex(currentRoundIndex + 1);
		}
	};

	return {
		currentRoundIndex,
		setCurrentRoundIndex,
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
		onRoundFail,
	};
};

export default useRounds;
