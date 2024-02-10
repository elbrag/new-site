import { useCallback, useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";
import useFirebase from "./useFirebase";
import gamesData from "../lib/data/gamesData.json";
import { GameName, GameProps } from "@/lib/types/game";

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

	/**
	 * Update score
	 *
	 * Calculate score for game and pass score on to updateScoreInFirebase
	 */
	const updateScore = (game: GameName) => {
		const gameToScore = gamesData.find((data) => data.url === game);
		const score = gameToScore ? gameToScore.scorePerRound : null;
		if (score) updateScoreInFirebase(score);
	};

	return { currentScore, updateScore };
};

export default useScore;
