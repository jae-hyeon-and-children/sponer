"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/global/input";
import AddressForm from "@/components/global/address";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { auth } from "@/config/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import useToast from "@/libs/hook/useToast";

export default function StylistUser() {
  const router = useRouter();
  const [profilephoto, setProfilephoto] = useState<string | null>(null);
  const [isValidSize, setIsValidSize] = useState<boolean>(true);
  const [uid, setUid] = useState<string | null>(null);
  const showToast = useToast();

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setProfilephoto(url);
    setIsValidSize(file.size <= 4 * 1024 * 1024);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uid) return;

    const formData = new FormData(event.currentTarget);
    formData.append("uid", uid);
    console.log("FormData:", Object.fromEntries(formData.entries()));

    try {
      const response = await fetch("/api/upload-stylist-user", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Response:", result);

      if (result.success) {
        showToast("사용자 추가 성공", "success");
        router.push("/");
      } else {
        showToast(result.message, "error");
        console.error("Error:", result.message);
      }
    } catch (error) {
      showToast("서버 오류가 발생했습니다.", "error");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center px-4 pt-40">
        <div className="flex flex-col items-center max-w-screen-2xl w-full">
          <div className="w-full mb-5">
            <div className="caption w-16 bg-gray-700 border rounded-full text-gray-100 text-center">
              step 2
            </div>
            <div className="display text-gray-900 w-[15.5rem]">
              프로필에 필요한 정보를 입력해 주세요
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center mt-16 w-full gap-7"
          >
            <div className="w-full mb-10">
              <h2 className="text-2xl font-semibold mb-4">기본 정보</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center ">
                  <span className="lg:w-1/4 flex-shrink-0 whitespace-nowrap text-gray-900">
                    프로필 사진 *
                  </span>
                  <div className="flex justify-center lg:w-3/4 w-full">
                    <label
                      htmlFor="photo"
                      className="border box-border aspect-square flex items-center justify-center flex-col text-neutral-300 border-gray-400 rounded-full cursor-pointer bg-center bg-cover w-32 h-32 lg:w-52 lg:h-52"
                      style={{
                        backgroundImage: profilephoto
                          ? `url(${profilephoto})`
                          : "none",
                      }}
                    >
                      {profilephoto === null && (
                        <>
                          <PhotoIcon className="w-16 ㅣ" />
                          <div className="text-neutral-400 text-sm ">
                            사진을 추가해주세요.
                          </div>
                        </>
                      )}
                      <Input
                        id="photo"
                        name="photo"
                        type="file"
                        required
                        accept="image/*"
                        className="hidden"
                        onChange={onImageChange}
                      />
                    </label>
                  </div>
                  {!isValidSize && (
                    <div className="text-red-500 text-center mt-2">
                      이미지 크기는 4MB 이하여야 합니다.
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-row items-center w-full gap-2">
                  <span className="lg:w-1/4 flex-shrink-0 whitespace-nowrap text-gray-900">
                    이름 *
                  </span>
                  <div className="lg:w-3/4 w-full">
                    <Input
                      name="name"
                      type="text"
                      placeholder="이름"
                      required
                    />
                  </div>
                </div>

                <div className="flex lg:flex-row items-center w-full gap-2">
                  <span className="lg:w-1/4 flex-shrink-0 whitespace-nowrap text-gray-900">
                    닉네임 *
                  </span>
                  <div className="lg:w-3/4 w-full">
                    <Input
                      name="nickname"
                      type="text"
                      placeholder="닉네임"
                      required
                    />
                  </div>
                </div>

                <div className="flex lg:flex-row items-center w-full gap-2">
                  <span className="lg:w-1/4 flex-shrink-0 whitespace-nowrap text-gray-900">
                    연락처 *
                  </span>
                  <div className="lg:w-3/4 w-full">
                    <Input
                      name="phoneNumber"
                      type="tel"
                      placeholder="010-1234-5678"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mb-10">
              <h2 className="text-2xl font-semibold mb-4">주소</h2>
              <div className="flex flex-col gap-4 w-full">
                <AddressForm />
              </div>
            </div>

            <div className="w-full mb-10">
              <h2 className="text-2xl font-semibold mb-4">기타 정보</h2>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex lg:flex-row items-center w-full gap-2">
                  <span className="lg:w-1/4 flex-shrink-0 whitespace-nowrap text-gray-900">
                    소속 *
                  </span>
                  <div className="lg:w-3/4 w-full">
                    <Input
                      name="affiliation"
                      type="text"
                      placeholder="ex) 프리랜서, 회사, 방송국 소속 등"
                    />
                  </div>
                </div>

                <div className="flex lg:flex-row items-center w-full gap-2">
                  <span className="lg:w-1/4 flex-shrink-0 whitespace-nowrap text-gray-900">
                    이메일 *
                  </span>
                  <div className="lg:w-3/4 w-full">
                    <Input
                      name="email"
                      type="email"
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                className="border box-border bg-primary rounded-full w-96 h-14 flex justify-center items-center"
                type="submit"
              >
                <span className="label-1 text-gray-100">신청하기</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
