import { useState, useEffect, useRef } from "react";

const useInfoMessage = () => {
	const [infoMessage, setInfoMessage] = useState<string | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const updateInfoMessage = (message: string | null) => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
		}
		setInfoMessage(message);
		if (message !== null) {
			timeoutRef.current = setTimeout(() => {
				setInfoMessage(null);
			}, 5000);
		}
	};

	return { infoMessage, updateInfoMessage };
};

export default useInfoMessage;
