import { useEffect, useState } from "react";

const useRounds = () => {
	const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
	const [roundLength, setRoundLength] = useState<number | null>(null);
	const [roundComplete, setRoundComplete] = useState(false);
	const [roundFailed, setRoundFailed] = useState(false);
	const [numberOfRounds, setNumberOfRounds] = useState(0);
	const [allRoundsPassed, setAllRoundsPassed] = useState(false);

	useEffect(() => {
		// Keep state synced with local storage values
		const storedCurrentRoundIndex = localStorage.getItem("currentRoundIndex");
		if (storedCurrentRoundIndex)
			setCurrentRoundIndex(JSON.parse(storedCurrentRoundIndex));
	}, []);

	return {
		currentRoundIndex,
		setCurrentRoundIndex,
		roundLength,
		setRoundLength,
		roundComplete,
		setRoundComplete,
		roundFailed,
		setRoundFailed,
		numberOfRounds,
		setNumberOfRounds,
		allRoundsPassed,
		setAllRoundsPassed,
	};
};

export default useRounds;
