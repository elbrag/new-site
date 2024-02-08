import React from "react";

interface InfoMessageProps {
	text: string;
}

const InfoMessage: React.FC<InfoMessageProps> = ({ text }) => {
	return <div className="px-10 py-6 rounded-xl">{text}</div>;
};

export default InfoMessage;
