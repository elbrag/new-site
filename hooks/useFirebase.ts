import { useEffect } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";

let firebaseApp: FirebaseApp | undefined;
let firebaseDatabase: Database;

const useFirebase = () => {
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

	return { database: firebaseDatabase };
};

export default useFirebase;
