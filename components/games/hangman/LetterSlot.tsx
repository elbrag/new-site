import React from "react";

interface LetterSlotProps {
	letter: string | null;
}

const LetterSlot: React.FC<LetterSlotProps> = ({ letter = null }) => {
	return (
		<div className="w-5 sm:w-8 lg:w-10 h-10 lg:h-16 flex items-end justify-center text-lg sm:text-xl lg:text-2xl">
			{letter && <p>{letter.toUpperCase()}</p>}
		</div>
	);
};

export default LetterSlot;
