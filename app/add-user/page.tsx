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
      <div className="flex flex-col justify-center items-center h-screen px-4 ">
        {/* 기억이 안나서 일단 헤더와 컨텐츠 사이에 간격을 만들어 줌 */}
        <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
          <div className="flex flex-col items-start  w-full md:w-[50%] gap-2">
            <div className="w-full mb-5">
              <div className="caption w-16  bg-gray-700 border rounded-full text-gray-100 text-center">
                step 1
              </div>
            </div>
            <div className="display text-gray-900 text-[2rem] mb-10 text-start md:text-left">
              소속을 선택해 주세요
            </div>
            <div className="flex justify-center lg:justify-center w-full">
              <div className="flex flex-col items-center lg:items-center w-full">
                <div
                  className={`w-full h-full border mt-2 rounded-lg cursor-pointer ${
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
                    있으며 일정을 조율할 수 있습니다.공간의 제약 없이 브랜드와
                    직접적인 메시지를 주고 받을 수 있으며 일정을 조율할 수
                    있습니다.공간의 제약 없이 브랜드와 직접적인 메시지를 주고
                    받을 수 있으며 일정을 조율할 수 있습니다.공간의 제약 없이
                    브랜드와 직접적인 메시지를 주고 받을 수 있으며 일정을 조율할
                    수 있습니다.공간의 제약 없이 브랜드와 직접적인 메시지를 주고
                    받을 수 있으며 일정을 조율할 수 있습니다.
                  </div>
                </div>
                <div
                  className={`w-full h-full border mt-10 rounded-lg cursor-pointer ${
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
                    있습니다.브랜드는 획기적인 가격과 공간의 제약 없이 제품을
                    업로드할 수 있습니다.브랜드는 획기적인 가격과 공간의 제약
                    없이 제품을 업로드할 수 있습니다.브랜드는 획기적인 가격과
                    공간의 제약 없이 제품을 업로드할 수 있습니다.브랜드는
                    획기적인 가격과 공간의 제약 없이 제품을 업로드할 수
                    있습니다.브랜드는 획기적인 가격과 공간의 제약 없이 제품을
                    업로드할 수 있습니다.
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
