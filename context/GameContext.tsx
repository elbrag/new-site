/**
 * Game Context
 *
 * Central place for several other contexts and hooks
 */

import { createContext, useContext, useEffect, useState } from "react";
import gamesData from "../lib/data/gamesData.json";
import { GameName, GameProps } from "@/lib/types/game";

import {
	HangmanProgressCompletedProps,
	MemoryProgressCompletedProps,
	ProgressProps,
	ProgressRoundProps,
	PuzzleCompletedProps,
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
import { useRouter } from "next/router";
interface GameContextProps {
	gameSlugs: GameName[];
	currentScore: number;
	username: string | null;
	updateUsernameInFirebase: (_username: string) => void;
	updateProgress: (
		_game: GameName,
		roundId: number,
		completed:
			| HangmanProgressCompletedProps[]
			| MemoryProgressCompletedProps
			| PuzzleCompletedProps
	) => void;
	scoreMessage: string | null;
	onRoundFail: (_game: GameName) => void;
	resetGame: (game: GameName, roundIds: number[]) => void;
}

export const GameContext = createContext<GameContextProps>({
	gameSlugs: [],
	currentScore: 0,
	username: null,
	updateUsernameInFirebase: () => {},
	updateProgress: () => {},
	scoreMessage: null,
	onRoundFail: () => {},
	resetGame: () => {},
});

interface GameContextProviderProps {
	children: React.ReactNode;
}

const GameContextProvider = ({ children }: GameContextProviderProps) => {
	// Game slugs from data
	const gameSlugs = gamesData.map((game) => game.slug as GameName);

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
		removeCompletedAndCurrentRoundIndexes,
	} = useContext(RoundContext);

	const { setProgress, getRoundStatus } = useContext(ProgressContext);

	const { updateErrors } = useContext(ErrorContext);

	const { updateUserData } = useUserData();

	const router = useRouter();

	/**
	 * Check if completed
	 */
	const checkIfCompleted = (
		_progress: ProgressProps[],
		game: GameName,
		roundId: number
	) => {
		const roundStatus = getRoundStatus(game, roundId, _progress);
		// For array types of progress
		if (Array.isArray(roundStatus?.completed)) {
			return roundStatus?.completed?.length === roundLength;
		}
		// For bool types of progress
		else if (typeof roundStatus?.completed === "boolean") {
			return roundStatus?.completed === true;
		}
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
	 * Ensure roundComplete does not linger on route
	 */
	useEffect(() => {
		setRoundComplete(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	/**
	 * On round fail
	 */
	const onRoundFail = (game: GameName) => {
		// Set round failed, just temporary, to show success message
		setRoundFailed(true);
		setTimeout(() => {
			setRoundFailed(false);
		}, 5500);

		// End round
		setTimeout(() => {
			onRoundEnd(game);
		}, 3000);
	};

	/**
	 * Update progress
	 */
	const updateProgress = async (
		game: GameName,
		roundId: number,
		completed:
			| HangmanProgressCompletedProps[]
			| MemoryProgressCompletedProps
			| PuzzleCompletedProps
	) => {
		if (!firebaseDatabase) return firebaseDatabaseIsMissing;
		if (!userId) return userIdIsMissing;
		const shouldReset =
			(Array.isArray(completed) && completed.length === 0) ||
			(!Array.isArray(completed) && completed === false);

		setProgress((prevProgress: ProgressProps[] | undefined) => {
			// Ensure the calculations always use the latest state
			const _prevProgress = prevProgress ?? [];
			// Find the index of the object with the same game name
			const existingGameIndex = _prevProgress.findIndex(
				(item: ProgressProps) => item.game === game
			);

			// If an object with the same game name exists
			if (existingGameIndex !== -1) {
				const updatedProgress = _prevProgress.map(
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
												// For array types of progress
												if (
													Array.isArray(progressItem?.completed) &&
													Array.isArray(completed)
												) {
													return {
														...progressItem,
														completed: shouldReset
															? []
															: [...progressItem.completed, ...completed],
													};
												}
												// For bool types of progress
												else {
													return {
														...progressItem,
														completed: shouldReset ? false : completed,
													};
												}
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
					..._prevProgress,
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
	 * Reset game
	 */
	const resetGame = async (game: GameName, roundIds: number[]) => {
		updateErrors(firebaseDatabase, userId, game, [], false);
		const resetObject = game === GameName.Hangman ? [] : false;
		roundIds.forEach((roundId) => {
			updateProgress(game, roundId, resetObject);
		});
		removeCompletedAndCurrentRoundIndexes(game, firebaseDatabase, userId);
	};

	/**
	 * Update score
	 *
	 * Calculate score for game and pass score on to updateScoreInFirebase
	 */
	const updateScore = (game: GameName) => {
		const gameToScore = gamesData.find((data) => data.slug === game);
		const score = gameToScore ? gameToScore.scorePerRound : null;
		if (score) {
			updateScoreInFirebase(score);
			updateScoreMessage(`+${score}`);
		}
	};

	return (
		<GameContext.Provider
			value={{
				gameSlugs,
				currentScore,
				username,
				updateUsernameInFirebase,
				updateProgress,
				scoreMessage,
				onRoundFail,
				resetGame,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
