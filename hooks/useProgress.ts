import { GameName } from "@/lib/types/game";
import { useEffect, useRef, useState } from "react";
import useInfoMessage from "./useInfoMessage";

const useProgress = () => {
	const [progress, setProgress] = useState<any[]>([]);
	const [roundLength, setRoundLength] = useState<number | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [roundFailed, setRoundFailed] = useState(false);
	const { successMessage, updateSuccessMessage } = useInfoMessage();

	useEffect(() => {
		// Keep state synced with local storage values
		const storedProgress = localStorage.getItem("progress");
		if (storedProgress) setProgress(JSON.parse(storedProgress));
	}, []);

	/**
	 * Update progress
	 */
	const updateProgress = async (incoming: any) => {
		setRoundComplete(false);
		await setProgress((prevProgress) => {
			// Check if an object with the same questionId exists in prevProgress
			const existingIndex = prevProgress.findIndex(
				(item) =>
					item.game === incoming.game &&
					item.progress.some(
						(progressItem: any) =>
							progressItem.questionId === incoming.progress[0].questionId
					)
			);

			// If an object with the same questionId exists, update its completed data
			if (existingIndex !== -1) {
				const updatedProgress = prevProgress.map((item, index) => {
					if (index === existingIndex) {
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
					}
					return item;
				});
				localStorage.setItem("progress", JSON.stringify(updatedProgress));
				checkIfCompleted(
					updatedProgress,
					incoming.game,
					incoming.progress[0].questionId
				);

				return updatedProgress;
			}
			// If no object with the same questionId exists, add the incoming object to progress
			const newProgress = [...prevProgress, incoming];
			localStorage.setItem("progress", JSON.stringify(newProgress));
			checkIfCompleted(
				newProgress,
				incoming.game,
				incoming.progress[0].questionId
			);
			return newProgress;
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
		return (
			getGameProgress(game, _progress)?.find(
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
		if (questionStatus?.completed?.length === roundLength) {
			setRoundComplete(true);
		}
	};

	/**
	 * Round complete watcher
	 */

	return {
		progress,
		updateProgress,
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
