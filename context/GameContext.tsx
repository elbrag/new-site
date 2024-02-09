import { createContext } from "react";
import gamesData from "../lib/data/gamesData.json";
import { GameName, GameProps } from "@/lib/types/game";
import useScore from "@/hooks/useScore";
import useUser from "@/hooks/useUser";
import useProgress from "@/hooks/useProgress";
import useErrors from "@/hooks/useErrors";
interface GameContextProps {
	gameUrls: string[];
	currentScore: number;
	updateScore: (_incoming: number) => void;
	username: string | null;
	updateUsername: (_username: string) => void;
	//TODO: type
	progress: any;
	updateProgress: (_game: GameName, questionId: number, completed: any) => void;
	getGameProgress: (_game: GameName) => any;
	currentRoundIndex: number;
	setCurrentRoundIndex: (index: number) => void;
	getQuestionStatus: (_game: GameName, questionId: number) => any;
	getGameErrors: (_game: GameName) => any;
	errors: any;
	updateErrors: (_game: GameName, error: any, merge: boolean) => void;
	roundLength: number | null;
	setRoundLength: (roundLength: number) => void;
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
	progress: {},
	updateProgress: () => {},
	currentRoundIndex: 0,
	setCurrentRoundIndex: () => {},
	getGameProgress: () => {},
	getQuestionStatus: () => {},
	getGameErrors: () => {},
	errors: [],
	updateErrors: () => {},
	roundLength: null,
	setRoundLength: () => {},
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
	const {
		progress,
		updateProgress,
		roundLength,
		setRoundLength,
		getGameProgress,
		currentRoundIndex,
		setCurrentRoundIndex,
		getQuestionStatus,
		roundComplete,
		setRoundComplete,
		roundFailed,
		setRoundFailed,
		onRoundFail,
		setNumberOfRounds,
		allRoundsPassed,
	} = useProgress();
	const { updateErrors, errors, getGameErrors } = useErrors();

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
				roundComplete,
				setRoundComplete,
				roundFailed,
				setRoundFailed,
				onRoundFail,
				currentRoundIndex,
				setCurrentRoundIndex,
				setNumberOfRounds,
				allRoundsPassed,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
