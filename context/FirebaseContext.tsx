/**
 * Firebase context
 *
 * Manages Firebase auth
 * Syncs states with Firebase data
 */

import { createContext, useContext } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import {
	getAuth,
	signInAnonymously,
	onAuthStateChanged,
	setPersistence,
	browserLocalPersistence,
	Auth,
} from "firebase/auth";
import { useEffect, useState } from "react";
import useScore from "@/hooks/firebase/useScore";
import useUsername from "@/hooks/firebase/useUsername";
import {
	FirebaseDatabaseProps,
	FirebaseUserIdProps,
} from "@/lib/types/firebase";
import { RoundContext } from "./RoundContext";
import { ErrorContext } from "./ErrorContext";
import { ProgressContext } from "./ProgressContext";
import { firebaseConfig } from "@/lib/helpers/firebase";
import { getCookie, setCookie } from "@/lib/helpers/cookies";
import { useRouter } from "next/router";

let firebaseApp: FirebaseApp | undefined;
let firebaseDatabase: Database;

interface FirebaseContextProps {
	initFirebase: (withSignIn?: boolean) => void;
	firebaseDatabase: FirebaseDatabaseProps;
	userId: FirebaseUserIdProps;
	currentScore: number;
	updateScoreInFirebase: (incoming: number) => void;
	username: string | null;
	updateUsernameInFirebase: (username: string) => void;
}

export const FirebaseContext = createContext<FirebaseContextProps>({
	initFirebase: () => {},
	firebaseDatabase: undefined,
	userId: null,
	currentScore: 0,
	updateScoreInFirebase: () => {},
	username: null,
	updateUsernameInFirebase: () => {},
});

interface FirebaseContextProviderProps {
	children: React.ReactNode;
}

const FirebaseContextProvider = ({
	children,
}: FirebaseContextProviderProps) => {
	const [userId, setUserId] = useState<string | null>(null);
	const [signedIn, setSignedIn] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const router = useRouter();

	const { currentScore, updateFirebaseScore, updateScoreState } = useScore();
	const { username, updateFirebaseUsername, updateUsernameState } =
		useUsername();
	const {
		currentRoundIndexes,
		updateCurrentRoundIndexesState,
		completedRoundIndexes,
		updateCompletedRoundIndexesState,
	} = useContext(RoundContext);
	const { errors, updateErrorState } = useContext(ErrorContext);
	const { progress, updateProgressState } = useContext(ProgressContext);

	/**
	 * Keep states synced with Firebase values
	 */

	// Progress
	useEffect(() => {
		if (userId && firebaseDatabase && !progress?.length) {
			updateProgressState(firebaseDatabase, userId);
		}
	}, [progress?.length, updateProgressState, userId]);

	// Errors
	useEffect(() => {
		if (userId && firebaseDatabase && !errors?.length) {
			updateErrorState(firebaseDatabase, userId);
		}
	}, [errors?.length, updateErrorState, userId]);

	// Round indexes
	useEffect(() => {
		if (userId && firebaseDatabase && !currentRoundIndexes?.length) {
			updateCurrentRoundIndexesState(firebaseDatabase, userId);
		}
	}, [currentRoundIndexes?.length, updateCurrentRoundIndexesState, userId]);

	// Round completed indexes
	useEffect(() => {
		if (userId && firebaseDatabase && !completedRoundIndexes?.length) {
			updateCompletedRoundIndexesState(firebaseDatabase, userId);
		}
	}, [completedRoundIndexes?.length, updateCompletedRoundIndexesState, userId]);

	// Username
	useEffect(() => {
		if (userId && !username) {
			updateUsernameState(firebaseDatabase, userId);
		}
	}, [updateUsernameState, userId, username]);

	// Score
	useEffect(() => {
		if (userId) {
			updateScoreState(firebaseDatabase, userId);
		}
	}, [updateScoreState, userId]);

	/**
	 * Update username via hook
	 */
	const updateUsernameInFirebase = (username: string) => {
		if (userId) {
			updateFirebaseUsername(firebaseDatabase, userId, username);
		}
	};

	/**
	 * Update score via hook
	 */
	const updateScoreInFirebase = (incoming: number) => {
		if (userId) {
			updateFirebaseScore(firebaseDatabase, userId, incoming);
		}
	};

	/**
	 * Sign in anonymously to Firebase
	 */
	const signInToFirebase = (auth: Auth) => {
		if (signedIn) return;
		signInAnonymously(auth)
			.then(() => {
				setSignedIn(true);
			})
			.catch((error: any) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	};

	/**
	 * Initialize Firebase
	 *
	 * Init with config
	 * Check if signed in, otherwise set persistance + sign in
	 * Set user id
	 * Clean up
	 */
	const initFirebase = async (withSignIn: boolean = false) => {
		if (!firebaseApp) {
			firebaseApp = initializeApp(firebaseConfig);
			firebaseDatabase = getDatabase(firebaseApp);
		}

		if (firebaseApp) {
			const auth = getAuth(firebaseApp);
			const unsubscribe = onAuthStateChanged(auth, async (user) => {
				if (user) {
					console.log("User is already signed in:", user.uid);
					await setUserId(user.uid);
					await setSignedIn(true);
					const token = await user.getIdToken();
					setCookie("firebaseToken", token, 30);
				} else if (withSignIn) {
					console.log("No user found, attempting to sign in anonymously...");
					await setPersistence(auth, browserLocalPersistence);
					signInToFirebase(auth);
				}
			});
			return unsubscribe;
		}
	};

	/**
	 * Keep Firebase initiated
	 */
	useEffect(() => {
		let unsubscribe: any;
		const asyncInitFirebase = async () => {
			if (!isInitialized) {
				unsubscribe = await initFirebase();
				await setIsInitialized(true);
			}
		};
		asyncInitFirebase();
		// Clean up
		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInitialized]);

	return (
		<FirebaseContext.Provider
			value={{
				initFirebase,
				firebaseDatabase,
				userId,
				currentScore,
				updateScoreInFirebase,
				username,
				updateUsernameInFirebase,
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
};

export default FirebaseContextProvider;
