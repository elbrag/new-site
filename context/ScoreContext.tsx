/**
 * Score context
 *
 * Manages "currentScore" state
 */

import { createContext, useEffect, useState } from "react";
import { Database } from "firebase/database";
import useUserData from "@/hooks/firebase/useUserData";

interface ScoreContextProps {
	currentScore: number | undefined;
	updateFirebaseScore: (
		firebaseDatabase: Database,
		userId: string,
		incoming: number
	) => void;
	updateScoreState: (firebaseDatabase: Database, userId: string) => void;
}

export const ScoreContext = createContext<ScoreContextProps>({
	currentScore: 0,
	updateFirebaseScore: () => {},
	updateScoreState: () => {},
});

interface ScoreContextProviderProps {
	children: React.ReactNode;
}

const ScoreContextProvider = ({ children }: ScoreContextProviderProps) => {
	const [currentScore, setCurrentScore] = useState<number | undefined>(
		undefined
	);
	const { updateUserData, getUserData } = useUserData();

	useEffect(() => {
		console.log("ScoreContextProvider updated");
	}, []);

	useEffect(() => {
		console.log("currentScore changed in ScoreContextProvider", currentScore);
	}, [currentScore]);

	/**
	 * Update score in Firebase + set state
	 */
	const updateFirebaseScore = async (
		firebaseDatabase: Database,
		userId: string,
		incoming: number
	) => {
		console.log("currentScore in updateFirebaseScore", currentScore);
		const newScore = (currentScore ?? 0) + incoming;
		await updateUserData(firebaseDatabase, userId, "score", newScore);
		setCurrentScore(newScore);
	};

	/**
	 * Set score state from Firebase data
	 */
	const updateScoreState = async (
		firebaseDatabase: Database,
		userId: string
	) => {
		const _score = await getUserData(firebaseDatabase, userId, "score");
		setCurrentScore(_score === null ? 0 : _score);
	};

	return (
		<ScoreContext.Provider
			value={{
				currentScore,
				updateFirebaseScore,
				updateScoreState,
			}}
		>
			{children}
		</ScoreContext.Provider>
	);
};

export default ScoreContextProvider;
