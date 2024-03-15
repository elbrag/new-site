/**
 * Progress context
 *
 * Manages "progress" data in Firebase
 */

import useUserData from "@/hooks/firebase/useUserData";
import { GameName } from "@/lib/types/game";
import { ProgressProps, ProgressRoundProps } from "@/lib/types/progress";
import { HangmanMaskedRoundProps } from "@/lib/types/rounds";
import { Database } from "firebase/database";
import { createContext, useState } from "react";

interface ProgressContextProps {
	progress: ProgressProps[];
	setProgress: (progress: any) => void;
	getGameProgress: (_game: GameName) => ProgressRoundProps[];
	getRoundStatus: (
		_game: GameName,
		roundId: number,
		_progress?: ProgressProps[]
	) => ProgressRoundProps | null;
	updateProgressState: (firebaseDatabase: Database, userId: string) => void;
	getCompletedRoundAnswers: (
		_game: GameName,
		maskedWords: HangmanMaskedRoundProps[]
	) => any;
}

export const ProgressContext = createContext<ProgressContextProps>({
	progress: [],
	setProgress: () => {},
	getGameProgress: () => [],
	getRoundStatus: () => null,
	updateProgressState: () => {},
	getCompletedRoundAnswers: () => {},
});

interface ProgressContextProviderProps {
	children: React.ReactNode;
}

const ProgressContextProvider = ({
	children,
}: ProgressContextProviderProps) => {
	const [progress, setProgress] = useState<ProgressProps[]>([]);
	const { getUserData } = useUserData();

	/**
	 * Update progress state from Firebase data
	 */
	const updateProgressState = async (
		firebaseDatabase: Database,
		userId: string
	) => {
		const storedProgress = await getUserData(
			firebaseDatabase,
			userId,
			"progress"
		);
		if (storedProgress?.length) {
			setProgress(JSON.parse(storedProgress));
		}
	};

	/**
	 * Get game specific progress
	 */
	const getGameProgress = (
		game: GameName,
		_progress?: ProgressProps[]
	): ProgressRoundProps[] => {
		return (
			(_progress ?? progress).find((p: ProgressProps) => p.game === game)
				?.rounds ?? []
		);
	};

	/**
	 * Get round specific current status
	 */
	const getRoundStatus = (
		game: GameName,
		roundId: number,
		_progress?: ProgressProps[]
	): ProgressRoundProps | null => {
		const progressObj = _progress ?? progress;
		return (
			getGameProgress(game, progressObj)?.find(
				(p: ProgressRoundProps) => p.roundId === roundId
			) ?? null
		);
	};

	/**
	 * Get completed round answers
	 */
	const getCompletedRoundAnswers = (
		game: GameName,
		maskedWords: HangmanMaskedRoundProps[]
	): Number[] => {
		const progress = getGameProgress(game);

		const completedRoundIds: Number[] = [];

		maskedWords.forEach((words) => {
			const nrOfChars = words.maskedWord.reduce(
				(acc: number, nr: number) => acc + nr
			);
			progress.forEach((p) => {
				if (
					p.completed?.length === nrOfChars &&
					!completedRoundIds.includes(p.roundId)
				) {
					completedRoundIds.push(p.roundId);
				}
			});
		});
		return completedRoundIds;
	};

	return (
		<ProgressContext.Provider
			value={{
				progress,
				setProgress,
				getGameProgress,
				getRoundStatus,
				updateProgressState,
				getCompletedRoundAnswers,
			}}
		>
			{children}
		</ProgressContext.Provider>
	);
};

export default ProgressContextProvider;
