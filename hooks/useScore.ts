import { useCallback, useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";
import useFirebase from "./useFirebase";

const useScore = () => {
	const [currentScore, setCurrentScore] = useState(0);
	const { userId, database } = useFirebase();

	/**
	 * Get score from Firebase
	 */
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

	/**
	 * Keep checking for score
	 */
	useEffect(() => {
		getScore();
	}, [getScore, database, userId]);

	/**
	 * Update score in Firebase + set state
	 */
	const updateScoreInFirebase = (incoming: number) => {
		const newScore = currentScore + incoming;
		const scoreRef = ref(database, `users/${userId}/score`);
		set(scoreRef, newScore);
		setCurrentScore(newScore);
	};

	return { currentScore, updateScoreInFirebase };
};

export default useScore;
