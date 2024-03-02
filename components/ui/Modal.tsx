interface ModalProps {
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
	return (
		<div className="modal text-military fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-1">
			<div className="bg-paper py-4 px-6 lg:py-8 lg:px-12 w-screen max-w-144 flex flex-col items-center rounded-xl">
				{children}
			</div>
			<div className="modal-overlay w-full h-full -z-1 bg-military opacity-50 absolute top-0 left-0"></div>
		</div>
	);
};

export default Modal;
