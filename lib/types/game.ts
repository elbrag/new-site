import { HangmanMaskedRoundProps } from "./rounds";

export type GameData =
	| { maskedWords: HangmanMaskedRoundProps[] }
	| { cardCount: MemoryGameData["cardCount"] }
	| object;

export enum GameName {
	Hangman = "hangman",
	Memory = "memory",
	Puzzle = "puzzle",
	SendResults = "send-results",
	ComingSoon = "coming-soon",
}

export interface GameProps {
	slug: `${GameName}`;
	title: string;
	scorePerRound: number;
}

export interface HangmanGameData {
	maskedWords: HangmanMaskedRoundProps[];
}

export interface MemoryGameData {
	cardCount: number;
}
