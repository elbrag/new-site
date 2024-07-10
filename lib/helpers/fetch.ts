/**
 * Fetch game data wrapper
 */
export const fetchGameData = async (
	endpoint: string,
	method: "POST" | "GET" = "POST",
	bodyData?: any
): Promise<any> => {
	let data = {
		method,
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (bodyData) data = { ...data, ...{ body: JSON.stringify(bodyData) } };

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SITE_URL}/api/games/${endpoint}`,
			data
		);
		const jsonData = await response.json();
		return jsonData;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
