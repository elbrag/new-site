import { CurrentRoundIndexProps } from "@/lib/types/currentRoundIndex";
import {
	FirebaseDatabaseProps,
	FirebaseUserIdProps,
} from "@/lib/types/firebase";
import { GameName } from "@/lib/types/game";
import { use, useEffect, useState } from "react";
import useUserData from "./firebase/useUserData";
import {
	firebaseDatabaseIsMissing,
	userIdIsMissing,
} from "@/lib/helpers/errorThrowMessages";

const useRounds = () => {
	const [currentRoundIndexes, setCurrentRoundIndexes] = useState<
		CurrentRoundIndexProps[]
	>([]);
	const [roundLength, setRoundLength] = useState<number | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [roundFailed, setRoundFailed] = useState(false);
	const [numberOfRounds, setNumberOfRounds] = useState(0);
	const [allRoundsPassed, setAllRoundsPassed] = useState(false);
	const { updateUserData, getUserData } = useUserData();

	useEffect(() => {
		// Keep state synced with local storage values
		const storedCurrentRoundIndexes = localStorage.getItem(
			"currentRoundIndexes"
		);
		if (storedCurrentRoundIndexes)
			setCurrentRoundIndexes(JSON.parse(storedCurrentRoundIndexes));
	}, []);

	/**
	 * Update errors
	 */
	const updateCurrentRoundIndexes = async (
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps,
		game: GameName,
		roundIndex: number
	) => {
		if (!firebaseDatabase) return firebaseDatabaseIsMissing;
		if (!userId) return userIdIsMissing;

		setCurrentRoundIndexes((prevRoundIndexes) => {
			const existingIndex = prevRoundIndexes.findIndex(
				(item) => item.game === game
			);
			// If there are already errors for this game
			if (existingIndex !== -1) {
				const updatedRoundIndexes = prevRoundIndexes.map((item, index) => {
					if (index === existingIndex) {
						return {
							...item,
							currentRoundIndex: roundIndex,
						};
					}
					return item;
				});
				updateUserData(
					firebaseDatabase,
					userId,
					"currentRoundIndexes",
					JSON.stringify(updatedRoundIndexes)
				);
				localStorage.setItem(
					"currentRoundIndexes",
					JSON.stringify(updatedRoundIndexes)
				);
				return updatedRoundIndexes;
			}
			const newRoundIndexes = [
				...prevRoundIndexes,
				{ game: game, currentRoundIndex: roundIndex },
			];
			updateUserData(
				firebaseDatabase,
				userId,
				"currentRoundIndexes",
				JSON.stringify(newRoundIndexes)
			);
			localStorage.setItem(
				"currentRoundIndexes",
				JSON.stringify(newRoundIndexes)
			);
			return newRoundIndexes;
		});
	};

	/**
	 * Get game specific current round index
	 */
	const getGameCurrentRoundIndex = (game: GameName): number => {
		return (
			currentRoundIndexes.find((i: CurrentRoundIndexProps) => i.game === game)
				?.currentRoundIndex ?? 0
		);
	};

	return {
		roundLength,
		setRoundLength,
		roundComplete,
		setRoundComplete,
		roundFailed,
		setRoundFailed,
		numberOfRounds,
		setNumberOfRounds,
		allRoundsPassed,
		setAllRoundsPassed,
		updateCurrentRoundIndexes,
		getGameCurrentRoundIndex,
	};
};

export default useRounds;
