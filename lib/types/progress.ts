export interface ProgressProps {
	game: string;
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
