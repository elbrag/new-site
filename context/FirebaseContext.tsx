import { createContext } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import {
	getAuth,
	signInAnonymously,
	onAuthStateChanged,
	setPersistence,
	browserLocalPersistence,
} from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import useScore from "@/hooks/firebase/useScore";
import useUsername from "@/hooks/firebase/useUsername";
import {
	FirebaseDatabaseProps,
	FirebaseUserIdProps,
} from "@/lib/types/firebase";

let firebaseApp: FirebaseApp | undefined;
let firebaseDatabase: Database;

interface FirebaseContextProps {
	firebaseDatabase: FirebaseDatabaseProps;
	userId: FirebaseUserIdProps;
	currentScore: number;
	updateScoreInFirebase: (incoming: number) => void;
	username: string | null;
	updateUsernameInFirebase: (username: string) => void;
}

export const FirebaseContext = createContext<FirebaseContextProps>({
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

	const { currentScore, updateFirebaseScore, getFirebaseScore } = useScore();
	const { username, updateFirebaseUsername, getFirebaseUsername } =
		useUsername();

	/**
	 * Get username (sets state)
	 */
	const getUsername = useCallback(() => {
		if (userId) {
			getFirebaseUsername(firebaseDatabase, userId);
		}
	}, [getFirebaseUsername, userId]);

	useEffect(() => {
		getUsername();
	}, [getUsername]);

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
	 * Get firebase score (sets state)
	 */
	useEffect(() => {
		if (userId) {
			getFirebaseScore(firebaseDatabase, userId);
		}
	}, [getFirebaseScore, userId]);

	/**
	 * Sign in anonymously to Firebase
	 */
	const signInToFirebase = (auth: any) => {
		if (signedIn) return;
		signInAnonymously(auth)
			.then(() => {
				console.log("Signed in to Firebase");
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
	useEffect(() => {
		if (!firebaseApp) {
			const firebaseConfig = {
				apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
				databaseURL:
					"https://eb-portfolio-game-default-rtdb.europe-west1.firebasedatabase.app",
			};
			firebaseApp = initializeApp(firebaseConfig);
			firebaseDatabase = getDatabase(firebaseApp);
		}

		if (firebaseApp) {
			const auth = getAuth(firebaseApp);

			const unsubscribe = onAuthStateChanged(auth, (user) => {
				if (user) {
					console.log("User is already signed in:", user.uid);
					setUserId(user.uid);
					setSignedIn(true);
				} else {
					console.log("No user found, attempting to sign in anonymously...");
					setPersistence(auth, browserLocalPersistence).then(() => {
						signInToFirebase(auth);
					});
				}
			});
			return () => unsubscribe();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<FirebaseContext.Provider
			value={{
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
