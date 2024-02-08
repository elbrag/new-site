import React from "react";

interface LetterSlotProps {
	letter?: string;
}

const LetterSlot: React.FC<LetterSlotProps> = ({ letter = null }) => {
	return (
		<div className="w-10 h-16 flex items-end justify-center text-lg">
			{letter && <p>{letter.toUpperCase()}</p>}
		</div>
	);
};

export default LetterSlot;
