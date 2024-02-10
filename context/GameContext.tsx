import { createContext } from "react";
import gamesData from "../lib/data/gamesData.json";
import { GameName, GameProps } from "@/lib/types/game";
import useScore from "@/hooks/useScore";
import useUser from "@/hooks/useUser";
import useProgress from "@/hooks/useProgress";
import useErrors from "@/hooks/useErrors";
import useRounds from "@/hooks/useRounds";
import {
	HangmanProgressCompletedProps,
	ProgressProps,
	ProgressQuestionProps,
} from "@/lib/types/progress";
import { ErrorProps } from "@/lib/types/errors";
interface GameContextProps {
	gameUrls: string[];
	currentScore: number;
	updateScore: (_game: GameName) => void;
	username: string | null;
	updateUsername: (_username: string) => void;
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
	setNumberOfRounds: (numberOfRounds: number) => void;
	allRoundsPassed: boolean;
}

export const GameContext = createContext<GameContextProps>({
	gameUrls: [],
	currentScore: 0,
	updateScore: () => {},
	username: null,
	updateUsername: () => {},
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
	setNumberOfRounds: () => {},
	allRoundsPassed: false,
});

interface CategoryPageProviderProps {
	children: React.ReactNode;
}

const GameContextProvider = ({ children }: CategoryPageProviderProps) => {
	/**
	 * Variables
	 */

	// Game urls from data
	const gameUrls = gamesData.map((game: GameProps) => game.url);

	/**
	 * Hooks
	 */
	const { currentScore, updateScore } = useScore();
	const { username, updateUsername } = useUser();
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
		// Get current round index
		const currentRoundIndex = getGameCurrentRoundIndex(game);
		// Check if all rounds are completed
		if (currentRoundIndex === numberOfRounds - 1) {
			setAllRoundsPassed(true);
		} else {
			// Reset errors
			updateErrors(game, [], false);
			// Go to next round
			localStorage.setItem(
				"currentRoundIndex",
				JSON.stringify(currentRoundIndex + 1)
			);
			updateCurrentRoundIndexes(game, currentRoundIndex + 1);
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
		setRoundFailed(true);
		// Get current round index
		const currentRoundIndex = getGameCurrentRoundIndex(game);
		if (currentRoundIndex === numberOfRounds - 1) {
			setAllRoundsPassed(true);
		} else {
			// Reset errors
			updateErrors(game, [], false);
			// Go to next round
			localStorage.setItem(
				"currentRoundIndex",
				JSON.stringify(currentRoundIndex + 1)
			);
			updateCurrentRoundIndexes(game, currentRoundIndex + 1);
		}
	};

	/**
	 * Update progress
	 */
	const updateProgress = async (
		game: GameName,
		questionId: number,
		completed: HangmanProgressCompletedProps[]
	) => {
		setRoundComplete(false);
		setRoundFailed(false);

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
												completed: [...progressItem.completed, ...completed],
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

	return (
		<GameContext.Provider
			value={{
				gameUrls,
				currentScore,
				updateScore,
				username,
				updateUsername,
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
				setNumberOfRounds,
				allRoundsPassed,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
