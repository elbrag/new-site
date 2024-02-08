import { useEffect, useState } from "react";

const useInfoMessage = () => {
	const [infoMessage, setInfoMessage] = useState<string | null>(null);

	// Reset info message on routing
	useEffect(() => {
		setInfoMessage(null);
	}, []);

	useEffect(() => {
		let timeout: any;
		if (infoMessage != null) {
			timeout = setTimeout(() => {
				setInfoMessage(null);
			}, 5000);
		}
		return () => {
			clearTimeout(timeout);
		};
	}, [infoMessage]);

	return { infoMessage, setInfoMessage };
};

export default useInfoMessage;
