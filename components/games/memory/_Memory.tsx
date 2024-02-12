import React from "react";

interface MemoryProps {
	gameData: any;
}

const Memory: React.FC<MemoryProps> = ({ gameData }) => {
	return <div className="px-6 lg:px-12">Memory</div>;
};

export default Memory;
