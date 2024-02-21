import Button from "@/components/ui/Button";
import React, { useRef, useState } from "react";

interface ResetButtonProps {
	onSubmit: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onSubmit }) => {
	const [showQuestion, setShowQuestion] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const onClick = () => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
		}
		setShowQuestion(true);
		timeoutRef.current = setTimeout(() => {
			setShowQuestion(false);
		}, 6000);
	};

	return (
		<div className="flex items-center gap-4">
			<Button onClick={onClick} label="Reset" />
			{showQuestion && (
				<div className="flex gap-2">
					Do you really want to reset?
					<a
						onClick={() => {
							setShowQuestion(false);
							onSubmit();
						}}
					>
						Yes
					</a>
					<a onClick={() => setShowQuestion(false)}>No</a>
				</div>
			)}
		</div>
	);
};

export default ResetButton;
