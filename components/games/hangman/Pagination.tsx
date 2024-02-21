import React from "react";

interface PaginationProps {
	itemLength: number;
	onClick: (index: number) => void;
	activeItemIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({
	itemLength,
	onClick,
	activeItemIndex,
}) => {
	return (
		<ul className="flex gap-6">
			{Array.from({ length: itemLength }, (_, index) => (
				<li key={`page-${index}`}>
					<button
						onClick={() => onClick(index)}
						className={`py-4 px-5 rounded-lg border border-black ${
							activeItemIndex === index ? "bg-black text-cream" : ""
						}`}
					>
						{index + 1}
					</button>
				</li>
			))}
		</ul>
	);
};

export default Pagination;
