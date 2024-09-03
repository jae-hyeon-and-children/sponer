"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { showDefaultModalState, toastState } from "@/recoil/atoms";
import Toast from "@/components/global/toast";

function AdduserPageSkeleton() {
  return (
    <main className="flex flex-col justify-center items-center px-4">
      <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
        <section className="flex flex-col items-start w-full md:w-[50%] gap-2 animate-pulse">
          <div className="w-full mb-5">
            <span className="caption w-16 bg-gray-300 border rounded-full text-gray-300 text-center">
              step 1
            </span>
          </div>
          <h1 className="display text-gray-300 text-[2rem] mb-10 text-start md:text-left">
            소속을 선택해 주세요
          </h1>
          <div className="flex justify-center lg:justify-center w-full">
            <div className="flex flex-col items-center lg:items-center w-full">
              <div className="w-full h-24 box-border border bg-gray-200 mt-2 rounded-lg cursor-pointer"></div>
              <div className="w-full h-24 box-border border bg-gray-200 mt-10 rounded-lg cursor-pointer"></div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full mt-10">
            <div className="border bg-gray-300 rounded-full w-96 h-14 flex justify-center items-center"></div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AdduserPageComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // const [showModal, setShowModal] = useRecoilState(showDefaultModalState);
  const [toast, setToast] = useRecoilState(toastState);

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
      setToast({
        isVisible: true,
        message: "소속을 선택해주세요.",
        type: "error",
      });
    }
  };

  if (status === "loading") {
    return <AdduserPageSkeleton />;
  }

  return (
    <>
      <Toast />
      <main className="flex flex-col justify-center items-center px-4">
        <div className="flex flex-col items-center md:flex-row max-w-screen-2xl w-full h-screen justify-center">
          <section className="flex flex-col items-start w-full md:w-[50%] gap-2">
            <div className="w-full mb-5">
              <div className="caption w-16 h-5 bg-gray-900 border rounded-full text-gray-100 text-center text-lg">
                step 1
              </div>
            </div>
            <h1 className="display text-gray-900 text-[2rem] mb-10 text-start md:text-left">
              소속을 선택해 주세요
            </h1>
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
                    더 이상 협찬사에 발품을 팔지 않아도 브랜드에게 편하게 제품
                    협찬을 받을 수 있어요.
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
                    내 브랜드 제품을 연예인에게 협찬 할 수 있어요.
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
          </section>
        </div>
      </main>
    </>
  );
}
