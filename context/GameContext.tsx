import { createContext } from "react";
import gamesData from "../lib/db/gamesData.json";
import { GameProps } from "@/lib/types/game";
import useScore from "@/hooks/useScore";
interface GameContextProps {
	gameUrls: string[];
	currentScore: number;
	updateScore: (_incoming: number) => void;
}

export const GameContext = createContext<GameContextProps>({
	gameUrls: [],
	currentScore: 0,
	updateScore: () => {},
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

	return (
		<GameContext.Provider value={{ gameUrls, currentScore, updateScore }}>
			{children}
		</GameContext.Provider>
	);
};

export default GameContextProvider;
