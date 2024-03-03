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
import { ref, set, get } from "firebase/database";

let firebaseApp: FirebaseApp | undefined;
let firebaseDatabase: Database;

interface FirebaseContextProps {
	currentScore: number;
	updateScoreInFirebase: (incoming: number) => void;
	username: string | null;
	updateUsername: (username: string) => void;
}

export const FirebaseContext = createContext<FirebaseContextProps>({
	currentScore: 0,
	updateScoreInFirebase: () => {},
	username: null,
	updateUsername: () => {},
});

interface FirebaseContextProviderProps {
	children: React.ReactNode;
}

const FirebaseContextProvider = ({
	children,
}: FirebaseContextProviderProps) => {
	const [userId, setUserId] = useState<string | null>(null);
	const [signedIn, setSignedIn] = useState(false);
	const [currentScore, setCurrentScore] = useState(0);
	const [username, setUsername] = useState<string | null>(null);

	// TODO: Put in hooks to make easier to read

	// Get username
	const getUsername = useCallback(() => {
		if (userId) {
			const userRef = ref(firebaseDatabase, `users/${userId}/username`);
			get(userRef)
				.then((snapshot) => {
					const username = snapshot.val();
					setUsername(username);
				})
				.catch((error) => {
					console.error("Error getting username:", error);
				});
		}
	}, [userId]);
	useEffect(() => {
		getUsername();
	}, [getUsername]);

	// Update username in Firebase + set state
	const updateUsername = (username: string) => {
		if (userId) {
			const userRef = ref(firebaseDatabase, `users/${userId}/username`);
			set(userRef, username);
			setUsername(username);
		}
	};

	// Get score from Firebase
	const getScore = useCallback(() => {
		if (userId) {
			const scoreRef = ref(firebaseDatabase, `users/${userId}/score`);
			get(scoreRef)
				.then((snapshot) => {
					const score = snapshot.val();
					setCurrentScore(score === null ? 0 : score);
				})
				.catch((error) => {
					console.error("Error getting score:", error);
				});
		}
	}, [userId]);

	useEffect(() => {
		getScore();
	}, [getScore]);

	// Update score in Firebase + set state
	const updateScoreInFirebase = (incoming: any) => {
		if (userId) {
			const newScore = currentScore + incoming;
			const scoreRef = ref(firebaseDatabase, `users/${userId}/score`);
			set(scoreRef, newScore);
			setCurrentScore(newScore);
		}
	};

	/**
	 * Sign in to Firebase
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
	 */
	useEffect(() => {
		if (!firebaseApp) {
			// Initialize Firebase
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

			// Listen for auth state changes
			const unsubscribe = onAuthStateChanged(auth, (user) => {
				if (user) {
					// User is already signed in or has been authenticated
					console.log("User is already signed in:", user.uid);
					setUserId(user.uid);
					setSignedIn(true); // Ensure signedIn state is updated
				} else {
					// No user is signed in, attempt to sign in anonymously
					console.log("No user found, attempting to sign in anonymously...");
					setPersistence(auth, browserLocalPersistence).then(() => {
						signInToFirebase(auth);
					});
				}
			});

			// Cleanup subscription on unmount
			return () => unsubscribe();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<FirebaseContext.Provider
			value={{ currentScore, updateScoreInFirebase, username, updateUsername }}
		>
			{children}
		</FirebaseContext.Provider>
	);
};

export default FirebaseContextProvider;
