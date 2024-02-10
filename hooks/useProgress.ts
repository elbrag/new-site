import { GameName } from "@/lib/types/game";
import { useEffect, useState } from "react";
import useErrors from "./useErrors";

const useProgress = () => {
	const { updateErrors } = useErrors();

	// TODO: Move rounds into a useRounds hook
	const [progress, setProgress] = useState<any[]>([]);
	const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
	const [roundLength, setRoundLength] = useState<number | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [roundFailed, setRoundFailed] = useState(false);
	const [numberOfRounds, setNumberOfRounds] = useState(0);
	const [allRoundsPassed, setAllRoundsPassed] = useState(false);

	useEffect(() => {
		// Keep state synced with local storage values
		const storedProgress = localStorage.getItem("progress");
		if (storedProgress) setProgress(JSON.parse(storedProgress));
	}, []);

	useEffect(() => {
		// Keep state synced with local storage values
		const storedCurrentRoundIndex = localStorage.getItem("currentRoundIndex");
		if (storedCurrentRoundIndex)
			setCurrentRoundIndex(JSON.parse(storedCurrentRoundIndex));
	}, []);

	/**
	 * Get game specific progress
	 */
	const getGameProgress = (game: GameName, _progress?: any) => {
		return (
			(_progress ?? progress).find((p: any) => p.game === game)?.progress ?? []
		);
	};

	/**
	 * Get question specific current status
	 */
	const getQuestionStatus = (
		game: GameName,
		questionId: number,
		_progress?: any
	) => {
		const progressObj = _progress ?? progress;
		return (
			getGameProgress(game, progressObj)?.find(
				(p: any) => p.questionId === questionId
			) ?? null
		);
	};

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
		progress,
		setProgress,
		currentRoundIndex,
		setCurrentRoundIndex,
		getGameProgress,
		getQuestionStatus,
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

export default useProgress;
