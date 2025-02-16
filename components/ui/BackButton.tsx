import Link from "next/link";

const BackButton: React.FC<{ className?: string }> = ({ className }) => {
	return (
		<div className="back-button">
			<Link
				className={`block underline underline-offset-3 text-sm lg:text-base ${className}`}
				href="/"
			>
				&#8610; Back to Games
			</Link>
		</div>
	);
};

export default BackButton;
