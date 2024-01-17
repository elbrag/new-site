import { createContext } from "react";

interface GameContextProps {
	gameUrls: string[];
}

export const GameContext = createContext<GameContextProps>({ gameUrls: [] });

interface CategoryPageProviderProps {
	children: React.ReactNode;
}

const GameContextProvider = ({ children }: CategoryPageProviderProps) => {
	const gameUrls = ["puzzle", "memory", "hangman", "/", "/", "send-results"];

	return (
		<GameContext.Provider value={{ gameUrls }}>{children}</GameContext.Provider>
	);
};

export default GameContextProvider;
