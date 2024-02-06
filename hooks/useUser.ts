import { useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import useFirebase from "./useFirebase";

const useUser = () => {
	const [userId, setUserId] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const { database } = useFirebase();

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

	const updateUsername = (username: string) => {
		const userRef = ref(database, `users/${userId}/username`);
		set(userRef, username);
		setUsername(username);
	};

	return { username, updateUsername };
};

export default useUser;
