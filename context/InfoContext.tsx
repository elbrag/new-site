/**
 * Info Context
 *
 * For general info and help
 */

import { createContext, useState } from "react";

interface InfoContextProps {
	showUsernameModal: boolean;
	setShowUsernameModal: (_value: boolean) => void;
	showIntroModal: boolean;
	setShowIntroModal: (_value: boolean) => void;
}

export const InfoContext = createContext<InfoContextProps>({
	showUsernameModal: false,
	setShowUsernameModal: () => {},
	showIntroModal: false,
	setShowIntroModal: () => {},
});

interface InfoContextProviderProps {
	children: React.ReactNode;
}

const InfoContextProvider = ({ children }: InfoContextProviderProps) => {
	// States
	const [showUsernameModal, setShowUsernameModal] = useState(false);
	const [showIntroModal, setShowIntroModal] = useState(false);

	return (
		<InfoContext.Provider
			value={{
				showUsernameModal,
				setShowUsernameModal,
				showIntroModal,
				setShowIntroModal,
			}}
		>
			{children}
		</InfoContext.Provider>
	);
};

export default InfoContextProvider;
