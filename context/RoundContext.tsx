/**
 * Round context
 *
 * Manages "currentRoundIndexes" data in Firebase
 */

import useUserData from "@/hooks/firebase/useUserData";
import {
	firebaseDatabaseIsMissing,
	userIdIsMissing,
} from "@/lib/helpers/errorThrowMessages";
import { updateState } from "@/lib/helpers/states";
import {
	FirebaseDatabaseProps,
	FirebaseUserIdProps,
} from "@/lib/types/firebase";
import { GameName } from "@/lib/types/game";
import {
	CompletedRoundIndexesProps,
	CurrentRoundIndexProps,
} from "@/lib/types/rounds";
import { Database } from "firebase/database";
import { createContext, useState } from "react";

interface RoundContextProps {
	currentRoundIndexes: CurrentRoundIndexProps[];
	updateCurrentRoundIndexesState: (
		firebaseDatabase: Database,
		userId: string
	) => void;
	completedRoundIndexes: CompletedRoundIndexesProps[];
	updateCompletedRoundIndexesState: (
		firebaseDatabase: Database,
		userId: string
	) => void;
	roundLength: number | null;
	updateRoundLength: (round: number) => void;
	onRoundFinish: (
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps,
		game: GameName,
		currentRoundIndex: number,
		goToNextRound?: boolean
	) => void;
	roundComplete: boolean;
	setRoundComplete: (roundComplete: boolean) => void;
	roundFailed: boolean;
	setRoundFailed: (roundFailed: boolean) => void;
	numberOfRounds: number;
	setNumberOfRounds: (numberOfRounds: number) => void;
	allRoundsPassed: boolean;
	setAllRoundsPassed: (allRoundsPassed: boolean) => void;
	getGameCurrentRoundIndex: (game: GameName) => number;
	getGameCompletedRoundIndexes: (game: GameName) => number[];
	setCompletedRoundIndexes: (
		completedRoundIndexes: CompletedRoundIndexesProps[]
	) => void;
	removeCompletedAndCurrentRoundIndexes: (
		game: GameName,
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps
	) => void;
}

export const RoundContext = createContext<RoundContextProps>({
	currentRoundIndexes: [],
	updateCurrentRoundIndexesState: () => {},
	completedRoundIndexes: [],
	updateCompletedRoundIndexesState: () => {},
	roundLength: null,
	updateRoundLength: () => {},
	onRoundFinish: () => {},
	roundComplete: false,
	setRoundComplete: () => {},
	roundFailed: false,
	setRoundFailed: () => {},
	numberOfRounds: 0,
	setNumberOfRounds: () => {},
	allRoundsPassed: false,
	setAllRoundsPassed: () => {},
	getGameCurrentRoundIndex: () => 0,
	getGameCompletedRoundIndexes: () => [],
	setCompletedRoundIndexes: () => {},
	removeCompletedAndCurrentRoundIndexes: () => {},
});

interface RoundContextProviderProps {
	children: React.ReactNode;
}

const RoundContextProvider = ({ children }: RoundContextProviderProps) => {
	const [currentRoundIndexes, setCurrentRoundIndexes] = useState<
		CurrentRoundIndexProps[]
	>([]);
	const [roundLength, setRoundLength] = useState<number | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [roundFailed, setRoundFailed] = useState(false);
	const [numberOfRounds, setNumberOfRounds] = useState(0);
	const [completedRoundIndexes, setCompletedRoundIndexes] = useState<
		CompletedRoundIndexesProps[]
	>([]);
	// This state only manages the showing of (temporary) success message
	const [allRoundsPassed, setAllRoundsPassed] = useState(false);

	const { updateUserData, getUserData } = useUserData();

	const updateRoundLength = (roundLength: number) => {
		setRoundLength(roundLength);
	};

	/**
	 * Update completed rounds state from Firebase data
	 */
	const updateCompletedRoundIndexesState = async (
		firebaseDatabase: Database,
		userId: string
	) => {
		const storedCompletedRoundIndexes = await getUserData(
			firebaseDatabase,
			userId,
			"completedRoundIndexes"
		);
		if (storedCompletedRoundIndexes?.length) {
			setCompletedRoundIndexes(JSON.parse(storedCompletedRoundIndexes));
		}
	};

	/**
	 * Update current round indexes state from Firebase data
	 */
	const updateCurrentRoundIndexesState = async (
		firebaseDatabase: Database,
		userId: string
	) => {
		const storedCurrentRoundIndexes = await getUserData(
			firebaseDatabase,
			userId,
			"currentRoundIndexes"
		);
		if (storedCurrentRoundIndexes?.length) {
			setCurrentRoundIndexes(JSON.parse(storedCurrentRoundIndexes));
		}
	};

	/**
	 * On round finish
	 */
	const onRoundFinish = async (
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps,
		game: GameName,
		currentRoundIndex: number,
		goToNextRound: boolean = false
	) => {
		if (!firebaseDatabase) return firebaseDatabaseIsMissing;
		if (!userId) return userIdIsMissing;

		if (goToNextRound) {
			// Update current round indexes
			setCurrentRoundIndexes((prevRoundIndexes) => {
				const updatedRoundIndexes = updateState(
					prevRoundIndexes,
					game,
					currentRoundIndex + 1,
					"currentRoundIndex"
				);
				updateUserData(
					firebaseDatabase,
					userId,
					"currentRoundIndexes",
					JSON.stringify(updatedRoundIndexes)
				);

				return updatedRoundIndexes;
			});
		}

		// Update completed rounds
		setCompletedRoundIndexes((prevCompletedRoundIndexes) => {
			const updatedCompletedRoundIndexes = updateState(
				prevCompletedRoundIndexes,
				game,
				[currentRoundIndex],
				"completedRoundIndexes"
			);
			updateUserData(
				firebaseDatabase,
				userId,
				"completedRoundIndexes",
				JSON.stringify(updatedCompletedRoundIndexes)
			);

			return updatedCompletedRoundIndexes;
		});
	};

	/**
	 * Remove index from completedRoundIndexes and currentRoundIndexes
	 */
	const removeCompletedAndCurrentRoundIndexes = async (
		game: GameName,
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps
	) => {
		if (!firebaseDatabase) return firebaseDatabaseIsMissing;
		if (!userId) return userIdIsMissing;

		setCompletedRoundIndexes((prevCompletedRoundIndexes) => {
			const updatedCompletedRoundIndexes = updateState(
				prevCompletedRoundIndexes,
				game,
				[],
				"completedRoundIndexes"
			);
			updateUserData(
				firebaseDatabase,
				userId,
				"completedRoundIndexes",
				JSON.stringify(updatedCompletedRoundIndexes)
			);
			return updatedCompletedRoundIndexes;
		});
		setCurrentRoundIndexes((prevRoundIndexes) => {
			const updatedRoundIndexes = updateState(
				prevRoundIndexes,
				game,
				0,
				"currentRoundIndex"
			);
			updateUserData(
				firebaseDatabase,
				userId,
				"currentRoundIndexes",
				JSON.stringify(updatedRoundIndexes)
			);

			return updatedRoundIndexes;
		});
	};

	/**
	 * Get game specific current round index
	 */
	const getGameCurrentRoundIndex = (game: GameName): number => {
		return currentRoundIndexes?.length
			? currentRoundIndexes.find((i: CurrentRoundIndexProps) => i.game === game)
					?.currentRoundIndex ?? 0
			: 0;
	};

	/**
	 * Get game specific current completed rounds
	 */
	const getGameCompletedRoundIndexes = (game: GameName): number[] => {
		return completedRoundIndexes?.length
			? completedRoundIndexes.find(
					(i: CompletedRoundIndexesProps) => i.game === game
			  )?.completedRoundIndexes ?? []
			: [];
	};

	return (
		<RoundContext.Provider
			value={{
				currentRoundIndexes,
				updateCurrentRoundIndexesState,
				completedRoundIndexes,
				updateCompletedRoundIndexesState,
				roundLength,
				updateRoundLength,
				onRoundFinish,
				roundComplete,
				setRoundComplete,
				roundFailed,
				setRoundFailed,
				numberOfRounds,
				setNumberOfRounds,
				allRoundsPassed,
				setAllRoundsPassed,
				getGameCurrentRoundIndex,
				getGameCompletedRoundIndexes,
				setCompletedRoundIndexes,
				removeCompletedAndCurrentRoundIndexes,
			}}
		>
			{children}
		</RoundContext.Provider>
	);
};

export default RoundContextProvider;
