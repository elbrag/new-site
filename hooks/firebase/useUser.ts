import { useState } from "react";
import { ref, set, get, Database } from "firebase/database";

const useUser = () => {
	const [username, setUsername] = useState<string | null>(null);

	/**
	 * Update score in Firebase + set state
	 */
	const updateFirebaseUsername = (
		firebaseDatabase: Database,
		userId: string,
		username: string
	) => {
		const userRef = ref(firebaseDatabase, `users/${userId}/username`);
		set(userRef, username);
		setUsername(username);
	};

	/**
	 * Get username from Firebase
	 */
	const getFirebaseUsername = (firebaseDatabase: Database, userId: string) => {
		const userRef = ref(firebaseDatabase, `users/${userId}/username`);
		get(userRef)
			.then((snapshot) => {
				const username = snapshot.val();
				setUsername(username);
			})
			.catch((error) => {
				console.error("Error getting username:", error);
			});
	};

	return { username, getFirebaseUsername, updateFirebaseUsername };
};

export default useUser;
