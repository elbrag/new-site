export interface AnswerProps {
	questionId: string;
}

export interface HangmanAnswerProps extends AnswerProps {
	answer: string;
}
