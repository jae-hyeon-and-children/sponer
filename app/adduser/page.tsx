"use client";

import Image from "next/image";
import { useState } from "react";
import NavBar from "../components/header";
import { useRouter } from "next/navigation";

export default function AdduserType() {
  const [selectedOption, setSelectedOption] = useState("");
  const router = useRouter();

  const handleSelection = (option: any) => {
    console.log(option);
    setSelectedOption(option);
  };

  const handleNextClick = () => {
    console.log(selectedOption);

    if (selectedOption === "stylistuser") {
      router.push("/adduser/stylistuser");
    } else if (selectedOption === "branduser") {
      router.push("/adduser/branduser");
    } else {
      alert("소속을 선택하세요.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-center max-w-screen-2xl pt-60">
        <div className="flex flex-col justify-around ">
          <Image
            src="/ggobok222.png"
            alt="Logo"
            layout="fixed"
            width={852}
            height={814}
            className="cursor-pointer"
          />
        </div>

        <div className="flex flex-col m-auto items-start w-[852px] h-[814px] pl-[100px]">
          <div className="w-[65px] f-[25px] bg-gray-900 border rounded-lg text-center text-gray-100 mb-5  mt-[120px] ">
            step 1
          </div>
          <div className="font-medium text-[30px]">소속을 선택해 주세요</div>
          <div
            className={`w-[500px] h-[170px] border mt-10 rounded-lg cursor-pointer ${
              selectedOption === "stylistuser" ? "bg-primary text-gray-100" : ""
            }`}
            onClick={() => handleSelection("stylistuser")}
          >
            <div className="p-4 font-semibold">스타일리스트</div>
            <div className="p-4 font-light">
              공간의 제약 없이 브랜드와 직접적인 메시지를 주고 받을 수 있으며
              일정을 조율할 수 있습니다.
            </div>
          </div>
          <div
            className={`w-[500px] h-[170px] border mt-10 rounded-lg cursor-pointer ${
              selectedOption === "branduser" ? "bg-primary text-gray-100" : ""
            }`}
            onClick={() => handleSelection("branduser")}
          >
            <div className="p-4 font-semibold">브랜드</div>
            <div className="p-4 font-light">
              브랜드는 획기적인 가격과 공간의 제약없이 제품을 업로드 할 수
              있습니다.
            </div>
          </div>
          <div className="flex flex-col items-center mt-10">
            <button
              className="border bg-primary  text-gray-100 rounded-[40px] w-[200px] h-[50px]"
              onClick={handleNextClick}
            >
              다음으로
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
