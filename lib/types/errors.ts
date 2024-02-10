import { GameName } from "./game";

export interface ErrorProps {
	game: GameName;
	errors: string[];
}
