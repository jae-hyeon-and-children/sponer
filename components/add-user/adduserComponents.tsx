"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "@/components/global/modal";
import { showDefaultModalState, modalMessageState } from "@/recoil/atoms";
import { useRecoilState } from "recoil";

export default function AdduserPageComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showModal, setShowModal] = useRecoilState(showDefaultModalState);
  const [modalMessage, setModalMessage] = useRecoilState(modalMessageState);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSelection = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextClick = () => {
    if (selectedOption === "stylist") {
      router.push("/add-user/stylist-user");
    } else if (selectedOption === "brand") {
      router.push("/add-user/brand-user");
    } else {
      setModalMessage("소속을 선택해주세요.");
      setShowModal(true);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Modal onClose={() => setShowModal(false)}>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">알림</h2>
          <p className="mb-4">{modalMessage}</p>
          <button
            className="border bg-primary rounded-full w-40 h-10 flex justify-center items-center"
            onClick={() => setShowModal(false)}
          >
            <span className="label-1 text-gray-100">닫기</span>
          </button>
        </div>
      </Modal>
      <div className="flex flex-col justify-center items-center px-4">
        <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
          <div className="flex flex-col items-start w-full md:w-[50%] gap-2">
            <div className="w-full mb-5">
              <div className="caption w-16 bg-gray-700 border rounded-full text-gray-100 text-center">
                step 1
              </div>
            </div>
            <div className="display text-gray-900 text-[2rem] mb-10 text-start md:text-left">
              소속을 선택해 주세요
            </div>
            <div className="flex justify-center lg:justify-center w-full">
              <div className="flex flex-col items-center lg:items-center w-full">
                <div
                  className={`w-full h-full box-border border mt-2 rounded-lg cursor-pointer ${
                    selectedOption === "stylist"
                      ? "bg-primary text-gray-100"
                      : "text-gray-800"
                  }`}
                  onClick={() => handleSelection("stylist")}
                >
                  <div className="p-4 heading-2">스타일리스트</div>
                  <div
                    className={`p-4 paragraph-2 ${
                      selectedOption === "stylist"
                        ? "text-gray-50"
                        : "text-gray-400"
                    }`}
                  >
                    공간의 제약 없이 브랜드와 직접적인 메시지를 주고 받을 수
                    있으며 일정을 조율할 수 있습니다.
                  </div>
                </div>
                <div
                  className={`w-full h-full box-border border mt-10 rounded-lg cursor-pointer ${
                    selectedOption === "brand"
                      ? "bg-primary text-gray-50"
                      : "text-gray-800"
                  }`}
                  onClick={() => handleSelection("brand")}
                >
                  <div className="p-4 heading-2">브랜드</div>
                  <div
                    className={`p-4 paragraph-2 ${
                      selectedOption === "brand"
                        ? "text-gray-50"
                        : "text-gray-400"
                    }`}
                  >
                    브랜드는 획기적인 가격과 공간의 제약 없이 제품을 업로드할 수
                    있습니다.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center w-full mt-10">
              <button
                className="border bg-primary rounded-full w-96 h-14 flex justify-center items-center"
                onClick={handleNextClick}
              >
                <span className="label-1 text-gray-100">다음으로</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
