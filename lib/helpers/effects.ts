export const createRandomRotationsArray = () => {
	const numbersArray = [];
	const numberOfNumbers = 40;
	const maxRotationValue = 12;

	for (let i = 0; i < numberOfNumbers; i++) {
		const randomNumber =
			Math.random() * (maxRotationValue - -maxRotationValue) +
			-maxRotationValue;
		numbersArray.push(randomNumber);
	}

	return numbersArray;
};

export const getRandomColor = () =>
	`#${Math.floor(Math.random() * 16777215).toString(16)}`;
