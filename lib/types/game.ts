import { HangmanMaskedRoundProps, MemoryInitialImagesProps } from "./rounds";

export enum GameName {
	Hangman = "hangman",
	Memory = "memory",
	Puzzle = "puzzle",
	SendResults = "send-results",
}

export interface GameProps {
	url: string;
	title: string;
	scorePerRound: number;
}

export interface HangmanGameData {
	maskedWords: HangmanMaskedRoundProps[];
}

export interface MemoryGameData {
	cardCount: number;
}
