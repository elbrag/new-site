import { GameName } from "@/lib/types/game";
import { useEffect, useState } from "react";

const useProgress = () => {
	const [progress, setProgress] = useState<any[]>([]);

	useEffect(() => {
		const storedProgress = localStorage.getItem("progress");
		if (storedProgress) setProgress(JSON.parse(storedProgress));
	}, []);

	const updateProgress = async (incoming: any) => {
		setProgress((prevProgress) => {
			// If prevProgress is not an array, initialize it as an empty array
			const prevArray = Array.isArray(prevProgress) ? prevProgress : [];

			// Check if an object with the same questionId exists in prevArray
			const existingIndex = prevArray.findIndex(
				(item) =>
					item.game === incoming.game &&
					item.progress.some(
						(progressItem: any) =>
							progressItem.questionId === incoming.progress[0].questionId
					)
			);

			// If an object with the same questionId exists, update its completed data
			if (existingIndex !== -1) {
				const updatedProgress = prevArray.map((item, index) => {
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
				localStorage.setItem("progress", JSON.stringify(updatedProgress)); // Update local storage
				return updatedProgress;
			}

			// If no object with the same questionId exists, add the incoming object to prevArray
			const newProgress = [...prevArray, incoming];
			localStorage.setItem("progress", JSON.stringify(newProgress)); // Update local storage
			return newProgress;
		});
	};

	// Game specific progress
	const getGameProgress = (game: GameName) => {
		return progress.find((p: any) => p.game === game)?.progress ?? [];
	};

	// Get question progress
	const getQuestionStatus = (game: GameName, questionId: number) => {
		return (
			getGameProgress(game)?.find((p: any) => p.questionId === questionId) ??
			null
		);
	};

	return { progress, updateProgress, getGameProgress, getQuestionStatus };
};

export default useProgress;
