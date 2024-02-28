import { useState, useEffect, useRef } from "react";

const useInfoMessage = () => {
	const [infoMessage, setInfoMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [failedMessage, setFailedMessage] = useState<string | null>(null);
	const [scoreMessage, setScoreMessage] = useState<string | null>(null);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const failedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const scoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}
			if (successTimeoutRef.current !== null) {
				clearTimeout(successTimeoutRef.current);
			}
			if (failedTimeoutRef.current !== null) {
				clearTimeout(failedTimeoutRef.current);
			}
			if (scoreTimeoutRef.current !== null) {
				clearTimeout(scoreTimeoutRef.current);
			}
		};
	}, []);

	/**
	 * Update info message
	 */
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

	/**
	 * Update success message
	 */
	const updateSuccessMessage = (message: string | null) => {
		if (successTimeoutRef.current !== null) {
			clearTimeout(successTimeoutRef.current);
		}
		setSuccessMessage(message);
		if (message !== null) {
			successTimeoutRef.current = setTimeout(() => {
				setSuccessMessage(null);
			}, 3000);
		}
	};

	/**
	 * Update failed message
	 */
	const updateFailedMessage = (message: string | null) => {
		if (failedTimeoutRef.current !== null) {
			clearTimeout(failedTimeoutRef.current);
		}
		setFailedMessage(message);
		if (message !== null) {
			failedTimeoutRef.current = setTimeout(() => {
				setFailedMessage(null);
			}, 3000);
		}
	};

	/**
	 * Update score message
	 */
	const updateScoreMessage = (message: string | null) => {
		if (scoreTimeoutRef.current !== null) {
			clearTimeout(scoreTimeoutRef.current);
		}
		setScoreMessage(message);
		if (message !== null) {
			scoreTimeoutRef.current = setTimeout(() => {
				setScoreMessage(null);
			}, 4000);
		}
	};

	// Nice to have: re-animate message even if it's the same message

	return {
		infoMessage,
		updateInfoMessage,
		successMessage,
		updateSuccessMessage,
		failedMessage,
		updateFailedMessage,
		scoreMessage,
		updateScoreMessage,
	};
};

export default useInfoMessage;
