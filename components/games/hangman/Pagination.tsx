import React from "react";

interface PaginationProps {
	itemLength: number;
	activeItemIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({
	itemLength,
	activeItemIndex,
}) => {
	return (
		<div>
			{activeItemIndex + 1} / {itemLength}
		</div>
	);
};

export default Pagination;
