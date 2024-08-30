/**
 * Firebase context
 *
 * Manages Firebase auth
 * Syncs states with Firebase data
 */

import { createContext, useContext } from "react";
import { FirebaseApp, FirebaseError, initializeApp } from "firebase/app";
import {
	Database,
	getDatabase,
	ref,
	set,
	Unsubscribe,
} from "firebase/database";
import {
	getAuth,
	signInAnonymously,
	onAuthStateChanged,
	setPersistence,
	browserLocalPersistence,
	Auth,
	onIdTokenChanged,
	signOut,
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
import { setCookie } from "@/lib/helpers/cookies";
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
			.then((value) => {
				setSignedIn(true);
				const { user } = value;
				const userRef = ref(firebaseDatabase, `users/${user.uid}`);
				set(userRef, {
					createdAt: new Date().toISOString(),
				});
			})
			.catch((error: FirebaseError) => {
				const { code, message } = error;
				console.error(code, message);
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
			// console.log("auth:: ", auth);
			const unsubscribe = onAuthStateChanged(auth, async (user) => {
				// console.log("onAuthStateChanged");
				if (user) {
					// console.log("User is already signed in:", user.uid);
					await setUserId(user.uid);
					await setSignedIn(true);
					const token = await user.getIdToken();
					setCookie("firebaseToken", token, 30);
				} else if (withSignIn) {
					// console.log("Signing in");
					await setPersistence(auth, browserLocalPersistence);
					signInToFirebase(auth);
				} else {
					// console.log("No user");
					setCookie("firebaseToken", "", 30);
					await signOut(auth);
					router.push("/login");
				}
			});

			onIdTokenChanged(auth, async (user) => {
				// console.log("onIdTokenChanged");
				if (user) {
					const token = await user.getIdToken();
					setCookie("firebaseToken", token, 30);
				} else {
					// console.log("No user");
					setCookie("firebaseToken", "", 30);
					router.push("/login");
				}
			});

			return unsubscribe;
		}
	};

	/**
	 * Keep Firebase initiated
	 */
	useEffect(() => {
		let unsubscribe: Unsubscribe | undefined;
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
