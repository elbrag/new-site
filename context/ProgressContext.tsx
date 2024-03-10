import useUserData from "@/hooks/firebase/useUserData";
import {
	firebaseDatabaseIsMissing,
	userIdIsMissing,
} from "@/lib/helpers/errorThrowMessages";
import { CurrentRoundIndexProps } from "@/lib/types/currentRoundIndex";
import {
	FirebaseDatabaseProps,
	FirebaseUserIdProps,
} from "@/lib/types/firebase";
import { GameName } from "@/lib/types/game";
import {
	HangmanProgressCompletedProps,
	ProgressProps,
	ProgressQuestionProps,
} from "@/lib/types/progress";
import { Database } from "firebase/database";
import { createContext, useEffect, useState } from "react";

interface ProgressContextProps {
	progress: ProgressProps[];
	setProgress: (progress: any) => void;
	getGameProgress: (_game: GameName) => ProgressQuestionProps[];
	getQuestionStatus: (
		_game: GameName,
		questionId: number,
		_progress?: ProgressProps[]
	) => ProgressQuestionProps | null;
	updateProgressState: (firebaseDatabase: Database, userId: string) => void;
}

export const ProgressContext = createContext<ProgressContextProps>({
	progress: [],
	setProgress: () => {},
	getGameProgress: () => [],
	getQuestionStatus: () => null,
	updateProgressState: () => {},
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
	 * Update progress state
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

	return (
		<ProgressContext.Provider
			value={{
				progress,
				setProgress,
				getGameProgress,
				getQuestionStatus,
				updateProgressState,
			}}
		>
			{children}
		</ProgressContext.Provider>
	);
};

export default ProgressContextProvider;
