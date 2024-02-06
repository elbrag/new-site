import { useEffect, useState } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

let firebaseApp: FirebaseApp | undefined;
let firebaseDatabase: Database;

const useFirebase = () => {
	const [userId, setUserId] = useState<string | null>(null);

	// Init Firebase
	useEffect(() => {
		if (!firebaseApp) {
			const firebaseConfig = {
				databaseURL:
					"https://eb-portfolio-game-default-rtdb.europe-west1.firebasedatabase.app",
			};
			firebaseApp = initializeApp(firebaseConfig);
			firebaseDatabase = getDatabase(firebaseApp);
		}
	}, []);

	// Set user id to use when making calls to Firebase
	useEffect(() => {
		const storedUserId = localStorage.getItem("userId");
		if (storedUserId) {
			setUserId(storedUserId);
		} else {
			const newUserId = uuidv4();
			localStorage.setItem("userId", newUserId);
			setUserId(newUserId);
		}
	}, []);

	return { database: firebaseDatabase, userId };
};

export default useFirebase;
