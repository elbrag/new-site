import { useState } from "react";
import { Database } from "firebase/database";
import useUserData from "./useUserData";

const useScore = () => {
	const [currentScore, setCurrentScore] = useState(0);
	const { updateUserData, getUserData } = useUserData();

	/**
	 * Update score in Firebase + set state
	 */
	const updateFirebaseScore = async (
		firebaseDatabase: Database,
		userId: string,
		incoming: number
	) => {
		const newScore = currentScore + incoming;
		await updateUserData(firebaseDatabase, userId, "score", newScore);
		setCurrentScore(newScore);
	};

	/**
	 * Get score from Firebase
	 */
	const getFirebaseScore = async (
		firebaseDatabase: Database,
		userId: string
	) => {
		const _score = await getUserData(firebaseDatabase, userId, "score");
		setCurrentScore(_score === null ? 0 : _score);
	};

	return { currentScore, updateFirebaseScore, getFirebaseScore };
};

export default useScore;
