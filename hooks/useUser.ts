import { useCallback, useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";
import useFirebase from "./useFirebase";

const useUser = () => {
	const [username, setUsername] = useState<string | null>(null);
	const { database, userId } = useFirebase();

	// Get username
	const getUsername = useCallback(() => {
		if (userId) {
			const userRef = ref(database, `users/${userId}/username`);
			get(userRef)
				.then((snapshot) => {
					const username = snapshot.val();
					setUsername(username);
				})
				.catch((error) => {
					console.error("Error getting username:", error);
				});
		}
	}, [database, userId]);

	useEffect(() => {
		getUsername();
	}, [database, getUsername, userId]);

	// Update username in Firebase + set state
	const updateUsername = (username: string) => {
		const userRef = ref(database, `users/${userId}/username`);
		set(userRef, username);
		setUsername(username);
	};

	return { username, updateUsername };
};

export default useUser;
