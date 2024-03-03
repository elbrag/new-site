import { createContext, useContext } from "react";
import gamesData from "../lib/data/gamesData.json";
import { GameName, GameProps } from "@/lib/types/game";

import useProgress from "@/hooks/useProgress";
import useErrors from "@/hooks/useErrors";
import useRounds from "@/hooks/useRounds";
import {
	HangmanProgressCompletedProps,
	ProgressProps,
	ProgressQuestionProps,
} from "@/lib/types/progress";
import { ErrorProps } from "@/lib/types/errors";
import useInfoMessage from "@/hooks/useInfoMessage";
import { FirebaseContext } from "./FirebaseContext";
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
	updateErrors: (_game: GameName, error: string | [], merge: boolean) => void;
	roundLength: number | null;
	setRoundLength: (roundLength: number) => void;
	updateCurrentRoundIndexes: (game: GameName, roundIndex: number) => void;
	getGameCurrentRoundIndex: (game: GameName) => number;
	roundComplete: boolean;
	setRoundComplete: (complete: boolean) => void;
	roundFailed: boolean;
	setRoundFailed: (failed: boolean) => void;
	onRoundFail: (_game: GameName) => void;
	numberOfRounds: number;
	setNumberOfRounds: (numberOfRounds: number) => void;
	allRoundsPassed: boolean;
	resetRound: (game: GameName, questionId: number) => void;
	scoreMessage: string | null;
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
	roundLength: null,
	setRoundLength: () => {},
	updateCurrentRoundIndexes: () => {},
	getGameCurrentRoundIndex: () => 0,
	roundComplete: false,
	setRoundComplete: () => {},
	roundFailed: false,
	setRoundFailed: () => {},
	onRoundFail: () => {},
	numberOfRounds: 0,
	setNumberOfRounds: () => {},
	allRoundsPassed: false,
	resetRound: () => {},
	scoreMessage: null,
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
	} = useContext(FirebaseContext);
	const { progress, setProgress, getGameProgress, getQuestionStatus } =
		useProgress();
	const {
		roundLength,
		setRoundLength,
		updateCurrentRoundIndexes,
		getGameCurrentRoundIndex,
		roundComplete,
		setRoundComplete,
		roundFailed,
		setRoundFailed,
		numberOfRounds,
		setNumberOfRounds,
		allRoundsPassed,
		setAllRoundsPassed,
	} = useRounds();
	const { updateErrors, errors, getGameErrors } = useErrors();

	/**
	 * On round complete
	 */
	const onRoundComplete = (game: GameName) => {
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
			updateErrors(game, [], false);
			// Go to next round
			setTimeout(() => {
				updateCurrentRoundIndexes(game, currentRoundIndex + 1);
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
			updateErrors(game, [], false);
			// Go to next round
			setTimeout(() => {
				updateCurrentRoundIndexes(game, currentRoundIndex + 1);
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
		const shouldReset = Array.isArray(completed) && completed.length === 0;

		await setProgress((prevProgress) => {
			// Find the index of the object with the same game name
			const existingGameIndex = prevProgress.findIndex(
				(item) => item.game === game
			);

			// If an object with the same game name exists
			if (existingGameIndex !== -1) {
				const updatedProgress = prevProgress.map((item, index) => {
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
				localStorage.setItem("progress", JSON.stringify(updatedProgress));

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
				localStorage.setItem("progress", JSON.stringify(newProgress));

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
		updateErrors(game, [], false);
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
				roundLength,
				setRoundLength,
				updateCurrentRoundIndexes,
				getGameCurrentRoundIndex,
				roundComplete,
				setRoundComplete,
				roundFailed,
				setRoundFailed,
				onRoundFail,
				numberOfRounds,
				setNumberOfRounds,
				allRoundsPassed,
				resetRound,
				scoreMessage,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
