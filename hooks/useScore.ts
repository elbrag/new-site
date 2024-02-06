import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import useFirebase from "./useFirebase";

const useScore = () => {
	const [currentScore, setCurrentScore] = useState(0);
	const username = "Ellen";
	const { database } = useFirebase();

	useEffect(() => {
		const storedScore = localStorage.getItem("currentScore");
		if (storedScore) setCurrentScore(JSON.parse(storedScore));
	}, []);

	const updateScore = (incoming: number) => {
		const newScore = currentScore + incoming;
		setCurrentScore(newScore);
		localStorage.setItem("currentScore", JSON.stringify(newScore));
		updateScoreInFirebase(newScore);
	};

	const updateScoreInFirebase = (newScore: number) => {
		const scoreRef = ref(database, "scores/" + username + "/score");

		onValue(scoreRef, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
			return data;
		});
	};

	return { currentScore, updateScore };
};

export default useScore;
