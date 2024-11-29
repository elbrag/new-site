import { GameName } from "../types/game";

export const updateState = (
	prevState: any,
	game: GameName,
	newData: any,
	key: string
): any => {
	const existingIndex = prevState.findIndex((item: any) => item.game === game);
	const shouldReset = Array.isArray(newData) && newData.length === 0;

	if (existingIndex !== -1) {
		return prevState.map((item: any, index: number) => {
			if (index === existingIndex) {
				if (Array.isArray(item[key])) {
					// If the key is an array, add the new data if it's not already in the array
					return {
						...item,
						[key]: shouldReset
							? []
							: item[key].includes(newData[0])
							? item[key]
							: [...item[key], ...newData],
					};
				} else {
					// If the key is not an array, just replace the old data with the new data
					return {
						...item,
						[key]: newData,
					};
				}
			}
			return item;
		});
	}

	return [...prevState, { game: game, [key]: newData }];
};
