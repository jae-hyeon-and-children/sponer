import React, { useEffect, ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	children,
}) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed w-screen h-screen flex items-center justify-center bg-black/70 backdrop-blur-sm z-20"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="bg-white p-6 rounded-md shadow-md">
				{children}
				<div className="mt-4 flex justify-end gap-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-300 rounded-md"
					>
						취소
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-red-500 text-white rounded-md"
					>
						탈퇴하기
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
