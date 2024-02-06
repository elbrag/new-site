import { useEffect, useState } from "react";

const useScore = () => {
	const [currentScore, setCurrentScore] = useState(0);

	useEffect(() => {
		const storedScore = localStorage.getItem("currentScore");
		if (storedScore) setCurrentScore(JSON.parse(storedScore));
	}, []);

	const updateScore = (incoming: number) => {
		const newScore = currentScore + incoming;
		setCurrentScore(newScore);
		console.log(newScore);
		localStorage.setItem("currentScore", JSON.stringify(newScore));
	};

	return { currentScore, updateScore };
};

export default useScore;
