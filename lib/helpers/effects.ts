export const createRandomRotationsArray = () => {
	const numbersArray = [];
	for (let i = 0; i < 10; i++) {
		const randomNumber = Math.random() * (12 - -12) + -12;
		numbersArray.push(randomNumber);
	}
	return numbersArray;
};
