import Link from "next/link";

const BackButton: React.FC<{ className?: string }> = ({ className }) => {
	return (
		<div className="mb-6 lg:mb-8">
			<Link
				className={`underline underline-offset-3 text-sm lg:text-base ${className}`}
				href="/"
			>
				&#8610; Back to Games
			</Link>
		</div>
	);
};

export default BackButton;
