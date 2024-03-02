import { useEffect, useState } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

let firebaseApp: FirebaseApp | undefined;
let firebaseDatabase: Database;

const useFirebase = () => {
	const [userId, setUserId] = useState<string | null>(null);
	const [signedIn, setSignedIn] = useState(false);

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
			signInToFirebase(auth);

			onAuthStateChanged(auth, (user) => {
				if (user) {
					const uid = user.uid;
					setUserId(uid);
				} else {
					console.log("User not found");
				}
			});
		}
	}, []);

	return { database: firebaseDatabase, userId };
};

export default useFirebase;
