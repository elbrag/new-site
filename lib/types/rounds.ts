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
	roundId: number;
	description: string;
}

export interface HangmanMaskedRoundProps extends RoundProps {
	maskedWord: number[];
}

export interface HangmanRevealedRoundProps extends RoundProps {
	answer: string;
}

export interface MemoryImageProps {
	url: string;
	slotIndexes?: number[];
}

export interface MemoryRoundProps extends RoundProps {
	subtitle?: string;
	images: MemoryImageProps[];
}
