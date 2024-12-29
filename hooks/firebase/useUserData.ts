import { ref, set, get, Database } from "firebase/database";
import { UserDataColumn, UserDataValueType } from "@/lib/types/userData";

const useUserData = () => {
	/**
	 * Update user data in Firebase
	 */
	const updateUserData = async (
		firebaseDatabase: Database,
		userId: string,
		column: UserDataColumn,
		value: UserDataValueType
	): Promise<void> => {
		const dbref = ref(firebaseDatabase, `users/${userId}/${column}`);
		set(dbref, value);
	};

	/**
	 * Get user data from Firebase
	 *
	 * Returns snapshot value
	 */
	const getUserData = async (
		firebaseDatabase: Database,
		userId: string,
		column: UserDataColumn
	): Promise<unknown> => {
		const dbref = ref(firebaseDatabase, `users/${userId}/${column}`);
		try {
			const snapshot = await get(dbref);
			const dbVal = snapshot.val();
			return dbVal;
		} catch (error) {
			console.error(`Error getting ${column}:`, error);
			throw error;
		}
	};

	return { updateUserData, getUserData };
};

export default useUserData;
