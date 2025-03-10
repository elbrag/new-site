import { motion } from "framer-motion";

interface ModalProps {
	children: React.ReactNode;
	onClose: () => void;
	className?: string;
	motionKey: string;
	extraPaddedOnMobile?: boolean;
}

const Modal: React.FC<ModalProps> = ({
	children,
	onClose,
	className,
	motionKey,
	extraPaddedOnMobile = true,
}) => {
	return (
		<div
			className={`modal text-military fixed top-0 left-0 w-screen h-screen flex items-start md:items-center justify-center z-20 md:pt-0 ${
				extraPaddedOnMobile ? "pt-30" : "pt-14"
			}`}
		>
			<motion.div
				key={motionKey}
				className="relative max-w-[calc(100vw-1rem)]"
				initial={{ rotate: -10, scale: 0 }}
				animate={{ rotate: 0, scale: 1 }}
				exit={{ rotate: -10, scale: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div
					className={`bg-paper p-4 lg:py-8 lg:px-12 w-screen max-w-full md:max-w-144 flex flex-col items-center rounded-xl z-1 text-center max-h-[85vh] overflow-y-auto ${className}`}
				>
					{children}
				</div>
				<motion.button
					initial={{ rotate: -180, translateY: "50%" }}
					animate={{ rotate: 0, translateY: "-100%" }}
					transition={{ duration: 0.4, delay: 0.3 }}
					className="h-10 w-10 sm:w-12 sm:h-12 absolute -top-2 right-2 -translate-y-full p-2 bg-military rounded-lg -z-1 border border-lime"
					onClick={onClose}
				>
					<div className="w-10 h-[2px] bg-lime absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm"></div>
					<div className="w-10 h-[2px] bg-lime absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-sm"></div>
				</motion.button>
			</motion.div>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.6 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.4 }}
				className="modal-overlay w-full h-full -z-2 bg-military absolute top-0 left-0"
				onClick={onClose}
			></motion.div>
		</div>
	);
};

export default Modal;
