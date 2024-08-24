/**
 * Error context
 *
 * Manages "errors" data in Firebase
 */

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
import { createContext, useState } from "react";

interface ErrorContextProps {
	getGameErrors: (_game: GameName, _errors?: ErrorProps[]) => string[];
	errors: ErrorProps[];
	updateErrors: (
		firebaseDatabase: FirebaseDatabaseProps,
		userId: FirebaseUserIdProps,
		_game: GameName,
		error: string | [],
		merge: boolean
	) => Promise<ErrorProps[]>;
	updateErrorState: (firebaseDatabase: Database, userId: string) => void;
}

export const ErrorContext = createContext<ErrorContextProps>({
	getGameErrors: () => [],
	errors: [],
	updateErrors: async () => {
		return Promise.resolve([]);
	},
	updateErrorState: () => {},
});

interface ErrorContextProviderProps {
	children: React.ReactNode;
}

const ErrorContextProvider = ({ children }: ErrorContextProviderProps) => {
	const [errors, setErrors] = useState<ErrorProps[]>([]);
	const { updateUserData, getUserData } = useUserData();

	/**
	 * Update error state from Firebase data
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
	): Promise<ErrorProps[]> => {
		if (!firebaseDatabase) throw Error(firebaseDatabaseIsMissing);
		if (!userId) throw Error(userIdIsMissing);

		const shouldReset = Array.isArray(error) && error.length === 0;

		let newErrorState: ErrorProps[] = [];

		setErrors((prevErrors) => {
			const existingIndex = prevErrors.findIndex((item) => item.game === game);
			const flattenedError = Array.isArray(error) ? error : [error];
			// If there are already errors for this game
			if (existingIndex !== -1) {
				const updatedErrors = prevErrors.map((item, index) => {
					if (index === existingIndex) {
						const mergedErrors = merge
							? uniq([...item.errors, ...flattenedError])
							: [...item.errors, ...flattenedError];
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
				newErrorState = updatedErrors;
				return updatedErrors;
			}

			const newErrors = [
				...prevErrors,
				{ game: game, errors: shouldReset ? [] : flattenedError },
			];
			updateUserData(
				firebaseDatabase,
				userId,
				"errors",
				JSON.stringify(newErrors)
			);
			newErrorState = newErrors;
			return newErrors;
		});

		return newErrorState;
	};

	/**
	 * Get game specific errors
	 */
	const getGameErrors = (game: GameName, _errors?: ErrorProps[]): string[] => {
		const theErrors = _errors ?? errors;
		return theErrors.find((p: ErrorProps) => p.game === game)?.errors ?? [];
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
