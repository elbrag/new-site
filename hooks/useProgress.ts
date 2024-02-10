import { GameName } from "@/lib/types/game";
import { ProgressProps, ProgressQuestionProps } from "@/lib/types/progress";
import { useEffect, useState } from "react";

const useProgress = () => {
	const [progress, setProgress] = useState<ProgressProps[]>([]);

	useEffect(() => {
		// Keep state synced with local storage values
		const storedProgress = localStorage.getItem("progress");
		if (storedProgress) setProgress(JSON.parse(storedProgress));
	}, []);

	/**
	 * Get game specific progress
	 */
	const getGameProgress = (
		game: GameName,
		_progress?: ProgressProps[]
	): ProgressQuestionProps[] => {
		return (
			(_progress ?? progress).find((p: ProgressProps) => p.game === game)
				?.questions ?? []
		);
	};

	/**
	 * Get question specific current status
	 */
	const getQuestionStatus = (
		game: GameName,
		questionId: number,
		_progress?: ProgressProps[]
	): ProgressQuestionProps | null => {
		const progressObj = _progress ?? progress;
		return (
			getGameProgress(game, progressObj)?.find(
				(p: ProgressQuestionProps) => p.questionId === questionId
			) ?? null
		);
	};

	return {
		progress,
		setProgress,
		getGameProgress,
		getQuestionStatus,
	};
};

export default useProgress;
