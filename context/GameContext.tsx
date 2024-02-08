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
	updateProgress: (_progress: any) => void;
	getGameProgress: (_game: GameName) => any;
	getQuestionStatus: (_game: GameName, questionId: number) => any;
	getGameErrors: (_game: GameName) => any;
	updateErrors: (_incoming: any, merge: boolean) => void;
}

export const GameContext = createContext<GameContextProps>({
	gameUrls: [],
	currentScore: 0,
	updateScore: () => {},
	username: null,
	updateUsername: () => {},
	progress: {},
	updateProgress: () => {},
	getGameProgress: () => {},
	getQuestionStatus: () => {},
	getGameErrors: () => {},
	updateErrors: () => {},
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
	const { progress, updateProgress, getGameProgress, getQuestionStatus } =
		useProgress();
	const { updateErrors, getGameErrors } = useErrors();

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
				updateErrors,
				getGameErrors,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
