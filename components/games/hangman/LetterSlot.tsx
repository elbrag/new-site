import React from "react";

interface LetterSlotProps {
	letter?: string;
}

const LetterSlot: React.FC<LetterSlotProps> = ({ letter = null }) => {
	console.log(letter);
	return (
		<div className="w-10 h-16 flex items-center justify-center">
			{letter && <p>{letter.toUpperCase()}</p>}
		</div>
	);
};

export default LetterSlot;
