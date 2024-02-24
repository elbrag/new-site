export interface QuestionProps {
	questionId: string;
	description: string;
}

export interface HangmanQuestionProps extends QuestionProps {
	maskedWord: number[];
}
