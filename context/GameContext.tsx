/**
 * Game Context
 *
 * Central place for several other contexts and hooks
 */

import { createContext, useContext } from "react";
import gamesData from "../lib/data/gamesData.json";
import { GameName, GameProps } from "@/lib/types/game";

import {
	HangmanProgressCompletedProps,
	ProgressProps,
	ProgressRoundProps,
} from "@/lib/types/progress";
import useInfoMessage from "@/hooks/useInfoMessage";
import { FirebaseContext } from "./FirebaseContext";
import { RoundContext } from "./RoundContext";
import { ErrorContext } from "./ErrorContext";
import { ProgressContext } from "./ProgressContext";
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
	updateProgress: (
		_game: GameName,
		roundId: number,
		completed: HangmanProgressCompletedProps[]
	) => void;
	scoreMessage: string | null;
	onRoundFail: (_game: GameName) => void;
	resetRound: (game: GameName, roundId: number) => void;
}

export const GameContext = createContext<GameContextProps>({
	gameUrls: [],
	currentScore: 0,
	username: null,
	updateUsernameInFirebase: () => {},
	updateProgress: () => {},
	scoreMessage: null,
	onRoundFail: () => {},
	resetRound: () => {},
});

interface GameContextProviderProps {
	children: React.ReactNode;
}

const GameContextProvider = ({ children }: GameContextProviderProps) => {
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
		setRoundFailed,
		roundLength,
	} = useContext(RoundContext);

	const { setProgress, getRoundStatus } = useContext(ProgressContext);

	const { updateErrors } = useContext(ErrorContext);

	const { updateUserData } = useUserData();

	/**
	 * Check if completed
	 */
	const checkIfCompleted = (
		_progress: ProgressProps[],
		game: GameName,
		roundId: number
	) => {
		const roundStatus = getRoundStatus(game, roundId, _progress);
		return roundStatus?.completed?.length === roundLength;
	};

	/**
	 * On round end
	 *
	 * Checks if all rounds have passed
	 * Calls onRoundFinish (either with or without moving to next round)
	 * Resets errors
	 */
	const onRoundEnd = (game: GameName) => {
		// Get current round index
		const currentRoundIndex = getGameCurrentRoundIndex(game);
		// Check if all rounds are completed
		if (currentRoundIndex === numberOfRounds - 1) {
			console.log("seems to be the last round");
			setAllRoundsPassed(true);
			// Finish round
			setTimeout(() => {
				onRoundFinish(firebaseDatabase, userId, game, currentRoundIndex);
			}, 1000);
			setTimeout(() => {
				setAllRoundsPassed(false);
			}, 5500);
		} else {
			// Reset errors
			updateErrors(firebaseDatabase, userId, game, [], false);
			// Finish round. Set goToNextRound to true
			setTimeout(() => {
				onRoundFinish(firebaseDatabase, userId, game, currentRoundIndex, true);
			}, 1000);
		}
	};

	/**
	 * On round complete
	 */
	const onRoundComplete = (game: GameName) => {
		console.log("Round complete");

		// Set round complete, just temporary, to show success message
		setRoundComplete(true);
		setTimeout(() => {
			setRoundComplete(false);
		}, 5500);

		// End round
		onRoundEnd(game);

		// Send score to Firebase
		updateScore(game);
	};

	/**
	 * On round fail
	 */
	const onRoundFail = (game: GameName) => {
		console.log("Round fail");
		// Set round failed, just temporary, to show success message
		setRoundFailed(true);
		setTimeout(() => {
			setRoundFailed(false);
		}, 5500);

		// End round
		onRoundEnd(game);
	};

	/**
	 * Update progress
	 */
	const updateProgress = async (
		game: GameName,
		roundId: number,
		completed: HangmanProgressCompletedProps[] | []
	) => {
		if (!firebaseDatabase) return firebaseDatabaseIsMissing;
		if (!userId) return userIdIsMissing;
		const shouldReset = Array.isArray(completed) && completed.length === 0;

		await setProgress((prevProgress: ProgressProps[]) => {
			// Find the index of the object with the same game name
			const existingGameIndex = prevProgress.findIndex(
				(item: ProgressProps) => item.game === game
			);

			// If an object with the same game name exists
			if (existingGameIndex !== -1) {
				const updatedProgress = prevProgress.map(
					(item: ProgressProps, index: number) => {
						if (index === existingGameIndex) {
							// Find the index of the progress item with the same roundId
							const existingRoundIndex = item.rounds.findIndex(
								(progressItem: ProgressRoundProps) =>
									progressItem.roundId === roundId
							);

							// If a progress item with the same roundId exists, update its completed data
							if (existingRoundIndex !== -1) {
								return {
									...item,
									rounds: item.rounds.map(
										(progressItem: ProgressRoundProps) => {
											if (progressItem.roundId === roundId) {
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
								// If no progress item with the same roundId exists, add a new progress item
								return {
									...item,
									rounds: [
										...item.rounds,
										{
											roundId,
											completed,
										},
									],
								};
							}
						}
						return item;
					}
				);
				updateUserData(
					firebaseDatabase,
					userId,
					"progress",
					JSON.stringify(updatedProgress)
				);

				// Check if the current round is completed
				if (checkIfCompleted(updatedProgress, game, roundId)) {
					onRoundComplete(game);
				}

				return updatedProgress;
			} else {
				// If no object with the same game name exists, add a new object to progress
				const newProgress = [
					...prevProgress,
					{
						game: game,
						rounds: [
							{
								roundId,
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
				if (checkIfCompleted(newProgress, game, roundId)) {
					onRoundComplete(game);
				}
				return newProgress;
			}
		});
	};

	/**
	 * Reset round progress and errors
	 */
	const resetRound = (game: GameName, roundId: number) => {
		updateErrors(firebaseDatabase, userId, game, [], false);
		updateProgress(game, roundId, []);
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
				updateProgress,
				scoreMessage,
				onRoundFail,
				resetRound,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
