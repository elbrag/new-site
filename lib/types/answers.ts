export interface AnswerProps {
	roundId: string;
}

export interface HangmanAnswerProps extends AnswerProps {
	answer: string;
}
