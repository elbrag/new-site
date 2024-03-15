import Button from "@/components/ui/Button";
import React, { useRef, useState } from "react";

interface ResetButtonProps {
	onSubmit: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onSubmit }) => {
	const [showRound, setShowRound] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const onClick = () => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
		}
		setShowRound(true);
		timeoutRef.current = setTimeout(() => {
			setShowRound(false);
		}, 6000);
	};

	return (
		<div className="flex items-center gap-4">
			<Button onClick={onClick} label="Reset" />
			{showRound && (
				<div className="flex gap-2">
					Do you really want to reset?
					<a
						onClick={() => {
							setShowRound(false);
							onSubmit();
						}}
					>
						Yes
					</a>
					<a onClick={() => setShowRound(false)}>No</a>
				</div>
			)}
		</div>
	);
};

export default ResetButton;
