import { showDefaultModalState } from "@/recoil/atoms";
import { useRecoilState } from "recoil";
import IcClose from "@/public/icons/ic_close.png";
import Image from "next/image";
interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const [showDefaultModal, setShowDefaultModal] = useRecoilState(
    showDefaultModalState
  );

  const closeModal = () => {
    setShowDefaultModal(false);
    if (onClose) {
      onClose();
    }
  };
  return (
    <section
      className={`${
        !showDefaultModal && "hidden"
      } py-12 w-screen h-screen fixed flex justify-center items-center z-40  overflow-scroll scrollbar-hide`}
    >
      <div
        onClick={closeModal}
        className="w-full h-full bg-gray-700/30 absolute backdrop-blur-sm"
      ></div>
      <div className="bg-white w-5/6 max-w-5xl max-h-full rounded-lg p-7 z-50 ">
        <div className="flex justify-end">
          <button onClick={closeModal}>
            <Image src={IcClose} alt="IcClose" width={20} height={20} />
          </button>
        </div>
        {children}
      </div>
    </section>
  );
}
