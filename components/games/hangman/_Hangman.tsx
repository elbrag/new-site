import { fetchAnswers } from "@/lib/helpers/fetch";
import React from "react";

interface HangmanProps {}

const Hangman: React.FC<HangmanProps> = ({}) => {
	fetchAnswers("hangman");

	return <div></div>;
};

export default Hangman;
