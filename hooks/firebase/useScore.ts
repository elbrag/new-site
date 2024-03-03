import { useState } from "react";
import { ref, set, get, Database } from "firebase/database";

const useScore = () => {
	const [currentScore, setCurrentScore] = useState(0);

	/**
	 * Update score in Firebase + set state
	 */
	const updateFirebaseScore = (
		firebaseDatabase: Database,
		userId: string,
		incoming: number
	) => {
		const newScore = currentScore + incoming;
		const scoreRef = ref(firebaseDatabase, `users/${userId}/score`);
		set(scoreRef, newScore);
		setCurrentScore(newScore);
	};

	/**
	 * Get score from Firebase
	 */
	const getFirebaseScore = (firebaseDatabase: Database, userId: string) => {
		const scoreRef = ref(firebaseDatabase, `users/${userId}/score`);
		get(scoreRef)
			.then((snapshot) => {
				const score = snapshot.val();
				setCurrentScore(score === null ? 0 : score);
			})
			.catch((error) => {
				console.error("Error getting score:", error);
			});
	};

	return { currentScore, updateFirebaseScore, getFirebaseScore };
};

export default useScore;
