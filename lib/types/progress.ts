import { GameName } from "./game";

export interface ProgressProps {
	game: GameName;
	rounds: ProgressRoundProps[];
}

export interface ProgressRoundProps {
	roundId: number;
	completed: HangmanProgressCompletedProps[] | MemoryProgressCompletedProps; // TODO: Add alternatives for other games;
}

export interface HangmanProgressCompletedProps {
	letter: string;
	index: number;
}

export type MemoryProgressCompletedProps = boolean;

export type PuzzleCompletedProps = boolean;
