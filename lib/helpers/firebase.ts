import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	databaseURL:
		"https://eb-portfolio-game-default-rtdb.europe-west1.firebasedatabase.app",
};
