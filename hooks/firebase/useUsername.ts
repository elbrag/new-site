import { useState } from "react";
import { Database } from "firebase/database";
import useUserData from "./useUserData";

const useUsername = () => {
	const [username, setUsername] = useState<string | null>(null);
	const { updateUserData, getUserData } = useUserData();

	/**
	 * Update score in Firebase + set state
	 */
	const updateFirebaseUsername = async (
		firebaseDatabase: Database,
		userId: string,
		_username: string
	) => {
		await updateUserData(firebaseDatabase, userId, "username", _username);
		setUsername(_username);
	};

	/**
	 * Get username from Firebase
	 */
	const getFirebaseUsername = async (
		firebaseDatabase: Database,
		userId: string
	) => {
		const _username = await getUserData(firebaseDatabase, userId, "username");
		setUsername(_username);
	};

	return { username, getFirebaseUsername, updateFirebaseUsername };
};

export default useUsername;
