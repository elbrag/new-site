import { createContext } from "react";
import gamesData from "../lib/db/gamesData.json";
import { GameProps } from "@/lib/types/game";
import useScore from "@/hooks/useScore";
import useUser from "@/hooks/useUser";
interface GameContextProps {
	gameUrls: string[];
	currentScore: number;
	updateScore: (_incoming: number) => void;
	username: string | null;
	updateUsername: (_username: string) => void;
}

export const GameContext = createContext<GameContextProps>({
	gameUrls: [],
	currentScore: 0,
	updateScore: () => {},
	username: null,
	updateUsername: () => {},
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

	return (
		<GameContext.Provider
			value={{
				gameUrls,
				currentScore,
				updateScore,
				username,
				updateUsername,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
