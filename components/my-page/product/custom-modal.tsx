import { useEffect } from "react";
import Image from "next/image";
import IcClose from "@/public/icons/ic_close.png";

interface CustomModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomModal({
  children,
  isOpen,
  onClose,
}: CustomModalProps) {
  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <section className="w-screen h-screen inset-0 fixed flex justify-center items-center z-40 overflow-scroll scrollbar-hide">
      <div
        onClick={onClose}
        className="w-full h-full bg-gray-700/30 absolute backdrop-blur-sm"
      ></div>
      <div className="bg-white max-w-5xl max-h-full rounded-lg p-7 z-50">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <Image src={IcClose} alt="Close" width={20} height={20} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh]">
          {children ||
            "아직 해당 물품은 가이드 표가 아직 준비되어 있지 않습니다."}
        </div>
      </div>
    </section>
  );
}
