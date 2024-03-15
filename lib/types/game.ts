import { HangmanRoundProps } from "./rounds";

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
	maskedWords: HangmanRoundProps[];
}
