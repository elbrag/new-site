/**
 * Fetch answers
 */
export const fetchAnswers = (endpoint: string, bodyData?: string) => {
	let data = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (bodyData) data = { ...data, ...{ body: JSON.stringify(bodyData) } };

	fetch(`/api/games/${endpoint}`, data)
		.then((response) => response.json())
		.then((_data) => {
			console.log(_data);
		})
		.catch((error) => {
			console.error(error);
		});
};
