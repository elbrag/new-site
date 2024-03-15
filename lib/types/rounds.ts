import { GameName } from "./game";

export interface CurrentRoundIndexProps {
	game: GameName;
	currentRoundIndex: number;
}

export interface RoundProps {
	roundId: string;
	description: string;
}

export interface HangmanRoundProps extends RoundProps {
	maskedWord: number[];
}
