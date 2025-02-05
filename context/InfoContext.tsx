/**
 * Info Context
 *
 * For general info and help
 */

import { createContext, useState } from "react";

interface InfoContextProps {
	showUsernameModal: boolean;
	setShowUsernameModal: (_value: boolean) => void;
}

export const InfoContext = createContext<InfoContextProps>({
	showUsernameModal: false,
	setShowUsernameModal: () => {},
});

interface InfoContextProviderProps {
	children: React.ReactNode;
}

const InfoContextProvider = ({ children }: InfoContextProviderProps) => {
	// States
	const [showUsernameModal, setShowUsernameModal] = useState(false);

	return (
		<InfoContext.Provider
			value={{
				showUsernameModal,
				setShowUsernameModal,
			}}
		>
			{children}
		</InfoContext.Provider>
	);
};

export default InfoContextProvider;
