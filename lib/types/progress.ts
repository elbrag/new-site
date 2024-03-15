import { GameName } from "./game";

export interface ProgressProps {
	game: GameName;
	rounds: ProgressRoundProps[];
}

export interface ProgressRoundProps {
	roundId: number;
	completed: HangmanProgressCompletedProps[]; // TODO: Add alternatives for other games;
}

export interface HangmanProgressCompletedProps {
	letter: string;
	index: number;
}
