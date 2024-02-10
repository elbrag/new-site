import { GameName } from "./game";

export interface ProgressProps {
	game: GameName;
	questions: ProgressQuestionProps[];
}

export interface ProgressQuestionProps {
	questionId: number;
	completed: HangmanProgressCompletedProps[]; // TODO: Add alternatives for other games;
}

export interface HangmanProgressCompletedProps {
	letter: string;
	index: number;
}
