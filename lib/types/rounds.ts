import { GameName } from "./game";

export interface CurrentRoundIndexProps {
	game: GameName;
	currentRoundIndex: number;
}

export interface CompletedRoundIndexesProps {
	game: GameName;
	completedRoundIndexes: number[];
}

export interface RoundProps {
	roundId: string;
	description: string;
}

export interface HangmanMaskedRoundProps extends RoundProps {
	maskedWord: number[];
}

export interface HangmanRevealedRoundProps extends RoundProps {
	answer: string;
}
