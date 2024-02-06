import { useCallback, useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import useFirebase from "./useFirebase";

const useScore = () => {
	const [currentScore, setCurrentScore] = useState(0);
	const { userId, database } = useFirebase();

	// Get score
	const getScore = useCallback(() => {
		if (userId) {
			const scoreRef = ref(database, `users/${userId}/score`);
			get(scoreRef)
				.then((snapshot) => {
					const score: number = snapshot.val();
					setCurrentScore(score === null ? 0 : score);
				})
				.catch((error) => {
					console.error("Error getting score:", error);
				});
		}
	}, [database, userId]);

	useEffect(() => {
		getScore();
	}, [getScore, database, userId]);

	// Update score in Firebase + set state
	const updateScore = (incoming: number) => {
		const newScore = currentScore + incoming;
		const scoreRef = ref(database, `users/${userId}/score`);
		set(scoreRef, newScore);
		setCurrentScore(newScore);
	};

	return { currentScore, updateScore };
};

export default useScore;
