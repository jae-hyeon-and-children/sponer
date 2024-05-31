"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/global/header";
import { auth } from "@/config/firebase/firebase";
import {
  PATH_ADD_USER,
  PATH_BRAND_USER,
  PATH_STYLELIST_USER,
} from "@/constants/variables";

export default function AdduserType() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const router = useRouter();
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) {
      router.push("/login");
    }
  }, [uid, router]);

  const handleSelection = (option: string) => {
    console.log(option);
    setSelectedOption(option);
  };

  const handleNextClick = () => {
    console.log(selectedOption);

    if (selectedOption === PATH_STYLELIST_USER) {
      router.push(`/${PATH_ADD_USER}/${PATH_STYLELIST_USER}`);
    } else if (selectedOption === PATH_BRAND_USER) {
      router.push(`/${PATH_ADD_USER}/${PATH_BRAND_USER}`);
    } else {
      alert("소속을 선택하세요.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center pt-60 px-4">
        <div className="flex flex-col md:flex-row max-w-screen-2xl w-full">
          <div className="flex flex-col justify-center items-center md:w-1/2">
            <Image
              src="/ggobok222.png"
              alt="Logo"
              width={852}
              height={814}
              className="hidden md:block"
            />
          </div>
          <div className="flex flex-col items-start justify-center md:w-1/2 h-[814px] p-4 md:pl-[100px] gap-2">
            <div className="w-full mb-5">
              <div className="caption w-[4rem] f-[1.5rem] bg-gray-700 border rounded-[3.5rem] text-gray-100 text-center">
                step 1
              </div>
            </div>
            <div className="display text-gray-900 text-[2rem] mb-10 text-center md:text-left">
              소속을 선택해 주세요
            </div>
            <div className="flex justify-center lg:justify-start w-full">
              <div className="flex flex-col items-center lg:items-start w-full">
                <div
                  className={`w-[29rem] h-[10.5rem] border mt-2 rounded-lg cursor-pointer ${
                    selectedOption === PATH_STYLELIST_USER
                      ? "bg-primary text-gray-100"
                      : "text-gray-800"
                  }`}
                  onClick={() => handleSelection(PATH_STYLELIST_USER)}
                >
                  <div className="p-4 heading-2">스타일리스트</div>
                  <div
                    className={`p-4 paragraph-2 ${
                      selectedOption === PATH_STYLELIST_USER
                        ? "text-gray-50"
                        : "text-gray-400"
                    }`}
                  >
                    공간의 제약 없이 브랜드와 직접적인 메시지를 주고 받을 수
                    있으며 일정을 조율할 수 있습니다.
                  </div>
                </div>
                <div
                  className={`w-[29rem] h-[10.5rem] border mt-10 rounded-lg cursor-pointer ${
                    selectedOption === PATH_BRAND_USER
                      ? "bg-primary text-gray-50"
                      : "text-gray-800"
                  }`}
                  onClick={() => handleSelection(PATH_BRAND_USER)}
                >
                  <div className="p-4 heading-2">브랜드</div>
                  <div
                    className={`p-4 paragraph-2 ${
                      selectedOption === PATH_BRAND_USER
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
            <div className="flex items-center justify-start w-full mt-10">
              <button
                className="border bg-primary rounded-[3.5rem] w-96 h-14 flex justify-center items-center"
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
