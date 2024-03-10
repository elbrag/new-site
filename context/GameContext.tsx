import { createContext, useContext, useEffect } from "react";
import gamesData from "../lib/data/gamesData.json";
import { GameName, GameProps } from "@/lib/types/game";

import {
	HangmanProgressCompletedProps,
	ProgressProps,
	ProgressQuestionProps,
} from "@/lib/types/progress";
import { ErrorProps } from "@/lib/types/errors";
import useInfoMessage from "@/hooks/useInfoMessage";
import { FirebaseContext } from "./FirebaseContext";
import { RoundContext } from "./RoundContext";
import { ErrorContext } from "./ErrorContext";
import { ProgressContext } from "./ProgressContext";
import {
	FirebaseDatabaseProps,
	FirebaseUserIdProps,
} from "@/lib/types/firebase";
import useUserData from "@/hooks/firebase/useUserData";
import {
	firebaseDatabaseIsMissing,
	userIdIsMissing,
} from "@/lib/helpers/errorThrowMessages";
interface GameContextProps {
	gameUrls: string[];
	currentScore: number;
	username: string | null;
	updateUsernameInFirebase: (_username: string) => void;
	progress: ProgressProps[];
	updateProgress: (
		_game: GameName,
		questionId: number,
		completed: HangmanProgressCompletedProps[]
	) => void;
	getGameProgress: (_game: GameName) => ProgressQuestionProps[];
	getQuestionStatus: (
		_game: GameName,
		questionId: number
	) => ProgressQuestionProps | null;
	getGameErrors: (_game: GameName) => string[];
	errors: ErrorProps[];
	updateErrors: (
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps,
		_game: GameName,
		error: string | [],
		merge: boolean
	) => void;
	scoreMessage: string | null;
	onRoundFail: (_game: GameName) => void;
}

export const GameContext = createContext<GameContextProps>({
	gameUrls: [],
	currentScore: 0,
	username: null,
	updateUsernameInFirebase: () => {},
	progress: [],
	updateProgress: () => {},
	getGameProgress: () => [],
	getQuestionStatus: () => null,
	getGameErrors: () => [],
	errors: [],
	updateErrors: () => {},
	scoreMessage: null,
	onRoundFail: () => {},
});

interface GameContextProviderProps {
	children: React.ReactNode;
}

const GameContextProvider = ({ children }: GameContextProviderProps) => {
	/**
	 * Variables
	 */

	// Game urls from data
	const gameUrls = gamesData.map((game: GameProps) => game.url);

	/**
	 * Hooks
	 */
	const { scoreMessage, updateScoreMessage } = useInfoMessage();
	const {
		username,
		updateUsernameInFirebase,
		currentScore,
		updateScoreInFirebase,
		firebaseDatabase,
		userId,
	} = useContext(FirebaseContext);

	const {
		setRoundComplete,
		getGameCurrentRoundIndex,
		numberOfRounds,
		setAllRoundsPassed,
		onRoundFinish,
		roundFailed,
		setRoundFailed,
		roundLength,
	} = useContext(RoundContext);

	const { progress, setProgress, getGameProgress, getQuestionStatus } =
		useContext(ProgressContext);

	const { updateErrors, errors, getGameErrors } = useContext(ErrorContext);

	const { updateUserData } = useUserData();

	/**
	 * On round complete
	 */
	const onRoundComplete = (game: GameName) => {
		console.log("onRoundComplete");
		// Set round complete, just temporary, to show success message
		setRoundComplete(true);
		setTimeout(() => {
			setRoundComplete(false);
		}, 5500);
		// Get current round index
		const currentRoundIndex = getGameCurrentRoundIndex(game);
		// Check if all rounds are completed
		if (currentRoundIndex === numberOfRounds - 1) {
			setAllRoundsPassed(true);
			setTimeout(() => {
				setAllRoundsPassed(false);
			}, 5500);
		} else {
			// Reset errors
			updateErrors(firebaseDatabase, userId, game, [], false);
			// Go to next round
			setTimeout(() => {
				onRoundFinish(firebaseDatabase, userId, game, currentRoundIndex + 1);
			}, 1000);
		}
		// Send score to Firebase
		updateScore(game);
	};

	/**
	 * Check if completed
	 */
	const checkIfCompleted = (
		_progress: ProgressProps[],
		game: GameName,
		questionId: number
	) => {
		const questionStatus = getQuestionStatus(game, questionId, _progress);
		return questionStatus?.completed?.length === roundLength;
	};

	/**
	 * On round fail
	 */
	const onRoundFail = (game: GameName) => {
		// Set round failed, just temporary, to show success message
		setRoundFailed(true);
		setTimeout(() => {
			setRoundFailed(false);
		}, 5500);
		// Get current round index
		const currentRoundIndex = getGameCurrentRoundIndex(game);
		if (currentRoundIndex === numberOfRounds - 1) {
			setAllRoundsPassed(true);
			setTimeout(() => {
				setAllRoundsPassed(false);
			}, 5500);
		} else {
			// Reset errors
			updateErrors(firebaseDatabase, userId, game, [], false);
			// Go to next round
			setTimeout(() => {
				onRoundFinish(firebaseDatabase, userId, game, currentRoundIndex + 1);
			}, 1000);
		}
	};

	/**
	 * Update progress
	 */
	const updateProgress = async (
		game: GameName,
		questionId: number,
		completed: HangmanProgressCompletedProps[] | []
	) => {
		if (!firebaseDatabase) return firebaseDatabaseIsMissing;
		if (!userId) return userIdIsMissing;
		const shouldReset = Array.isArray(completed) && completed.length === 0;

		await setProgress((prevProgress: any) => {
			// Find the index of the object with the same game name
			const existingGameIndex = prevProgress.findIndex(
				(item: any) => item.game === game
			);

			// If an object with the same game name exists
			if (existingGameIndex !== -1) {
				const updatedProgress = prevProgress.map((item: any, index: number) => {
					if (index === existingGameIndex) {
						// Find the index of the progress item with the same questionId
						const existingQuestionIndex = item.questions.findIndex(
							(progressItem: ProgressQuestionProps) =>
								progressItem.questionId === questionId
						);

						// If a progress item with the same questionId exists, update its completed data
						if (existingQuestionIndex !== -1) {
							return {
								...item,
								questions: item.questions.map(
									(progressItem: ProgressQuestionProps) => {
										if (progressItem.questionId === questionId) {
											return {
												...progressItem,
												completed: shouldReset
													? []
													: [...progressItem.completed, ...completed],
											};
										}
										return progressItem;
									}
								),
							};
						} else {
							// If no progress item with the same questionId exists, add a new progress item
							return {
								...item,
								questions: [
									...item.questions,
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
				updateUserData(
					firebaseDatabase,
					userId,
					"progress",
					JSON.stringify(updatedProgress)
				);

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
						questions: [
							{
								questionId,
								completed,
							},
						],
					},
				];
				updateUserData(
					firebaseDatabase,
					userId,
					"progress",
					JSON.stringify(newProgress)
				);

				// Check if the current round is completed
				if (checkIfCompleted(newProgress, game, questionId)) {
					onRoundComplete(game);
				}
				return newProgress;
			}
		});
	};

	/**
	 * Reset round progress and errors
	 */
	const resetRound = (game: GameName, questionId: number) => {
		updateErrors(firebaseDatabase, userId, game, [], false);
		updateProgress(game, questionId, []);
	};

	/**
	 * Update score
	 *
	 * Calculate score for game and pass score on to updateScoreInFirebase
	 */
	const updateScore = (game: GameName) => {
		const gameToScore = gamesData.find((data) => data.url === game);
		const score = gameToScore ? gameToScore.scorePerRound : null;
		if (score) {
			updateScoreInFirebase(score);
			updateScoreMessage(`+${score}`);
		}
	};

	return (
		<GameContext.Provider
			value={{
				gameUrls,
				currentScore,
				username,
				updateUsernameInFirebase,
				progress,
				updateProgress,
				getGameProgress,
				getQuestionStatus,
				errors,
				updateErrors,
				getGameErrors,
				scoreMessage,
				onRoundFail,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
