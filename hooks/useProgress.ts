import { GameName } from "@/lib/types/game";
import { useEffect, useRef, useState } from "react";
import useInfoMessage from "./useInfoMessage";

const useProgress = () => {
	const [progress, setProgress] = useState<any[]>([]);
	const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
	const [roundLength, setRoundLength] = useState<number | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [roundFailed, setRoundFailed] = useState(false);
	const { successMessage, updateSuccessMessage } = useInfoMessage();

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
	const updateProgress = async (incoming: any) => {
		setRoundComplete(false);
		await setProgress((prevProgress) => {
			// Find the index of the object with the same game name
			const existingGameIndex = prevProgress.findIndex(
				(item) => item.game === incoming.game
			);

			// If an object with the same game name exists
			if (existingGameIndex !== -1) {
				const updatedProgress = prevProgress.map((item, index) => {
					if (index === existingGameIndex) {
						// Find the index of the progress item with the same questionId
						const existingQuestionIndex = item.progress.findIndex(
							(progressItem: any) =>
								progressItem.questionId === incoming.progress[0].questionId
						);

						// If a progress item with the same questionId exists, update its completed data
						if (existingQuestionIndex !== -1) {
							return {
								...item,
								progress: item.progress.map((progressItem: any) => {
									if (
										progressItem.questionId === incoming.progress[0].questionId
									) {
										return {
											...progressItem,
											completed: [
												...progressItem.completed,
												...incoming.progress[0].completed,
											],
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
										questionId: incoming.progress[0].questionId,
										completed: incoming.progress[0].completed,
									},
								],
							};
						}
					}
					return item;
				});
				localStorage.setItem("progress", JSON.stringify(updatedProgress));

				// Check if the current round is completed
				if (
					checkIfCompleted(
						updatedProgress,
						incoming.game,
						incoming.progress[0].questionId
					)
				) {
					setRoundComplete(true);
					localStorage.setItem(
						"currentRoundIndex",
						JSON.stringify(currentRoundIndex + 1)
					);
				}

				return updatedProgress;
			} else {
				// If no object with the same game name exists, add a new object to progress
				const newProgress = [
					...prevProgress,
					{
						game: incoming.game,
						progress: [
							{
								questionId: incoming.progress[0].questionId,
								completed: incoming.progress[0].completed,
							},
						],
					},
				];
				localStorage.setItem("progress", JSON.stringify(newProgress));

				// Check if the current round is completed
				if (
					checkIfCompleted(
						newProgress,
						incoming.game,
						incoming.progress[0].questionId
					)
				) {
					setRoundComplete(true);
					localStorage.setItem(
						"currentRoundIndex",
						JSON.stringify(currentRoundIndex + 1)
					);
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

	const updateCurrentRoundIndex = (game: GameName, maskedWords: any) => {
		const failedRounds = null;
		const wonRounds = null;

		const firstIncompleteRound = maskedWords.find((p: any, i: number) => {
			return !checkIfCompleted(progress, game, p.questionId);
		});
		return firstIncompleteRound ? maskedWords.indexOf(firstIncompleteRound) : 0;
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
	};
};

export default useProgress;
