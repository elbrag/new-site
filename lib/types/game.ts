export enum GameName {
	Hangman = "hangman",
	Memory = "memory",
	Puzzle = "puzzle",
	SendResults = "send_results",
}

export interface GameProps {
	url: string;
	title: string;
}
