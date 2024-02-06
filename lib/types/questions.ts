export interface QuestionProps {
	questionId: string;
}

export interface HangmanQuestionProps extends QuestionProps {
	maskedWord: number[];
}
