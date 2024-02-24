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
		<ul className="flex gap-2 items-center">
			{Array.from({ length: itemLength }, (_, index) => (
				<li key={`page-${index}`}>
					<button
						onClick={() => onClick(index)}
						className={`py-3 px-4 rounded-lg border-2 border-military ${
							activeItemIndex === index ? "bg-military text-paper" : ""
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
