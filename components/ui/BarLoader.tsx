import { useEffect, useRef, useState } from "react";

const BarLoader: React.FC = () => {
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [percentage, setPercentage] = useState<number>(0);

	const getRand = () => {
		return Math.random() * 100;
	};

	useEffect(() => {
		if (intervalRef.current === null) {
			intervalRef.current = setInterval(() => {
				const _percentage = getRand();
				setPercentage(_percentage);
			}, 1200);
		}
		return () => {
			intervalRef.current = null;
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				setPercentage(100);
			}
		};
	}, []);

	return (
		<div>
			<p>Loaded: {Math.floor(percentage)}%</p>
			<div className="w-80 h-4 relative bg-military rounded-md overflow-hidden">
				<div
					className={`w-full h-full absolute top-0 left-0 bg-lime transform transition-transform origin-left box-content ease-bouncy-2 duration-500`}
					style={{ transform: `scaleX(${percentage}%)` }}
				></div>
			</div>
		</div>
	);
};

export default BarLoader;
