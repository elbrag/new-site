import useUserData from "@/hooks/firebase/useUserData";
import {
	firebaseDatabaseIsMissing,
	userIdIsMissing,
} from "@/lib/helpers/errorThrowMessages";
import { ErrorProps } from "@/lib/types/errors";
import {
	FirebaseDatabaseProps,
	FirebaseUserIdProps,
} from "@/lib/types/firebase";
import { GameName } from "@/lib/types/game";
import { Database } from "firebase/database";
import uniq from "lodash/uniq";
import { createContext, useEffect, useState } from "react";

interface ErrorContextProps {
	getGameErrors: (_game: GameName) => string[];
	errors: ErrorProps[];
	updateErrors: (
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps,
		_game: GameName,
		error: string | [],
		merge: boolean
	) => void;
	updateErrorState: (firebaseDatabase: Database, userId: string) => void;
}

export const ErrorContext = createContext<ErrorContextProps>({
	getGameErrors: () => [],
	errors: [],
	updateErrors: () => {},
	updateErrorState: () => {},
});

interface ErrorContextProviderProps {
	children: React.ReactNode;
}

const ErrorContextProvider = ({ children }: ErrorContextProviderProps) => {
	const [errors, setErrors] = useState<any[]>([]);
	const { updateUserData, getUserData } = useUserData();

	/**
	 * Update error state
	 */
	const updateErrorState = async (
		firebaseDatabase: Database,
		userId: string
	) => {
		const storedErrors = await getUserData(firebaseDatabase, userId, "errors");
		if (storedErrors?.length) {
			setErrors(JSON.parse(storedErrors));
		}
	};

	/**
	 * Update errors
	 */
	const updateErrors = async (
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps,
		game: GameName,
		error: string | [],
		merge: boolean = false
	) => {
		if (!firebaseDatabase) return firebaseDatabaseIsMissing;
		if (!userId) return userIdIsMissing;

		const shouldReset = Array.isArray(error) && error.length === 0;
		setErrors((prevErrors) => {
			const existingIndex = prevErrors.findIndex((item) => item.game === game);
			// If there are already errors for this game
			if (existingIndex !== -1) {
				const updatedErrors = prevErrors.map((item, index) => {
					if (index === existingIndex) {
						const mergedErrors = merge
							? uniq([...item.errors, error])
							: [...item.errors, error];
						return {
							...item,
							errors: shouldReset ? [] : mergedErrors,
						};
					}
					return item;
				});
				updateUserData(
					firebaseDatabase,
					userId,
					"errors",
					JSON.stringify(updatedErrors)
				);
				return updatedErrors;
			}
			const newErrors = [
				...prevErrors,
				{ game: game, errors: shouldReset ? [] : [error] },
			];
			updateUserData(
				firebaseDatabase,
				userId,
				"errors",
				JSON.stringify(newErrors)
			);
			return newErrors;
		});
	};

	/**
	 * Get game specific errors
	 */
	const getGameErrors = (game: GameName): string[] => {
		return errors.find((p: ErrorProps) => p.game === game)?.errors ?? [];
	};

	return (
		<ErrorContext.Provider
			value={{ errors, getGameErrors, updateErrors, updateErrorState }}
		>
			{children}
		</ErrorContext.Provider>
	);
};

export default ErrorContextProvider;
