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

export interface MemoryInitialImagesProps {
	roundId: string;
	imageUrl: string;
}

export interface MemoryRevealedCardsProps extends RoundProps {}
