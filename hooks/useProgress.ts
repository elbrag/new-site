import { GameName } from "@/lib/types/game";
import { useEffect, useState } from "react";

const useProgress = () => {
	const [progress, setProgress] = useState<any[]>([]);

	useEffect(() => {
		// Keep state synced with local storage values
		const storedProgress = localStorage.getItem("progress");
		if (storedProgress) setProgress(JSON.parse(storedProgress));
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

	return {
		progress,
		setProgress,
		getGameProgress,
		getQuestionStatus,
	};
};

export default useProgress;
