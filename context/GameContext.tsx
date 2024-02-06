import { createContext } from "react";
import gamesData from "../lib/db/gamesData.json";
import { GameProps } from "@/lib/types/game";
interface GameContextProps {
	gameUrls: string[];
}

export const GameContext = createContext<GameContextProps>({ gameUrls: [] });

interface CategoryPageProviderProps {
	children: React.ReactNode;
}

const GameContextProvider = ({ children }: CategoryPageProviderProps) => {
	const gameUrls = gamesData.map((game: GameProps) => game.url);

	return (
		<GameContext.Provider value={{ gameUrls }}>{children}</GameContext.Provider>
	);
};

export default GameContextProvider;
