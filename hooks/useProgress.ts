import { useEffect, useState } from "react";

const useProgress = () => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const storedProgress = localStorage.getItem("progress");
		if (storedProgress) setProgress(JSON.parse(storedProgress));
	}, []);

	const updateProgress = (incoming: number) => {
		const newProgress = progress + incoming;
		setProgress(newProgress);
		localStorage.setItem("currentProgress", JSON.stringify(newProgress));
	};

	return { progress, updateProgress };
};

export default useProgress;
