import useUserData from "@/hooks/firebase/useUserData";
import {
	firebaseDatabaseIsMissing,
	userIdIsMissing,
} from "@/lib/helpers/errorThrowMessages";
import { CurrentRoundIndexProps } from "@/lib/types/currentRoundIndex";
import {
	FirebaseDatabaseProps,
	FirebaseUserIdProps,
} from "@/lib/types/firebase";
import { GameName } from "@/lib/types/game";
import { Database } from "firebase/database";
import { createContext, useState } from "react";

interface RoundContextProps {
	currentRoundIndexes: CurrentRoundIndexProps[];
	updateCurrentRoundIndexes: (
		firebaseDatabase: Database,
		userId: string
	) => void;
	roundLength: number | null;
	updateRoundLength: (round: number) => void;
	onRoundFinish: (
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps,
		game: GameName,
		roundIndex: number
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
}

export const RoundContext = createContext<RoundContextProps>({
	currentRoundIndexes: [],
	updateCurrentRoundIndexes: () => {},
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
	const [allRoundsPassed, setAllRoundsPassed] = useState(false);
	const { updateUserData, getUserData } = useUserData();

	const updateRoundLength = (roundLength: number) => {
		setRoundLength(roundLength);
	};

	/**
	 * Update current round indexes
	 */
	const updateCurrentRoundIndexes = async (
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
			console.log(
				`Updated current round indexes to ${storedCurrentRoundIndexes}`
			);
		}
	};

	/**
	 * On round finish
	 */
	const onRoundFinish = async (
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps,
		game: GameName,
		roundIndex: number
	) => {
		console.log("onRoundFinish");

		if (!firebaseDatabase) return firebaseDatabaseIsMissing;
		if (!userId) return userIdIsMissing;

		setCurrentRoundIndexes((prevRoundIndexes) => {
			const existingIndex = prevRoundIndexes.findIndex(
				(item) => item.game === game
			);
			// If there are already roundindexes for this game
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
			return newRoundIndexes;
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

	return (
		<RoundContext.Provider
			value={{
				currentRoundIndexes,
				updateCurrentRoundIndexes,
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
			}}
		>
			{children}
		</RoundContext.Provider>
	);
};

export default RoundContextProvider;
