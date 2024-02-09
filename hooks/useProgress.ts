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
	const [allRoundsCompleted, setAllRoundsCompleted] = useState(false);

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
	 * Update progress
	 */
	const updateProgress = async (
		game: GameName,
		questionId: number,
		completed: any
	) => {
		setRoundComplete(false);
		setRoundFailed(false);

		await setProgress((prevProgress) => {
			// Find the index of the object with the same game name
			const existingGameIndex = prevProgress.findIndex(
				(item) => item.game === game
			);

			// If an object with the same game name exists
			if (existingGameIndex !== -1) {
				const updatedProgress = prevProgress.map((item, index) => {
					if (index === existingGameIndex) {
						// Find the index of the progress item with the same questionId
						const existingQuestionIndex = item.progress.findIndex(
							(progressItem: any) => progressItem.questionId === questionId
						);

						// If a progress item with the same questionId exists, update its completed data
						if (existingQuestionIndex !== -1) {
							return {
								...item,
								progress: item.progress.map((progressItem: any) => {
									if (progressItem.questionId === questionId) {
										return {
											...progressItem,
											completed: [...progressItem.completed, ...completed],
										};
									}
									return progressItem;
								}),
							};
						} else {
							// If no progress item with the same questionId exists, add a new progress item
							return {
								...item,
								progress: [
									...item.progress,
									{
										questionId,
										completed,
									},
								],
							};
						}
					}
					return item;
				});
				localStorage.setItem("progress", JSON.stringify(updatedProgress));

				// Check if the current round is completed
				if (checkIfCompleted(updatedProgress, game, questionId)) {
					onRoundComplete(game);
				}

				return updatedProgress;
			} else {
				// If no object with the same game name exists, add a new object to progress
				const newProgress = [
					...prevProgress,
					{
						game: game,
						progress: [
							{
								questionId,
								completed,
							},
						],
					},
				];
				localStorage.setItem("progress", JSON.stringify(newProgress));

				// Check if the current round is completed
				if (checkIfCompleted(newProgress, game, questionId)) {
					onRoundComplete(game);
				}
				return newProgress;
			}
		});
	};

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
	 * Check if completed
	 */
	const checkIfCompleted = (
		_progress: any,
		game: GameName,
		questionId: number
	) => {
		const questionStatus = getQuestionStatus(game, questionId, _progress);
		return questionStatus?.completed?.length === roundLength;
	};

	/**
	 * On round complete
	 */
	const onRoundComplete = (game: GameName) => {
		// Check if all rounds are completed
		if (currentRoundIndex === numberOfRounds - 1) {
			setAllRoundsCompleted(true);
		} else {
			// Set round complete, just temporary, to show success message
			setRoundComplete(true);
			// Reset errors
			updateErrors(game, [], false);
			// Go to next round
			localStorage.setItem(
				"currentRoundIndex",
				JSON.stringify(currentRoundIndex + 1)
			);
		}
		// TODO: Set points in firebase
	};

	/**
	 * On round fail
	 */
	const onRoundFail = (game: GameName) => {
		setRoundFailed(true);
		if (currentRoundIndex !== numberOfRounds - 1) {
			// Reset errors
			updateErrors(game, [], false);
			// Go to next round
			localStorage.setItem(
				"currentRoundIndex",
				JSON.stringify(currentRoundIndex + 1)
			);
		}
	};

	return {
		progress,
		updateProgress,
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
		setNumberOfRounds,
		allRoundsCompleted,
		onRoundFail,
	};
};

export default useProgress;
