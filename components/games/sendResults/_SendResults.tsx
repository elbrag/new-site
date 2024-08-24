import React from "react";

interface SendResultsProps {
	gameData: [];
}

const SendResults: React.FC<SendResultsProps> = ({ gameData }) => {
	return <div className="px-6 lg:px-12">SendResults</div>;
};

export default SendResults;
