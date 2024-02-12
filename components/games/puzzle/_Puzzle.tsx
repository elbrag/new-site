import React from "react";

interface PuzzleProps {
	gameData: any;
}

const Puzzle: React.FC<PuzzleProps> = ({ gameData }) => {
	return <div className="px-6 lg:px-12">Puzzle</div>;
};

export default Puzzle;
