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
